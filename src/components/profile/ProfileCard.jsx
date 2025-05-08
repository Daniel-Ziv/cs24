import { useState, useEffect } from "react"
import { Star, Book, Phone, Linkedin, Github, Verified, MapPin, Edit, Paperclip  } from "lucide-react";
import image from "../../config/user-profile.png";
import EditPanel from "../EditPanel"

const ProfileCard = ({ tutorData, styles }) => {
  // Scroll to bottom of the page
  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };
  const isDevMode = process.env.REACT_APP_DEV?.toLowerCase() === 'true';

  const linke = tutorData.linkedin || "" //"https://www.linkedin.com/in/daniel-shatzov/";
  const githu = tutorData.github || "" //"https://github.com/Daniel23sh";
  const other = tutorData.other || "" 
  const [localData, setLocalData] = useState(tutorData)
  const [showEditModal, setShowEditModal] = useState(false)
  // keep in sync when parent prop changes
  useEffect(() => {
    setLocalData(tutorData)
  }, [tutorData])

  // called by EditPanel
  const handleProfileSave = (updatedData, updatedEvents, updatedGrades) => {
    setLocalData({ ...updatedData, events: updatedEvents, grades: updatedGrades })
    setShowEditModal(false)
  }
  const calcAverageRating = (feedbackArray) => {
    if (!feedbackArray || feedbackArray.length === 0) return null
    const sum = feedbackArray.reduce((acc, cur) => acc + (cur.rating || 0), 0)
    return sum / feedbackArray.length
  }
  const rating = tutorData.average_rating ?? calcAverageRating(tutorData.feedback)

  const formatPhoneNumber = (num = "") => {
    // strip non-digits
    const cleaned = num.replace(/\D/g, "");
    // match Israeli mobile 0XX-XXXX-XXX (10 digits)
    const match = cleaned.match(/^(0\d{2})(\d{3})(\d{4})$/);
    return match ? `${match[1]}-${match[2]}-${match[3]}` : num;
  };
  return (
    <div className={`block p-4 relative z-20 ${ isDevMode && 'pt-24' }`}>
      <div className="max-w-6xl mx-auto -mb-8">
      <div className={`relative bg-white border ${styles.cardBorder} rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row mx-auto`}>

          {/* edit button top-left */}
          <button
            onClick={() => setShowEditModal(true)}
            className="absolute top-4 left-4 p-2 rounded-full bg-white hover:bg-gray-100 shadow-sm"
            aria-label="Edit profile"
          >
            <Edit className="h-5 w-5 text-gray-500" />
          </button>

          {/* Profile Photo */}
          <div className="relative w-80 h-72 mx-auto mt-4 md:w-64 md:h-60 md:m-4 md:mt-6">
            <img
              src={image || "/placeholder.svg"}
              alt={tutorData.name}
              className="border w-full h-full object-cover object-center rounded-xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder.svg?height=300&width=300";
              }}
            />
          </div>

          {/* Profile Info */}
          <div className="p-5 space-y-4 text-center flex flex-col items-center md:items-start md:flex-1 md:p-6">
            {/* Name and Verification */}
             <div className="flex items-center justify-center md:justify-start space-x-2">
              <h2 className="text-2xl font-bold text-gray-900">{tutorData.name}</h2>
              <Verified className="h-6 w-6 text-white fill-blue-500" />
            </div>
           
            {/* Rating & Mobile Price */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current ml-1" />
                <span className="ml-1 font-semibold text-gray-900">
                {rating ? rating.toFixed(1) : "N/A"}
                </span>
                <span className="ml-1 text-gray-500"  dir="ltr">
                  ({tutorData.feedback?.length || 0} reviews)
                </span>
              </div>
              <div className={` px-3 py-1 rounded-full text-sm font-bold flex items-center justify-center ${styles.textColor} ${styles.bgLight} md:hidden`}>
                {tutorData.private_price}₪ / שעה
              </div>
            </div>

            {/* Container: column-flex/right-align on mobile, two-column grid on md+ */}
          <div className="flex flex-col items-start gap-4 md:grid md:grid-cols-2 md:items-start md:gap-4">

          {/* Left column: Role above avaliability */}
          <div className="flex flex-col items-start md:items-start space-y-2">
            {/* Role */}
            <div className="flex items-center text-gray-700">
              <div className={`p-1.5 rounded-full ${styles.linksIconBg} mr-2`}>
                <Book className={`h-5 w-5 ${styles.iconColor}`} />
              </div>
              <span className="mr-2">{tutorData.role || "מורה פרטי"}</span>
            </div>

            {/* avaliability */}
            <div className="flex items-center text-gray-700">
              <div className={`p-1.5 rounded-full md:mt-2 ${styles.linksIconBg} mr-2`}>
                <MapPin className={`h-5 w-5 ${styles.iconColor}`} />
              </div>
              <span className="break-words text-right mr-2">
                מועבר ב{tutorData.status}
              </span>
            </div>
          </div>

          {/* Right column: Price above Phone */}
          <div className="flex flex-col items-end md:items-start space-y-2">
            {/* Price (desktop only) */}
            <div className="hidden md:flex items-center md:mr-8">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full ${styles.linksIconBg} mr-2`}>
                <span className={`text-3xl leading-none mb-2 font-light ${styles.iconColor}`}>₪</span>
              </div>
              <p className="text-base text-gray-700 mr-2">{tutorData.private_price} לשעה</p>
            </div>

            {/* Phone */}
            {tutorData.phone && (
              <div className="flex items-center text-gray-700 md:mr-8">
                <div className={`p-1.5 rounded-full -mt-4 md:mt-2 ${styles.linksIconBg} mr-2`}>
                  <Phone className={`h-5 w-5 ${styles.iconColor}`} />
                </div>
                <p className="text-base mr-2 md:mt-2 -mt-4">{formatPhoneNumber(tutorData.phone)}</p>
              </div>
            )}
          </div>

          </div>


           {/* Social Links (Mobile) */}
            {(linke || githu || other) && (
              <div className="flex gap-4 mt-3 items-center justify-center md:hidden">
                {linke && (
                  <a
                    href={linke}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.iconColorReverse} p-2 rounded-full hover:shadow-md transition-all`}
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {githu && (
                  <a
                    href={githu}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.iconColorReverse} p-2 rounded-full hover:shadow-md transition-all`}
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
                {other && (
                  <a
                    href={other}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.iconColorReverse} p-2 rounded-full hover:shadow-md transition-all`}
                  >
                    <Paperclip  className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}

            <div className="flex flex-col md:flex-row items-center md:justify-between mt-4 gap-4 w-full">
              {/* קישורים (בצד שמאל בדסקטופ) */}
              <div className="hidden md:flex gap-4 items-center">
                {linke && (
                  <a
                    href={linke}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.iconColorReverse} p-2 rounded-full hover:shadow-md transition-all`}
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {githu && (
                  <a
                    href={githu}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.iconColorReverse} p-2 rounded-full hover:shadow-md transition-all`}
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
                {other && (
                  <a
                    href={other}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.iconColorReverse} p-2 rounded-full hover:shadow-md transition-all`}
                  >
                    <Paperclip className="h-4 w-4" />
                  </a>
                )}
              </div>

              {/* כפתור – תמיד מוצג */}
              <button
                onClick={scrollToBottom}
                className={`${styles.buttonPrimary} text-white rounded-lg font-medium w-full md:w-64 py-2 px-4 md:mt-4`}
              >
                הזמן שיעור
              </button>
            </div>


          </div>
        </div>
      </div>
       {/* EditPanel Modal */}
       {showEditModal && (
        <EditPanel
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          tutorData={localData}
          styles={styles}
          grades={localData.grades}
          events={localData.events}
          onSave={handleProfileSave}
        />
      )}
    </div>
  );
};

export default ProfileCard;
