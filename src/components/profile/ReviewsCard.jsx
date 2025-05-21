import { useState, useMemo, useEffect } from "react"
import {  Star, MessagesSquare, ThumbsUp, X } from "lucide-react"
import { format } from 'date-fns';
import { Button } from '../ui/button';
import { showNotification } from '../ui/notification';
import LoginModal from '../LoginModal';
import { supabase } from '../../lib/supabase';
import { courseTypeOptions } from '../../config/courseStyles';

const DEGREE_NAMES = Object.fromEntries(
  courseTypeOptions.map(option => [option.type, option.label])
);

export default function ReviewsSection({ reviews, styles, tutor, user, loadTutorsWithFeedback, courseType }) {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const MAX_COMMENT_LENGTH = 200;

  const onSubmitFeedback = async (tutorId, rating, comment) => {
    try {
      const { data: newDegreeId, error: degreeError } = await supabase.rpc(
        'get_degree_id_by_details',
        {
          p_degree_name: DEGREE_NAMES[courseType],
          p_academy_id: 1
        }
      );

      if (degreeError) throw degreeError;

      const { error } = await supabase.rpc('new_upsert_feedback', {
        tutor_id: tutorId,
        rating: rating,
        comment: comment,
        degree_id: newDegreeId,
        academy_id: 1
      });

      if (error) throw error;

      loadTutorsWithFeedback();
      showNotification('הביקורת נשלחה בהצלחה', 'success');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      showNotification('שגיאה בשליחת הביקורת', 'error');
    }
  };

  // Calculate rating statistics
  const ratingStats = useMemo(() => {
    const stats = {
      average: 0,
      total: reviews?.length || 0,
      distribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
    }

    let sum = 0
    reviews?.forEach((review) => {
      sum += review.rating
      stats.distribution[review.rating]++
    })
    
    stats.average = reviews?.length > 0 ? (sum / reviews.length).toFixed(1) : 0
    return stats
  }, [reviews])

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1)
  const [starSize, setStarSize] = useState(20)

  useEffect(() => {
    const updateSize = () => {
      setStarSize(window.innerWidth >= 768 ? 28 : 20)
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const reviewsPerPage = 4
  const totalPages = Math.ceil((reviews?.length || 0) / reviewsPerPage)

  // Get current page reviews
  const indexOfLastReview = currentPage * reviewsPerPage
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage
  const currentReviews = useMemo(() => {
    const sorted = [...(reviews || [])].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    )
    return sorted.slice(indexOfFirstReview, indexOfLastReview)
  }, [reviews, indexOfFirstReview, indexOfLastReview])
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const handleFeedbackClick = () => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      setShowFeedbackForm(true);
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

  const handleDeleteFeedback = async () => {
    if (!tutor) return;
    
    try {
      const { error } = await supabase
        .rpc('delete_feedback', {
          p_tutor_id: tutor.id
        });
  
      if (error) throw error;
  
      loadTutorsWithFeedback();
      showNotification('הביקורת נמחקה בהצלחה', 'success');
    } catch (error) {
      console.error('Error deleting feedback:', error);
      showNotification('שגיאה במחיקת הביקורת', 'error');
    }
  };

  // Generate page numbers for pagination
  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }
  const StarRating = ({ rating, max = 5, size = 28 }) => {
    return (
      <div className="flex gap-1">
        {[...Array(max)].map((_, i) => {
          const fillPercent = Math.min(Math.max(rating - i, 0), 1) * 100 // between 0% and 100%
  
          return (
            <div key={i} className="relative" style={{ width: size , height: size }}>
              {/* Gray base star */}
              <Star className="absolute text-yellow-400 w-full h-full"  />
  
              {/* Filled overlay star */}
              <Star
                className="absolute text-yellow-400 w-full h-full" 
                style={{
                  clipPath: `inset(0 0 0 ${100 - fillPercent}% )`,
                  stroke: "none",     // removes gray outline
                  fill: "currentColor" // fills with yellow
                }}
              />
            </div>
          )
        })}
      </div>
    )
  }
  
  // Handle pagination display logic
  const renderPageNumbers = () => {
    if (totalPages <= 5) {
      // Show all page numbers if 5 or fewer
      return pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`px-3 py-1 rounded-md ${
            currentPage === number ? "bg-gray-100 font-medium text-gray-800" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {number}
        </button>
      ))
    } else {
      // Show first, last, and pages around current
      const items = []

      // Always add first page
      items.push(
        <button
          key={1}
          onClick={() => paginate(1)}
          className={`px-3 py-1 rounded-md ${
            currentPage === 1 ? "bg-gray-100 font-medium text-gray-800" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          1
        </button>,
      )

      // Add ellipsis if current page is far from start
      if (currentPage > 3) {
        items.push(
          <span key="start-ellipsis" className="text-gray-400">
            ...
          </span>,
        )
      }

      // Add pages around current page
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (i === 1 || i === totalPages) continue // Skip first and last as they're always shown
        items.push(
          <button
            key={i}
            onClick={() => paginate(i)}
            className={`px-3 py-1 rounded-md ${
              currentPage === i ? "bg-gray-100 font-medium text-gray-800" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {i}
          </button>,
        )
      }

      // Add ellipsis if current page is far from end
      if (currentPage < totalPages - 2) {
        items.push(
          <span key="end-ellipsis" className="text-gray-400">
            ...
          </span>,
        )
      }

      // Always add last page
      if (totalPages > 1) {
        items.push(
          <button
            key={totalPages}
            onClick={() => paginate(totalPages)}
            className={`px-3 py-1 rounded-md ${
              currentPage === totalPages ? "bg-gray-100 font-medium text-gray-800" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {totalPages}
          </button>,
        )
      }

      return items
    }
  }

  // Generate initials from name
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <section className="md:max-w-[65rem] max-w-3xl mx-auto py-8" dir="rtl">
      <div className="flex items-center justify-between gap-3 border-b pb-6 mb-6">
        <div className="flex items-center gap-3">
          <MessagesSquare className={`h-6 w-6 ${styles.iconColor}`} />
          <h2 className={`text-2xl font-bold ${styles.textColor}`}>ביקורות</h2>
        </div>
        <Button
          className={styles.textSecondary}
          onClick={handleFeedbackClick}
        >
          הוסף ביקורת
        </Button>
      </div>

      {/* Feedback Form */}
      {showFeedbackForm && (
        <div className="space-y-3 bg-white p-3 rounded-lg shadow-sm mb-6">
          <div className="flex justify-center gap-2">
            {[5, 4, 3, 2, 1].map((value) => (
              <button
                key={value}
                onClick={() => setRating(value)}
                className={`transition-all ${styles.hoverStarColor}`}
              >
                <Star
                  className={`h-7 w-7 ${
                    value <= rating ? `text-yellow-400 fill-current` : 'text-gray-300'
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

      {/* Rating Summary Section */}
      <div className="border-b pb-6 mb-6">
        <div className="flex flex-row-reverse justify-between items-start">
          {/* Left side (in RTL): Rating breakdown */}
          <div className="space-y-1 md:w-1/2 w-full">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-gray-500 w-6 text-center">★ {star}</span>
                <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-yellow-400 h-full rounded-full"
                    style={{
                      width: `${(ratingStats.distribution[star] / ratingStats.total) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="text-gray-500 w-6 text-left">{ratingStats.distribution[star]}</span>
              </div>
            ))}
          </div>

          {/* Right side (in RTL): Average rating */}
          <div className="flex flex-col items-center mt-10 pl-2 md:mr-40 ">
            <span className="text-5xl md:text-8xl font-bold text-yellow-400">{ratingStats.average}</span>
            <div className="flex text-yellow-400 my-1">
              <StarRating rating={ratingStats.average} size={starSize} />
            </div>
            <span className="text-gray-600" dir="ltr">{ratingStats.total} reviews</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {currentReviews.map((review) => (
          <div key={review.id} className="border-b pb-6">
            <div className="flex items-start gap-3">
              {/* Avatar with initials */}
              <div className={`w-10 h-10 rounded-full ${styles.eventBg} bg-blue-500 text-white flex items-center justify-center flex-shrink-0 ml-4`}>
                {getInitials("אנונימי")}
              </div>

              <div className="flex-1">
                {/* If no content, stars are aligned with title */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">אנונימי</h3>
                    <p className="text-gray-600 text-md mt-1 ml-2">{review.comment}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} size={16} />
                    {tutor && review.id === tutor.user_feedback_id && (
                      <button
                        onClick={handleDeleteFeedback}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="מחק ביקורת"
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Date stamp in the lower left (RTL: lower left) */}
                <div className="flex justify-end mt-2">
                  <span className="text-gray-400 text-sm"> {format(new Date(review.created_at), 'dd/MM/yyyy')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center mt-8 space-x-reverse space-x-2">
        {/* Page numbers */}
        {totalPages > 1 && renderPageNumbers()}   
      </div>

      <LoginModal isOpen={showLoginModal} setIsOpen={setShowLoginModal} styles={styles} />
    </section>
  )
}