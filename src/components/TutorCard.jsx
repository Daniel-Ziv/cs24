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
import { courseStyles } from '../config/courseStyles';

const TutorCard = ({ tutor, courseType, user, onSubmitFeedback, loadTutorsWithFeedback }) => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const [showReviews, setShowReviews] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const MAX_COMMENT_LENGTH = 200; // Maximum character limit for comments
  const userIsAdmin = user && isAdmin(user.email);

  const styles = courseStyles[courseType] || courseStyles.cs;

  const hasUserFeedback = tutor.has_user_feedback;

  const reviewsWithComments = tutor.feedback?.filter(fb => fb.comment?.trim()) || [];

  const sortedReviews = [...reviewsWithComments].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const displayedReviews = showAllReviews 
    ? sortedReviews 
    : sortedReviews.slice(0, 1);

  // Only show delete button if has_user_feedback is true AND we have a valid user_feedback_id
  const showDeleteButton = tutor.has_user_feedback && tutor.user_feedback_id;

  // Get the user's feedback using the ID
  const userFeedback = showDeleteButton 
    ? tutor.feedback?.find(fb => fb.id === tutor.user_feedback_id)
    : null;

 
  const handleFeedbackClick = async () => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      setShowFeedbackForm(true);
    }
  };

  const handleLoginSuccess = (data) => {
    setShowLoginModal(false);
    setTimeout(() => {
      setShowFeedbackForm(true);
    }, 1000);
  };

  const handleLoginError = (error) => {
    setShowLoginModal(false);
  };

  const handleWhatsAppClick = async (e) => {
    try {
      const { error } = await supabase
        .from('tutor_clicks')
        .insert([{
          p_tutor_id: tutor.id,
          clicked_at: new Date().toISOString()
        }]);
  
      if (error) {
        e.preventDefault();
        console.error('Error tracking click:', error);
      }
    } catch (err) {
      e.preventDefault();
      console.error('Error tracking click:', err);
    }
  };

  const handleDeleteFeedback = async () => {
    try {
      const { error } = await supabase
        .rpc('delete_feedback', {
          p_tutor_id: tutor.id
        });
  
      if (error) throw error;
  
      // Now loadTutorsWithFeedback is available
      loadTutorsWithFeedback();
      showNotification('הביקורת נמחקה בהצלחה', 'success');
    } catch (error) {
      console.error('Error deleting feedback:', error);
      showNotification('שגיאה במחיקת הביקורת', 'error');
    }
  };

  const handleCommentChange = (e) => {
    const newComment = e.target.value;
    
    if (newComment.length > MAX_COMMENT_LENGTH) {
      setCommentError(`הערה ארוכה מדי. מוגבל ל-${MAX_COMMENT_LENGTH} תווים.`);
      return;
    }
    
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([^\s]+\.(com|org|net|il|co|io))/gi;
    if (urlRegex.test(newComment)) {
      setCommentError('לא ניתן להכניס קישורים בהערות.');
      return;
    }
    
    setCommentError('');
    setComment(newComment);
  };

  const phoneWithoutZero = tutor.phone?.substring(1) || ""; 

  return (
    <>
      <Card className={`bg-white border ${styles.cardBorder}`}>
        <CardHeader className="pb-3">
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className={`text-lg font-semibold ${styles.textColor}`}>{tutor.name}</h3>
                <div className="flex items-center gap-1">
                  <Star className={`h-4 w-4 ${styles.starColor} ${tutor.average_rating ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">{tutor.average_rating?.toFixed(1) || 'אין'}</span>
                  <span className="text-sm text-gray-500">({tutor.feedback?.length || 0})</span>
                </div>
              </div>
              <a
                href={`https://wa.me/972${phoneWithoutZero}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 flex items-center justify-center rounded-md shadow-md ${styles.iconColorReverse} transition-colors hover:bg-gray-100`}
                title="WhatsApp"
                onClick={handleWhatsAppClick}
              >
                <FontAwesomeIcon icon={faWhatsapp} size="xl" />
              </a>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600">{tutor.phone || 'לא זמין'}</p>
                <Button
                  className={styles.textSecondary}
                  onClick={handleFeedbackClick}
                >
                  הוסף ביקורת
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5 -mx-0.5">
              {tutor.subjects?.map((subject, index) => (
                <span
                  key={index}
                  className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${styles.subjectBg} ${styles.textSecondary}`}
                >
                  {subject}
                </span>
              ))}
            </div>

            {tutor.feedback?.length > 0 && (
              <div>
                <Button
                  className={styles.textSecondary}
                  onClick={() => setShowReviews(!showReviews)}
                >
                  {showReviews ? 'הסתר תגובות' : `ראה תגובות (${reviewsWithComments.length})`}
                </Button>

                {showDeleteButton && userFeedback && (
                  <div className="mt-2 space-y-2">
                    <div className="bg-blue-50 rounded-lg p-3 relative">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${i < userFeedback.rating ? `${styles.starColor} fill-current` : 'text-gray-300'}`}
                            />
                          ))}
                          <span className="text-xs text-blue-600 ml-2">(הביקורת שלך)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {userFeedback.created_at && (
                            <span className="text-xs text-gray-500">
                              {format(new Date(userFeedback.created_at), 'dd/MM/yyyy')}
                            </span>
                          )}
                          <button
                            onClick={handleDeleteFeedback}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="מחק ביקורת"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {userFeedback.comment && (
                        <p className="text-sm text-gray-700 mt-1">{userFeedback.comment}</p>
                      )}
                    </div>
                  </div>
                )}

                {showReviews && reviewsWithComments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {displayedReviews.map((fb, index) => {
                      const isUserOwnFeedback = hasUserFeedback && index === 0;
                      return (
                        <div key={index} className={`${isUserOwnFeedback ? 'bg-blue-50' : 'bg-gray-50'} rounded-lg p-3 relative`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3.5 w-3.5 ${i < fb.rating ? `${styles.starColor} fill-current` : 'text-gray-300'}`}
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
                                  onClick={handleDeleteFeedback}
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
                      );
                    })}
                    
                    {reviewsWithComments.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAllReviews(!showAllReviews)}
                        className={`w-full text-sm ${styles.textSecondary}`}
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

            {showFeedbackForm && (
              <div className="space-y-3 bg-white p-3 rounded-lg shadow-sm mt-3">
                <div className="flex justify-center gap-2">
                  {[5, 4, 3, 2, 1].map((value) => (
                    <button
                      key={value}
                      onClick={() => setRating(value)}
                      className={`transition-all ${styles.hoverStarColor}`}
                    >
                      <Star
                        className={`h-7 w-7 ${
                          value <= rating ? `${styles.starColor} fill-current` : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  value={comment}
                  onChange={handleCommentChange}
                  placeholder="הערות (אופציונלי)"
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-${styles.accentColor}-500 focus:border-transparent transition-all resize-none text-sm ${commentError ? 'border-red-500' : ''}`}
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
                      className={`flex-1 gap-2 ${styles.buttonPrimary} text-white`}
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