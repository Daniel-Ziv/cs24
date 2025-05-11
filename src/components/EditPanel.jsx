import { useState, useRef, useEffect } from "react"
import { X, Upload, Plus, ArrowLeft, Save, Trash2 } from "lucide-react"

const EditPanel = ({ showEditModal, setShowEditModal, tutorData, styles, grades, events, onSave }) => {
  const [activeTab, setActiveTab] = useState("personal")
  const [editedData, setEditedData] = useState({})
  const [editedGrades, setEditedGrades] = useState([])
  const [editedEvents, setEditedEvents] = useState([])
  const [newGrade, setNewGrade] = useState({ subject: "", grade: "", year: "" })
  const [newEvent, setNewEvent] = useState({
    title: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    description: "",
  })
  const fileInputRef = useRef(null)
  
  // Initialize edited data when modal opens
  useEffect(() => {
    if (showEditModal) {

      setEditedData({
        name: tutorData.name || "",
        location: tutorData.location || "",
        role: tutorData.role || "",
        startDate: tutorData.startDate || "",
        endDate: tutorData.endDate || "",
        institution: tutorData.institution || "",
        fieldOfStudy: tutorData.fieldOfStudy || "",
        subjects: tutorData.subjects ? [...tutorData.subjects] : [],
        phone: tutorData.phone || "",
        linkedin: tutorData.linkedin || "",
        github: tutorData.github || "",
        about_me: tutorData.about_me || "",
        private_price: tutorData.private_price || "150",
        group_price: tutorData.group_price || "80",
        profile_image_url: tutorData.profile_image_url || "",
        status: tutorData.status || "זמין", 
      })
      setEditedGrades(Array.isArray(tutorData.grades) ? tutorData.grades.map((grade) => ({ ...grade })) : []);
      setEditedEvents(Array.isArray(tutorData.events) ? tutorData.events.map((event) => ({ ...event })) : []);
      setActiveTab("personal")
    }
  }, [showEditModal, tutorData, grades, events])

  // Close edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false)
  }

  // Handle input changes in edit modal
  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle subjects input (comma-separated)
   const handleSubjectsChange = (e) => {
       const subjectsText = e.target.value
       // split into names, trim and drop empties
       const names = subjectsText
         .split(",")
         .map((s) => s.trim())
         .filter(Boolean)
       // map them back into objects
       const subjectsObjs = names.map((name) => ({ course_name: name }))
       setEditedData((prev) => ({
         ...prev,
         subjects: subjectsObjs,
       }))
     }

  // Handle grade changes
  const handleGradeChange = (index, field, value) => {
    const updatedGrades = [...editedGrades]
    updatedGrades[index][field] = value
    setEditedGrades(updatedGrades)
  }

  // Handle new grade input change
  const handleNewGradeChange = (field, value) => {
    setNewGrade((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Add new grade
  const handleAddGrade = () => {
    if (newGrade.subject && newGrade.grade && newGrade.year) {
      setEditedGrades((prev) => [...prev, { ...newGrade }])
      setNewGrade({ subject: "", grade: "", year: "" })
    }
  }

  // Remove grade
  const handleRemoveGrade = (index) => {
    setEditedGrades((prev) => prev.filter((_, i) => i !== index))
  }

  // Handle event changes
  const handleEventChange = (index, field, value) => {
    const updatedEvents = [...editedEvents]
    updatedEvents[index][field] = value
    setEditedEvents(updatedEvents)
  }

  // Handle new event input change
  const handleNewEventChange = (field, value) => {
    setNewEvent((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Add new event
  const handleAddEvent = () => {
    if (newEvent.title && newEvent.startDate && newEvent.startTime) {
      const newEventWithId = {
        ...newEvent,
        id: Date.now(), // Generate a unique ID
        endDate: newEvent.endDate || newEvent.startDate, // Default to start date if no end date
      }
      setEditedEvents((prev) => [...prev, newEventWithId])
      setNewEvent({
        title: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        description: "",
      })
    }
  }

  // Remove event
  const handleRemoveEvent = (index) => {
    setEditedEvents((prev) => prev.filter((_, i) => i !== index))
  }

  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditedData((prev) => ({
          ...prev,
          profile_image_url: reader.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  // Save profile changes
  const handleSaveProfile = async () => {
    try {
      // Call the parent component's save function with the edited data
      onSave(editedData, editedEvents, editedGrades)

      // Close the modal
      setShowEditModal(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("שגיאה בעדכון הפרופיל. נסה שוב מאוחר יותר.")
    }
  }

  const handlePhoneChange = (e) => {
    const { value } = e.target;
    // Allow an optional leading "+" then only digits.
    // This regex replaces everything that is not a digit.
    // If you wish to allow the plus sign only as the first character, you can handle that accordingly.
    const filteredValue = value.replace(/(?!^\+)[^\d]/g, "");
    setEditedData((prev) => ({
      ...prev,
      phone: filteredValue,
    }));
  };
  if (!showEditModal) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        className={`bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto ${styles.cardBorder}`}
      >
        <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between z-10">
          <button
            onClick={handleCloseEditModal}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Close modal"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-bold text-center">ערוך פרופיל</h2>
          <button
            onClick={handleSaveProfile}
            className={`${styles.buttonPrimary} py-2 px-4 rounded-lg flex items-center gap-1`}
          >
            <Save className="h-4 w-4" />
            שמור
          </button>
        </div>

        {/* Tabs */}
        <div className="sticky bg-white top-16 z-50 flex border-b">
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === "personal" ? `${styles.textColor} border-b-2 ${styles.cardBorder}` : "text-gray-500"
            }`}
            onClick={() => setActiveTab("personal")}
          >
            פרטים אישיים
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === "grades" ? `${styles.textColor} border-b-2 ${styles.cardBorder}` : "text-gray-500"
            }`}
            onClick={() => setActiveTab("grades")}
          >
            השכלה
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === "events" ? `${styles.textColor} border-b-2 ${styles.cardBorder}` : "text-gray-500"
            }`}
            onClick={() => setActiveTab("events")}
          >
            אירועים
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === "pricing" ? `${styles.textColor} border-b-2 ${styles.cardBorder}` : "text-gray-500"
            }`}
            onClick={() => setActiveTab("pricing")}
          >
            מחירים
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Personal Details Tab */}
          {activeTab === "personal" && (
            <>
              {/* Profile Image */}
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <img
                    src={editedData.profile_image_url || `https://ui-avatars.com/api/?name='User'}&background=0D8ABC&color=fff`}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  <button
                    onClick={triggerFileInput}
                    className={`absolute bottom-0 right-0 p-2 rounded-full ${styles.editBg} text-white`}
                  >
                    <Upload className="h-4 w-4" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              {/* Personal Details */}
              <div>
                <h3 className={`text-lg font-bold mb-3 ${styles.textColor}`}>פרטים אישיים</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">שם</label>
                    <input
                      type="text"
                      name="name"
                      value={editedData.name || ""}
                      onChange={handleEditInputChange}
                      className={`w-full p-3 border ${styles.cardBorder} rounded-lg`}
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">תפקיד</label>
                    <input
                      type="text"
                      name="role"
                      value={editedData.role || ""}
                      onChange={handleEditInputChange}
                      className={`w-full p-3 border ${styles.cardBorder} rounded-lg`}
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">טלפון</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editedData.phone || ""}
                      onChange={handlePhoneChange}
                      className={`w-full p-3 border ${styles.cardBorder} rounded-lg`}
                      dir="rtl"
                      inputMode="numeric"
                      pattern="^\+?\d*$"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">זמינות</label>
                    <select
                      name="status"
                      value={editedData.status || "זום"}
                      onChange={handleEditInputChange}
                      className={`w-full p-3 border ${styles.cardBorder} rounded-lg`}
                      dir="rtl"
                    >
                      <option value="זום">זום</option>
                      <option value="פרונטלי">פרונטלי</option>
                      <option value="פרונטלי + זום">פרונטלי + זום</option>

                    </select>
                  </div>
                </div>
              </div>

              {/* Subjects */}
              <div>
                <h3 className={`text-lg font-bold mb-3 ${styles.textColor}`}>תחומי לימוד</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">תחומים (מופרדים בפסיקים)</label>
                  <input
                    type="text"
                    value={(editedData.subjects || [])
                      .map((s) => s.course_name)
                      .join(", ")}                    
                    onChange={handleSubjectsChange}
                    className={`w-full p-3 border ${styles.cardBorder} rounded-lg`}
                    dir="rtl"
                    placeholder="לדוגמה: מתמטיקה, אנגלית, פיזיקה"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className={`text-lg font-bold mb-3 ${styles.textColor}`}>קישורים חברתיים</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">LinkedIn</label>
                    <input
                      type="url"
                      name="linkedin"
                      value={editedData.linkedin || ""}
                      onChange={handleEditInputChange}
                      className={`w-full p-3 border ${styles.cardBorder} rounded-lg`}
                      dir="ltr"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">GitHub</label>
                    <input
                      type="url"
                      name="github"
                      value={editedData.github || ""}
                      onChange={handleEditInputChange}
                      className={`w-full p-3 border ${styles.cardBorder} rounded-lg`}
                      dir="ltr"
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>
              </div>

              {/* About Me */}
              <div>
                <h3 className={`text-lg font-bold mb-3 ${styles.textColor}`}>אודותיי</h3>
                <textarea
                  name="about_me"
                  value={editedData.about_me || ""}
                  onChange={handleEditInputChange}
                  className={`w-full min-h-[150px] p-3 border ${styles.cardBorder} rounded-lg`}
                  dir="rtl"
                  placeholder="ספר על עצמך, הניסיון שלך, ותחומי ההתמחות שלך..."
                />
              </div>
            </>
          )}

          {/* Grades Tab */}
          {activeTab === "grades" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">תואר</label>
                <input
                  type="text"
                  name="degree"
                  value={editedData.fieldOfStudy || ""}
                  onChange={handleEditInputChange}
                  className={`w-full p-2 border ${styles.cardBorder} rounded-lg`}
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">מוסד לימודים</label>
                <input
                  type="text"
                  name="institution"
                  value={editedData.institution || ""}
                  onChange={handleEditInputChange}
                  className={`w-full p-2 border ${styles.cardBorder} rounded-lg`}
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">שנת התחלה</label>
                <input
                  type="number"
                  name="startDate"
                  value={editedData.startDate || ""}
                  onChange={handleEditInputChange}
                  className={`w-full p-2 border ${styles.cardBorder} rounded-lg`}
                  dir="rtl"
                  min="1900"
                  max="2099"
                  placeholder="שנה לדוגמה: 2021"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">שנת סיום</label>
                <input
                  type="number"
                  name="endDate"
                  value={editedData.endDate || ""}
                  onChange={handleEditInputChange}
                  className={`w-full p-2 border ${styles.cardBorder} rounded-lg`}
                  dir="rtl"
                  min="1900"
                  max="2099"
                  placeholder="שנה לדוגמה: 2021"
                />
              </div>
            </div>

              <div className="space-y-3">
              <h3 className={`text-lg font-bold mb-3 ${styles.textColor}`}>ציונים</h3>

                {editedGrades.map((grade, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={grade.subject}
                        onChange={(e) => handleGradeChange(index, "subject", e.target.value)}
                        className={`w-full p-2 border ${styles.cardBorder} rounded-lg mb-2`}
                        dir="rtl"
                        placeholder="קורס"
                      />
                    </div>
                    <div className="w-20">
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={3}
                        value={grade.grade}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Allow empty string for temporary deletion and match only numbers from 0 to 100.
                          if (value === "" || /^(0|[1-9]\d?|100)$/.test(value)) {
                            handleGradeChange(index, "grade", value);
                          }
                        }}
                        className={`w-full p-2 border ${styles.cardBorder} rounded-lg mb-2`}
                        dir="rtl"
                        placeholder="ציון"
                      />
                    </div>
                    <div className="w-24">
                      <input
                        type="text"
                        value={grade.year}
                        onChange={(e) => handleGradeChange(index, "year", e.target.value)}
                        className={`w-full p-2 border ${styles.cardBorder} rounded-lg mb-2`}
                        dir="rtl"
                        placeholder="שנה"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveGrade(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {/* Add new grade */}
                <div className="flex items-center gap-2 p-3 border rounded-lg border-dashed">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={newGrade.subject}
                      onChange={(e) => handleNewGradeChange("subject", e.target.value)}
                      className={`w-full p-2 border ${styles.cardBorder} rounded-lg mb-2`}
                      dir="rtl"
                      placeholder="קורס"
                    />
                  </div>
                  <div className="w-20">
                    <input
                      type="text"
                      value={newGrade.grade}
                      onChange={(e) => handleNewGradeChange("grade", e.target.value)}
                      className={`w-full p-2 border ${styles.cardBorder} rounded-lg mb-2`}
                      dir="rtl"
                      placeholder="ציון"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="text"
                      value={newGrade.year}
                      onChange={(e) => handleNewGradeChange("year", e.target.value)}
                      className={`w-full p-2 border ${styles.cardBorder} rounded-lg mb-2`}
                      dir="rtl"
                      placeholder="שנה"
                    />
                  </div>
                  <button
                    onClick={handleAddGrade}
                    className={`p-2 ${styles.bgLight} text-white rounded-full hover:opacity-90`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === "events" && (
            <div>
              <h3 className={`text-lg font-bold mb-3 ${styles.textColor}`}>אירועים</h3>
              <div className="space-y-4">
                {editedEvents.map((event, index) => (
                  <div key={event.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold">{event.title}</h4>
                      <button
                        onClick={() => handleRemoveEvent(index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">תאריך התחלה</label>
                        <input
                          type="date"
                          value={event.startDate}
                          onChange={(e) => handleEventChange(index, "startDate", e.target.value)}
                          className={`w-full p-2 border ${styles.cardBorder} rounded-lg`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">שעת התחלה</label>
                        <input
                          type="time"
                          value={event.startTime}
                          onChange={(e) => handleEventChange(index, "startTime", e.target.value)}
                          className={`w-full p-2 border ${styles.cardBorder} rounded-lg`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">תאריך סיום</label>
                        <input
                          type="date"
                          value={event.endDate || event.startDate}
                          onChange={(e) => handleEventChange(index, "endDate", e.target.value)}
                          className={`w-full p-2 border ${styles.cardBorder} rounded-lg`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">שעת סיום</label>
                        <input
                          type="time"
                          value={event.endTime || ""}
                          onChange={(e) => handleEventChange(index, "endTime", e.target.value)}
                          className={`w-full p-2 border ${styles.cardBorder} rounded-lg`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">כותרת</label>
                      <input
                        type="text"
                        value={event.title}
                        onChange={(e) => handleEventChange(index, "title", e.target.value)}
                        className={`w-full p-2 border ${styles.cardBorder} rounded-lg mb-2`}
                        dir="rtl"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">תיאור</label>
                      <textarea
                        value={event.description || ""}
                        onChange={(e) => handleEventChange(index, "description", e.target.value)}
                        className={`w-full p-2 border ${styles.cardBorder} rounded-lg`}
                        dir="rtl"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}

                {/* Add new event */}
                <div className="border rounded-lg p-4 border-dashed">
                  <h4 className="font-bold mb-3">הוסף אירוע חדש</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">תאריך התחלה</label>
                      <input
                        type="date"
                        value={newEvent.startDate}
                        onChange={(e) => handleNewEventChange("startDate", e.target.value)}
                        className={`w-full p-2 border ${styles.cardBorder} rounded-lg`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">שעת התחלה</label>
                      <input
                        type="time"
                        value={newEvent.startTime}
                        onChange={(e) => handleNewEventChange("startTime", e.target.value)}
                        className={`w-full p-2 border ${styles.cardBorder} rounded-lg`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">תאריך סיום</label>
                      <input
                        type="date"
                        value={newEvent.endDate}
                        onChange={(e) => handleNewEventChange("endDate", e.target.value)}
                        className={`w-full p-2 border ${styles.cardBorder} rounded-lg`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">שעת סיום</label>
                      <input
                        type="time"
                        value={newEvent.endTime}
                        onChange={(e) => handleNewEventChange("endTime", e.target.value)}
                        className={`w-full p-2 border ${styles.cardBorder} rounded-lg`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">כותרת</label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => handleNewEventChange("title", e.target.value)}
                      className={`w-full p-2 border ${styles.cardBorder} rounded-lg mb-2`}
                      dir="rtl"
                      placeholder="כותרת האירוע"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">תיאור</label>
                    <textarea
                      value={newEvent.description}
                      onChange={(e) => handleNewEventChange("description", e.target.value)}
                      className={`w-full p-2 border ${styles.cardBorder} rounded-lg mb-3`}
                      dir="rtl"
                      rows={2}
                      placeholder="תיאור האירוע"
                    />
                  </div>

                  <button
                    onClick={handleAddEvent}
                    className={`${styles.buttonPrimary} py-2 px-4 rounded-lg flex items-center gap-1 w-full justify-center`}
                    disabled={!newEvent.title || !newEvent.startDate || !newEvent.startTime}
                  >
                    <Plus className="h-4 w-4" />
                    הוסף אירוע
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Tab */}
          {activeTab === "pricing" && (
            <div>
              <h3 className={`text-lg font-bold mb-3 ${styles.textColor}`}>מחירים</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">מחיר שיעור פרטי (₪)</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      name="private_price"
                      value={editedData.private_price || ""}
                      onChange={handleEditInputChange}
                      className={`w-full p-3 border ${styles.cardBorder} rounded-lg`}
                      dir="rtl"
                    />
                    <span className="mr-2">₪ / שעה</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">מחיר לשיעור פרטי אישי</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EditPanel;
