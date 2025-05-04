import { useState, useMemo } from "react"
import { Star, MessagesSquare } from "lucide-react"

export default function ReviewsSection({ reviews, styles }) {
  // Sample review data matching the image

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
  const reviewsPerPage = 4
  const totalPages = Math.ceil((reviews?.length || 0) / reviewsPerPage)

  // Get current page reviews
  const indexOfLastReview = currentPage * reviewsPerPage
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage
  const currentReviews = reviews?.slice(indexOfFirstReview, indexOfLastReview) || []

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Generate page numbers for pagination
  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
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

  // Render stars for rating (showing all 5 stars, with the appropriate number filled)
  const renderStars = (rating) => {
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-5 w-5 ${i < rating ? "fill-current" : "stroke-current"}`} />
        ))}
      </div>
    )
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
      <div className="flex items-center gap-3 border-b pb-6 mb-6 -mt-16">
        <MessagesSquare className={`h-6 w-6 ${styles.iconColor}`} />
        <h2 className={`text-2xl font-bold ${styles.textColor}`}>ביקורות</h2>
      </div>
      {/* Rating Summary Section */}
      <div className="border-b pb-6 mb-6">
        <div className="flex flex-row-reverse justify-between items-start">
          {/* Left side (in RTL): Rating breakdown */}
          <div className="space-y-1 w-1/2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-gray-500 w-6 text-left">★ {star}</span>
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
          <div className="flex flex-col items-center mt-10 mr-4 md:mr-40 ">
            <span className="text-7xl md:text-8xl font-bold text-yellow-400">{ratingStats.average}</span>
            <div className="flex text-yellow-400 my-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-7 w-7 ${i < ratingStats.average ? "fill-current" : "stroke-current"}`} />
              ))}
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
                    <p className="text-gray-600 text-md mt-1">{review.comment}</p>
                  </div>
                  <div>{renderStars(review.rating)}</div>
                </div>

                {/* Date stamp in the lower left (RTL: lower right) */}
                <div className="flex justify-start mt-2">
                  <span className="text-gray-400 text-sm">{review.created_at}</span>
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
    </section>
  )
}