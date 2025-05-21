import { useState, useEffect } from "react"
import { Star, Phone, Linkedin, Github, Verified, MapPin, Paperclip, Share2, PhoneCallIcon } from "lucide-react";
import image from "../../config/user-profile.png";


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
  // keep in sync when parent prop changes
  useEffect(() => {
    setLocalData(tutorData)
  }, [tutorData])

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
      <div className=" mx-auto -mb-8 max-w-[73rem] md:p-0 pb-4 md:pb-4">
        <div className={`relative bg-white border ${styles.cardBorder} rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row mx-auto`}>
          {/* share button */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`הנה הפרופיל של ${tutorData.name}👨‍🏫\n\nhttps://${window.location.host}/tutors/cs/${tutorData.id}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`absolute top-2 left-2 p-2 rounded-full bg-white hover:bg-gray-100  hidden md:block ${isDevMode ? "" : 'hidden'}`}
            aria-label="Share profile"
          >
            <Share2 className={`h-5 w-5 bg-rounded ${styles.linksIconColor}`} />
          </a>

          {/* Profile Photo */}
          <div className="relative mx-auto w-40 h-40 md:w-52 md:h-48 md:mt-4 mt-6 md:m-2 md:m-4">
            <img
              src={image || "/placeholder.svg"}
              alt={tutorData.name}
              className="border w-full h-full object-cover object-center rounded-xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder.svg?height=300&width=300";
              }}
            />
            {/* share button */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(` הנה הפרופיל של ${tutorData.name}👨‍🏫\n\n🔗 https://${window.location.host}/tutors/cs/${tutorData.id}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`absolute top-2 left-2 p-2 rounded-full bg-white hover:bg-gray-100 md:hidden`}
              aria-label="Share profile"
            >
              <Share2 className={`h-4 w-4 ${styles.linksIconColor}`} />
            </a>
          </div>

          {/* Profile Info */}
          <div className="p-3 space-y-2 text-center flex flex-col items-center md:items-start md:flex-1 md:p-4">
            {/* Name and Verification */}
             <div className="flex items-center justify-center md:justify-start space-x-2">
              <h2 className="text-2xl ml-1 font-bold text-gray-900">{tutorData.name}</h2>
              <Verified className="h-6 w-6 md:mt-1 text-white fill-blue-500" />
            </div>
           
            {/* Rating & Mobile Price */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-2">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current ml-1" />
                <span className="ml-1 font-semibold text-gray-900">
                {rating ? rating.toFixed(1) : "N/A"}
                </span>
                <span className="ml-1 text-gray-500"  dir="ltr">
                  ({tutorData.feedback?.length || 0} reviews)
                </span>
              </div>
            </div>

            {/* About Me */}
            <div className="text-right mt-4 md:pr-2 pr-4 md:pl-6 pl-2">
              <p className={`${styles.textColor} whitespace-pre-line leading-relaxed`}>
                {tutorData.about_me || <span><strong>"</strong>עוד לא הוספתי<strong>"</strong></span>}
              </p>
            </div>

            {/* Container: column-flex/right-align on mobile, two-column grid on md+ */}
            <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-12">

              {/* Availability */}
              <div className="flex mt-4 items-center text-gray-700">
                <div className={`p-1.5 rounded-full ${styles.linksIconBg}`}>
                  <MapPin className={`h-5 w-5 ${styles.iconColor}`} />
                </div>
                <span className="break-words text-right mr-2">
                  מועבר בזום
                </span>
              </div>

              {/* Price */}
              <div className="hidden md:flex mt-4 items-center text-gray-700">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full ${styles.linksIconBg} mr-2`}>
                  <span className={`text-3xl leading-none mb-2 font-light ${styles.iconColor}`}>₪</span>
                </div>
                <p className="text-base text-gray-700 mr-2">{tutorData.private_price} לשעה</p>
              </div>

              {/* Phone */}
              {tutorData.phone && (
                <div className="hidden md:flex mt-4 items-center text-gray-700">
                  <div className={`p-1.5 rounded-full ${styles.linksIconBg} mr-2`}>
                    <Phone className={`h-5 w-5 ${styles.iconColor}`} />
                  </div>
                  <p className="text-base mr-2">{formatPhoneNumber(tutorData.phone)}</p>
                </div>
              )}
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
                className={`${styles.buttonPrimary} text-white rounded-lg font-medium w-full md:mt-0 mt-4 md:w-64 py-2 px-4 flex items-center justify-center gap-2`}
              >
                <PhoneCallIcon size={17} />
                <span>צור קשר</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
