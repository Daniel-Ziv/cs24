import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Star, MessageCircle, Edit2, ThumbsUp, ChevronDown, ChevronUp, X } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { showNotification } from './ui/notification';
import { isAdmin } from '../config/admin';
import GoogleLoginButton from './GoogleLoginButton';

const EE_SPECIALIZATIONS = [
  'בקרה',
  'ביו הנדסה',
  'תקשורת ועיבוד אותות',
  'אלקטרואופטיקה ומיקרואלקטרוניקה',
  'אנרגיה ומערכות הספק(זרם חזק)',
  'אנרגיות חלופיות ומערכות הספק משולב',
  'מערכות משובצות מחשב'
];

const TutorCard = ({ tutor, courseType, user, onSubmitFeedback }) => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const [showReviews, setShowReviews] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const MAX_COMMENT_LENGTH = 200; // Maximum character limit for comments
  const userIsAdmin = user && isAdmin(user.email);

  // Find user's own feedback if it exists
  const userOwnFeedback = user ? tutor.feedback?.find(fb => fb.user_id === user.id) : null;
  
  // Filter reviews to show ones with comments and the user's own feedback
  const reviewsWithComments = tutor.feedback?.filter(fb => 
    fb.comment?.trim() || (user && fb.user_id === user.id)
  ) || [];
  
  // Sort reviews to show the user's own feedback first
  const sortedReviews = [...reviewsWithComments].sort((a, b) => {
    // User's own feedback comes first
    if (user && a.user_id === user.id) return -1;
    if (user && b.user_id === user.id) return 1;
    // Then sort by date (newest first)
    return new Date(b.created_at) - new Date(a.created_at);
  });
  
  // Get the reviews to display based on showAllReviews state
  const displayedReviews = showAllReviews 
    ? sortedReviews 
    : sortedReviews.slice(0, 1);

  const starColor = courseType === 'cs' ? 'text-blue-400' : 'text-purple-400';
  const hoverStarColor = courseType === 'cs' ? 'hover:text-blue-500' : 'hover:text-purple-500';
  const accentColor = courseType === 'cs' ? 'blue' : 'purple';

  const handleFeedbackClick = async () => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      setShowFeedbackForm(true);
    }
  };

  const handleLoginSuccess = (data) => {
    setShowLoginModal(false);
    // If the user just logged in and wants to submit feedback, open the feedback form
    setTimeout(() => {
      setShowFeedbackForm(true);
    }, 1000);
  };

  const handleLoginError = (error) => {
    // Error is already handled in the GoogleLoginButton component
    setShowLoginModal(false);
  };

  const handleWhatsAppClick = async (e) => {
    try {
      // Insert click record into tutor_clicks
      const { error } = await supabase
        .from('tutor_clicks')
        .insert([{
          tutor_id: tutor.id,
          clicked_at: new Date().toISOString()
        }]);
  
      // If there's a Supabase error, prevent navigation
      if (error) {
        e.preventDefault();
        console.error('Error tracking click:', error);
        // Optionally show a toast or do something else
      }
  
    } catch (err) {
      // On any unexpected error, also prevent the link from opening
      e.preventDefault();
      console.error('Error tracking click:', err);
    }
  };
  

  const handleDeleteFeedback = async (feedbackId) => {
    try {
      if (!feedbackId) {
        showNotification('שגיאה במחיקת הביקורת: מזהה חסר', 'error');
        return;
      }

      // First, verify the feedback exists
      const { data: checkData, error: checkError } = await supabase
        .from('feedback')
        .select('*')
        .eq('id', feedbackId)
        .single();
        
      if (checkError) {
        showNotification('שגיאה בבדיקת הביקורת', 'error');
        return;
      }

      // Perform the delete operation
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', feedbackId);

      if (error) {
        showNotification('שגיאה במחיקת הביקורת: ' + error.message, 'error');
        return;
      }

      showNotification('הביקורת נמחקה בהצלחה', 'success');
      
      // Remove the feedback from the local state
      const updatedFeedback = tutor.feedback.filter(fb => fb.id !== feedbackId);
      tutor.feedback = updatedFeedback;
      
      // Update the average rating
      const validRatings = updatedFeedback.filter(f => f.rating);
      tutor.average_rating = validRatings.length > 0
        ? validRatings.reduce((sum, f) => sum + f.rating, 0) / validRatings.length
        : null;
      
      // Force a re-render
      setShowReviews(showReviews);
      
      // Reload the data from the server to verify changes
      if (onSubmitFeedback) {
        // Use a timeout to allow the deletion to complete
        setTimeout(() => {
          onSubmitFeedback(tutor.id, null, null);
        }, 1000);
      }
    } catch (error) {
      showNotification('שגיאה במחיקת הביקורת', 'error');
    }
  };

  const handleCommentChange = (e) => {
    const newComment = e.target.value;
    
    // Check for character limit
    if (newComment.length > MAX_COMMENT_LENGTH) {
      setCommentError(`הערה ארוכה מדי. מוגבל ל-${MAX_COMMENT_LENGTH} תווים.`);
      return;
    }
    
    // Check for URLs/links
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([^\s]+\.(com|org|net|il|co|io))/gi;
    if (urlRegex.test(newComment)) {
      setCommentError('לא ניתן להכניס קישורים בהערות.');
      return;
    }
    
    setCommentError('');
    setComment(newComment);
  };
//check it because in the original code it was phone but in the data it was contact
  const phoneWithoutZero = tutor.contact?.substring(1) || ""; 

  return (
    <>
      <Card className={`bg-white ${courseType === 'cs' ? 'border-sky-200' : 'border-purple-200'}`}>
        <CardHeader className="pb-3">
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{tutor.name}</h3>
                <div className="flex items-center gap-1">
                  <Star className={`h-4 w-4 ${starColor} ${tutor.average_rating ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">{tutor.average_rating?.toFixed(1) || 'אין'}</span>
                  <span className="text-sm text-gray-500">({tutor.feedback?.length || 0})</span>
                </div>
              </div>
              <a
                href={`https://wa.me/972${phoneWithoutZero}`}//https://wa.me/972${tutor.phone.substring(1)}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 flex items-center justify-center rounded-md ${
                  courseType === 'cs'
                    ? 'bg-sky-600 hover:bg-sky-700'
                    : 'bg-purple-600 hover:bg-purple-700'
                } text-white transition-colors`}
                title="WhatsApp"
                onClick={handleWhatsAppClick}
              >
                <FontAwesomeIcon icon={faWhatsapp} size="xl" />
              </a>

            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600">{tutor.phone}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFeedbackClick}
                  className={`text-sm ${courseType === 'cs' ? 'text-sky-600 hover:text-sky-700' : 'text-purple-600 hover:text-purple-700'}`}
                >
                  הוסף ביקורת
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-2">
            {/* Subjects list */}
            <div className="flex flex-wrap gap-1.5 -mx-0.5">
              {tutor.subjects?.map((subject, index) => (
                <span
                  key={index}
                  className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                    courseType === 'cs'
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {subject}
                </span>
              ))}
            </div>

            {/* Reviews section */}
            {tutor.feedback?.length > 0 && (
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReviews(!showReviews)}
                  className={`text-sm ${courseType === 'cs' ? 'text-sky-600 hover:text-sky-700' : 'text-purple-600 hover:text-purple-700'}`}
                >
                  {showReviews ? 'הסתר תגובות' : `ראה תגובות (${reviewsWithComments.length})`}
                </Button>

                {/* Always show user's own feedback if it exists */}
                {userOwnFeedback && !showReviews && (
                  <div className="mt-2 space-y-2">
                    <div className="bg-blue-50 rounded-lg p-3 relative">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${i < userOwnFeedback.rating ? `${starColor} fill-current` : 'text-gray-300'}`}
                            />
                          ))}
                          <span className="text-xs text-blue-600 ml-2">(הביקורת שלך)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {userOwnFeedback.created_at && (
                            <span className="text-xs text-gray-500">
                              {format(new Date(userOwnFeedback.created_at), 'dd/MM/yyyy')}
                            </span>
                          )}
                          <button
                            onClick={() => {
                              handleDeleteFeedback(userOwnFeedback.id);
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="מחק ביקורת"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {userOwnFeedback.comment && (
                        <p className="text-sm text-gray-700 mt-1">{userOwnFeedback.comment}</p>
                      )}
                    </div>
                  </div>
                )}

                {showReviews && reviewsWithComments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {displayedReviews.map((fb, index) => {
                      const isUserOwnFeedback = user && fb.user_id === user.id;
                      return (
                      <div key={index} className={`${isUserOwnFeedback ? 'bg-blue-50' : 'bg-gray-50'} rounded-lg p-3 relative`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${i < fb.rating ? `${starColor} fill-current` : 'text-gray-300'}`}
                              />
                            ))}
                            {isUserOwnFeedback && (
                              <span className="text-xs text-blue-600 ml-2">(הביקורת שלך)</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {fb.created_at && (
                              <span className="text-xs text-gray-500">
                                {format(new Date(fb.created_at), 'dd/MM/yyyy')}
                              </span>
                            )}
                            {(userIsAdmin || isUserOwnFeedback) && (
                              <button
                                onClick={() => {
                                  handleDeleteFeedback(fb.id);
                                }}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                                title="מחק ביקורת"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        {fb.comment && <p className="text-sm text-gray-700 mt-1">{fb.comment}</p>}
                      </div>
                    )})}
                    
                    {reviewsWithComments.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAllReviews(!showAllReviews)}
                        className={`w-full text-sm ${
                          courseType === 'cs' ? 'text-sky-600 hover:text-sky-700' : 'text-purple-600 hover:text-purple-700'
                        }`}
                      >
                        {showAllReviews ? (
                          <>
                            הצג פחות <ChevronUp className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            הצג עוד {reviewsWithComments.length - 1} ביקורות <ChevronDown className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Feedback form */}
            {showFeedbackForm && (
              <div className="space-y-3 bg-white p-3 rounded-lg shadow-sm mt-3">
                <div className="flex justify-center gap-2">
                  {[5, 4, 3, 2, 1].map((value) => (
                    <button
                      key={value}
                      onClick={() => setRating(value)}
                      className={`transition-all ${hoverStarColor}`}
                    >
                      <Star
                        className={`h-7 w-7 ${
                          value <= rating ? `${starColor} fill-current` : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  value={comment}
                  onChange={handleCommentChange}
                  placeholder="הערות (אופציונלי)"
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-${accentColor}-500 focus:border-transparent transition-all resize-none text-sm ${commentError ? 'border-red-500' : ''}`}
                  rows={2}
                  dir="rtl"
                  maxLength={MAX_COMMENT_LENGTH}
                />
                {commentError && (
                  <p className="text-red-500 text-xs mt-1">{commentError}</p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {comment.length}/{MAX_COMMENT_LENGTH}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      className={`flex-1 gap-2 ${
                        courseType === 'cs' 
                          ? 'bg-sky-600 hover:bg-sky-700' 
                          : 'bg-purple-600 hover:bg-purple-700'
                      } text-white`}
                      onClick={() => {
                        if (!commentError) {
                          onSubmitFeedback(tutor.id, rating, comment);
                          setShowFeedbackForm(false);
                          setComment('');
                          setRating(5);
                          setCommentError('');
                        }
                      }}
                      disabled={!!commentError}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      שלח
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowFeedbackForm(false);
                        setComment('');
                        setCommentError('');
                      }}
                    >
                      ביטול
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-center">התחברות</h2>
            <p className="mb-4 text-center">
              לא אוהבים רובוטים 😉
              <br />
              כדי למנוע ספאם ולהבטיח קהילה נעימה באתר,
              <br />
              אנחנו משתמשים בהתחברות פשוטה עם גוגל.
            </p>
            
            <GoogleLoginButton 
              onSuccess={handleLoginSuccess} 
              onError={handleLoginError} 
            />
            
            <button
              onClick={() => setShowLoginModal(false)}
              className="w-full mt-4 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none"
            >
              ביטול
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TutorCard; 