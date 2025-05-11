import { useState } from "react";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";


const ContactCard = ({ tutor, styles }) => {
  const [selectedSubject, setSelectedSubject] = useState("");

  const handleChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  const handleWhatsAppClick = async (e) => {
    try {
      const { error } = await supabase
        .from("tutor_clicks")
        .insert([{ p_tutor_id: tutor.id, clicked_at: new Date().toISOString() }]);

      if (error) {
        e.preventDefault();
        console.error("Error tracking click:", error);
      }
    } catch (err) {
      e.preventDefault();
      console.error("Error tracking click:", err);
    }
  };
  const formatPhoneNumber = (num = "") => {
    // strip non-digits
    const cleaned = num.replace(/\D/g, "");
    // match Israeli mobile 0XX-XXXX-XXX (10 digits)
    const match = cleaned.match(/^(0\d{2})(\d{3})(\d{4})$/);
    return match ? `${match[1]}-${match[2]}-${match[3]}` : num;
  };
  return (
    <section
            className={`bg-white ${styles.cardBorder} p-2 md:p-6 `}
          >
    <div className="max-w-4xl mx-auto p-6 w-full">
      <h2
        className={`text-2xl font-bold text-center mb-6 w-full mx-auto ${styles.textColor}`}
      >
        יצירת קשר
      </h2>

      <div className="bg-gray-100 shadow-md rounded-xl border border-gray-200 flex flex-col md:flex-row justify-between p-6">
        {/* פרטי קשר */}
        <div className="md:w-1/2 md:pl-6 text-right">
          <h3 className="font-bold mb-4">פרטי קשר</h3>
          <div className="flex items-center mb-2 text-gray-700">
            <Mail className="ml-2" size={18} />
            <span className="ml-2">
              {tutor.mail || "israel.israeli@gmail.com"}
            </span>
          </div>
          <div className="flex items-center mb-4 text-gray-700">
            <Phone className="ml-2" size={18} />
            <span className="ml-2">{formatPhoneNumber(tutor.phone)}</span>
          </div>
          <p className="text-sm text-gray-500">
            ניתן לפנות בנוגע לשיעורים, זמינות או מקצועות. תגובה לרוב תוך 24
            שעות.
          </p>
        </div>

        {/* פנייה בוואטסאפ */}
        <div className="md:w-1/2 mb-6 md:mb-0">
          <h3 className="font-bold mb-4 mt-4 md:mt-0">פנייה בוואטסאפ</h3>
          <p className="text-sm text-gray-600 mb-4">
            בחר מקצוע רלוונטי, ותוכל לפנות בקלות דרך WhatsApp.
          </p>
          <select
            className="w-full px-4 py-2 border rounded-md mb-4"
            value={selectedSubject}
            onChange={handleChange}
          >
            <option value="">בחר מקצוע</option>
            {tutor.subjects?.map((subject, idx) => (
              <option key={idx} value={subject}>
                {subject.course_name}
              </option>
            ))}
          </select>
          <a
            href={`https://wa.me/972${tutor.phone}?text=${encodeURIComponent(
              `שלום, אני מתעניין במקצוע ${selectedSubject}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              w-full ${styles.contactBg} font-medium py-2 px-4 rounded-md
              flex items-center justify-center gap-2
              ${!selectedSubject ? "opacity-50 cursor-not-allowed" : ""}
            `}
            title="WhatsApp"
            onClick={(e) => {
              if (!selectedSubject) {
                e.preventDefault();
              } else {
                handleWhatsAppClick(e);
              }
            }}
          >
            <MessageCircle size={18} />
            פנה בוואטסאפ
          </a>
        </div>
      </div>
    </div>
    </section>
  );
};

export default ContactCard;
