import { useState, useEffect } from 'react';
import { Save, Edit, Trash2, Loader, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { supabase } from '../../lib/supabase';
import { showNotification } from '../../components/ui/notification';
import LoaderComponent from '../Loader';

const TutorProfile = ({ dashboardData, isLoading: parentLoading }) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tutorProfileData, setTutorProfileData] = useState({
    name: '',
    mail: '',
    phone: '',
    about_me: '',
    github: '',
    linkedin: '',
    other_link: '',
    education: [],
    grades: [],
    selections: [],
    events: []
  });

  // Initialize tutorProfileData with current data
  useEffect(() => {
    if (dashboardData?.tutor_profile) {
      setTutorProfileData({
        name: dashboardData.tutor_profile.name || '',
        mail: dashboardData.tutor_profile.mail || '',
        phone: dashboardData.tutor_profile.phone || '',
        about_me: dashboardData.tutor_profile.about_me || '',
        github: dashboardData.tutor_profile.github || '',
        linkedin: dashboardData.tutor_profile.linkedin || '',
        other_link: dashboardData.tutor_profile.other_link || '',
        education: dashboardData.tutor_profile.education || [],
        grades: dashboardData.tutor_profile.grades || [],
        selections: dashboardData.tutor_profile.selections || [],
        events: dashboardData.tutor_profile.events || []
      });
    }
  }, [dashboardData]);

  // New education entry
  const [newEducation, setNewEducation] = useState({
    degree_id: '',
    start_date: '',
    end_date: ''
  });

  // New grade entry
  const [newGrade, setNewGrade] = useState({
    degree_id: '',
    course_id: '',
    grade: ''
  });

  // New event entry
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    event_link: ''
  });

  // New specialization entry
  const [newSpecialization, setNewSpecialization] = useState({
    degree_id: '',
    course_id: ''
  });

  // Handle profile update
  const handleTutorProfileUpdate = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke("save-dashboard", {
        method: "POST",
        body: {
          profile_data: {
            name: tutorProfileData.name,
            mail: tutorProfileData.mail,
            phone: tutorProfileData.phone,
            about_me: tutorProfileData.about_me,
            github: tutorProfileData.github,
            linkedin: tutorProfileData.linkedin,
            other_link: tutorProfileData.other_link,
            education: tutorProfileData.education,
            grades: tutorProfileData.grades,
            events: tutorProfileData.events,
            selections: tutorProfileData.selections,
            coupons: tutorProfileData.coupons
          }
        }
      });

      if (error) {
        console.error('Error updating tutor profile:', error);
        showNotification('שגיאה בעדכון פרופיל המרצה', 'error');
        return;
      }

      // Check for partial failures
      if (data.results.some(result => result.status === "error")) {
        console.warn("Some operations failed:", data.results);
        showNotification('חלק מהעדכונים נכשלו', 'warning');
        return;
      }
      
      setIsEditingProfile(false);
      showNotification('פרופיל המרצה עודכן בהצלחה', 'success');
    } catch (error) {
      console.error('Error updating tutor profile:', error);
      showNotification('שגיאה בעדכון פרופיל המרצה', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change for profile data
  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setTutorProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle input change for new education form
  const handleEducationInputChange = (e) => {
    const { name, value } = e.target;
    setNewEducation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle input change for new grade form
  const handleGradeInputChange = (e) => {
    const { name, value } = e.target;
    setNewGrade(prev => ({
      ...prev,
      [name]: value,
      // Reset course_id when degree changes
      ...(name === 'degree_id' && { course_id: '' })
    }));
  };

  // Handle input change for new event form
  const handleEventInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle input change for new specialization form
  const handleSpecializationInputChange = (e) => {
    const { name, value } = e.target;
    setNewSpecialization(prev => ({
      ...prev,
      [name]: value,
      // Reset course_id when degree changes
      ...(name === 'degree_id' && { course_id: '' })
    }));
  };

  // Handle adding a new education item
  const handleAddEducation = () => {
    if (!newEducation.degree_id || !newEducation.start_date || !newEducation.end_date) {
      showNotification('אנא מלא את כל שדות ההשכלה', 'warning');
      return;
    }
    
    const selectedDegree = dashboardData.degrees_with_courses.find(d => d.id === parseInt(newEducation.degree_id));
    
    const newEducationItem = {
      academy_id: selectedDegree?.academy_id || 1,
      academy_name: "HIT", // Since we only have HIT in the data
      degree_id: parseInt(newEducation.degree_id),
      degree_name: selectedDegree?.name || '',
      start_date: newEducation.start_date,
      end_date: newEducation.end_date
    };
    
    setTutorProfileData(prev => ({
      ...prev,
      education: [...prev.education, newEducationItem]
    }));
    
    // Update the displayed data immediately
    dashboardData.tutor_profile.education = [...(dashboardData.tutor_profile.education || []), newEducationItem];
    
    setNewEducation({
      degree_id: '',
      start_date: '',
      end_date: ''
    });
  };

  // Handle removing an education item
  const handleRemoveEducation = (index) => {
    setTutorProfileData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
    // Update the displayed data
    const updatedEducation = [...dashboardData.tutor_profile.education];
    updatedEducation.splice(index, 1);
    dashboardData.tutor_profile.education = updatedEducation;
  };

  // Handle adding a new grade item
  const handleAddGrade = () => {
    if (!newGrade.degree_id || !newGrade.course_id || !newGrade.grade) {
      showNotification('אנא מלא את כל שדות הציון', 'warning');
      return;
    }
    
    const selectedDegree = dashboardData.degrees_with_courses.find(d => d.id === parseInt(newGrade.degree_id));
    const selectedCourse = selectedDegree?.courses.find(c => c.id === parseInt(newGrade.course_id));
    
    const newGradeItem = {
      course_id: parseInt(newGrade.course_id),
      course_name: selectedCourse?.name || '',
      grade: parseInt(newGrade.grade),
      year: selectedCourse?.year || 1
    };
    
    setTutorProfileData(prev => ({
      ...prev,
      grades: [...prev.grades, newGradeItem]
    }));
    
    // Update the displayed data immediately
    dashboardData.tutor_profile.grades = [...(dashboardData.tutor_profile.grades || []), newGradeItem];
    
    setNewGrade({
      degree_id: '',
      course_id: '',
      grade: ''
    });
  };

  // Handle removing a grade item
  const handleRemoveGrade = (index) => {
    setTutorProfileData(prev => ({
      ...prev,
      grades: prev.grades.filter((_, i) => i !== index)
    }));
    // Update the displayed data
    const updatedGrades = [...dashboardData.tutor_profile.grades];
    updatedGrades.splice(index, 1);
    dashboardData.tutor_profile.grades = updatedGrades;
  };

  // Handle adding a new event item
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.start_date || !newEvent.start_time) {
      showNotification('אנא מלא את כל השדות הנדרשים לאירוע', 'warning');
      return;
    }
    
    setTutorProfileData(prev => ({
      ...prev,
      events: [...prev.events, newEvent]
    }));
    
    // Update the displayed data immediately
    dashboardData.tutor_profile.events = [...(dashboardData.tutor_profile.events || []), newEvent];
    
    setNewEvent({
      title: '',
      description: '',
      start_date: '',
      start_time: '',
      end_date: '',
      end_time: '',
      event_link: ''
    });
  };

  // Handle removing an event item
  const handleRemoveEvent = (index) => {
    setTutorProfileData(prev => ({
      ...prev,
      events: prev.events.filter((_, i) => i !== index)
    }));
    // Update the displayed data
    const updatedEvents = [...dashboardData.tutor_profile.events];
    updatedEvents.splice(index, 1);
    dashboardData.tutor_profile.events = updatedEvents;
  };

  // Handle adding a new specialization
  const handleAddSpecialization = () => {
    if (!newSpecialization.degree_id || !newSpecialization.course_id) {
      showNotification('אנא מלא את כל שדות הקורס', 'warning');
      return;
    }
    
    const selectedDegree = dashboardData.degrees_with_courses.find(d => d.id === parseInt(newSpecialization.degree_id));
    const selectedCourse = selectedDegree?.courses.find(c => c.id === parseInt(newSpecialization.course_id));
    
    const newSpecializationItem = {
      course_id: parseInt(newSpecialization.course_id),
      course_name: selectedCourse?.name || '',
      degree_id: parseInt(newSpecialization.degree_id),
      degree_name: selectedDegree?.name || '',
      academy_id: selectedDegree?.academy_id || 1,
      academy_name: "HIT" // Since we only have HIT in the data
    };
    
    setTutorProfileData(prev => ({
      ...prev,
      selections: [...prev.selections, newSpecializationItem]
    }));
    
    // Update the displayed data immediately
    dashboardData.tutor_profile.selections = [...(dashboardData.tutor_profile.selections || []), newSpecializationItem];
    
    setNewSpecialization({
      degree_id: '',
      course_id: ''
    });
  };

  // Handle removing a specialization
  const handleRemoveSpecialization = (index) => {
    setTutorProfileData(prev => ({
      ...prev,
      selections: prev.selections.filter((_, i) => i !== index)
    }));
    // Update the displayed data
    const updatedSelections = [...dashboardData.tutor_profile.selections];
    updatedSelections.splice(index, 1);
    dashboardData.tutor_profile.selections = updatedSelections;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>פרופיל מרצה</CardTitle>
            <CardDescription>עריכת פרטי המרצה והפרופיל הציבורי שלך</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            disabled={isLoading}
          >
            {isEditingProfile ? <Save size={18} /> : <Edit size={18} />}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium mb-4">פרטים אישיים</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">שם מלא</label>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      name="name"
                      value={tutorProfileData.name || ''}
                      onChange={handleProfileInputChange}
                      className="w-full p-2 border rounded"
                      placeholder="שם המרצה"
                    />
                  ) : (
                    <p className="p-2 bg-white rounded border">{dashboardData.tutor_profile.name || 'לא הוגדר'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">אימייל</label>
                  {isEditingProfile ? (
                    <input
                      type="email"
                      name="mail"
                      value={tutorProfileData.mail || ''}
                      onChange={handleProfileInputChange}
                      className="w-full p-2 border rounded"
                      placeholder="email@example.com"
                    />
                  ) : (
                    <p className="p-2 bg-white rounded border">{dashboardData.tutor_profile.mail || 'לא הוגדר'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">טלפון</label>
                  {isEditingProfile ? (
                    <input
                      type="tel"
                      name="phone"
                      value={tutorProfileData.phone || ''}
                      onChange={handleProfileInputChange}
                      className="w-full p-2 border rounded"
                      placeholder="050-1234567"
                    />
                  ) : (
                    <p className="p-2 bg-white rounded border">{dashboardData.tutor_profile.phone || 'לא הוגדר'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* About Me */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium mb-4">אודות</h3>
              <div>
                <label className="block text-sm font-medium mb-1">אודותיי</label>
                {isEditingProfile ? (
                  <textarea
                    name="about_me"
                    value={tutorProfileData.about_me || ''}
                    onChange={handleProfileInputChange}
                    className="w-full p-2 border rounded"
                    rows={4}
                    placeholder="ספר על עצמך, הניסיון שלך והתחומים שאתה מלמד..."
                  />
                ) : (
                  <div className="p-2 bg-white rounded border min-h-[100px]">
                    {dashboardData.tutor_profile.about_me ? 
                      <p>{dashboardData.tutor_profile.about_me}</p> :
                      <p className="text-gray-400 italic">לא הוזן תוכן</p>
                    }
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium mb-4">קישורים חברתיים</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">לינקדאין</label>
                  {isEditingProfile ? (
                    <input
                      type="url"
                      name="linkedin"
                      value={tutorProfileData.linkedin || ''}
                      onChange={handleProfileInputChange}
                      className="w-full p-2 border rounded"
                      placeholder="https://linkedin.com/in/your-profile"
                    />
                  ) : (
                    <p className="p-2 bg-white rounded border">
                      {dashboardData.tutor_profile.linkedin ? 
                        <a href={dashboardData.tutor_profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {dashboardData.tutor_profile.linkedin}
                        </a> : 
                        'לא הוגדר'
                      }
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">גיטהאב</label>
                  {isEditingProfile ? (
                    <input
                      type="url"
                      name="github"
                      value={tutorProfileData.github || ''}
                      onChange={handleProfileInputChange}
                      className="w-full p-2 border rounded"
                      placeholder="https://github.com/your-username"
                    />
                  ) : (
                    <p className="p-2 bg-white rounded border">
                      {dashboardData.tutor_profile.github ? 
                        <a href={dashboardData.tutor_profile.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {dashboardData.tutor_profile.github}
                        </a> : 
                        'לא הוגדר'
                      }
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">קישור נוסף</label>
                  {isEditingProfile ? (
                    <input
                      type="url"
                      name="other_link"
                      value={tutorProfileData.other_link || ''}
                      onChange={handleProfileInputChange}
                      className="w-full p-2 border rounded"
                      placeholder="https://your-website.com"
                    />
                  ) : (
                    <p className="p-2 bg-white rounded border">
                      {dashboardData.tutor_profile.other_link ? 
                        <a href={dashboardData.tutor_profile.other_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {dashboardData.tutor_profile.other_link}
                        </a> : 
                        'לא הוגדר'
                      }
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium mb-4">השכלה</h3>
              {isEditingProfile && (
                <div className="mb-4 p-4 border rounded bg-white">
                  <h4 className="font-medium mb-2">הוספת השכלה חדשה</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">תואר</label>
                      <select
                        name="degree_id"
                        value={newEducation.degree_id}
                        onChange={(e) => setNewEducation(prev => ({ ...prev, degree_id: e.target.value }))}
                        className="w-full p-2 border rounded"
                      >
                        <option value="">בחר תואר</option>
                        {dashboardData.degrees_with_courses.map(degree => (
                          <option key={degree.id} value={degree.id}>{degree.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">תאריך התחלה</label>
                      <input
                        type="date"
                        name="start_date"
                        value={newEducation.start_date}
                        onChange={(e) => setNewEducation(prev => ({ ...prev, start_date: e.target.value }))}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">תאריך סיום (או צפוי)</label>
                      <input
                        type="date"
                        name="end_date"
                        value={newEducation.end_date}
                        onChange={(e) => setNewEducation(prev => ({ ...prev, end_date: e.target.value }))}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleAddEducation}
                    className="mt-4 bg-blue-600"
                    size="sm"
                  >
                    הוסף השכלה
                  </Button>
                </div>
              )}
              
              {dashboardData.tutor_profile.education && dashboardData.tutor_profile.education.length > 0 ? (
                <div className="space-y-2">
                  {dashboardData.tutor_profile.education.map((edu, index) => (
                    <div key={index} className="p-3 bg-white rounded border flex justify-between items-center">
                      <div>
                        <p className="font-medium">{edu.degree_name}</p>
                        <p className="text-sm text-gray-600">{edu.academy_name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(edu.start_date).toLocaleDateString('he-IL')} - {new Date(edu.end_date).toLocaleDateString('he-IL')}
                        </p>
                      </div>
                      {isEditingProfile && (
                        <Button
                          onClick={() => handleRemoveEducation(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500">לא נמצאו פרטי השכלה</p>
              )}
            </div>
            
            {/* Specializations */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium mb-4">קורסים שאני מלמד</h3>
              {isEditingProfile && (
                <div className="mb-4 p-4 border rounded bg-white">
                  <h4 className="font-medium mb-2">הוספת קורס חדש</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">תואר</label>
                      <select
                        name="degree_id"
                        value={newSpecialization.degree_id || ''}
                        onChange={handleSpecializationInputChange}
                        className="w-full p-2 border rounded"
                      >
                        <option value="">בחר תואר</option>
                        {dashboardData.degrees_with_courses.map(degree => (
                          <option key={degree.id} value={degree.id}>
                            {degree.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">קורס</label>
                      <select
                        name="course_id"
                        value={newSpecialization.course_id || ''}
                        onChange={handleSpecializationInputChange}
                        className="w-full p-2 border rounded"
                        disabled={!newSpecialization.degree_id}
                      >
                        <option value="">בחר קורס</option>
                        {newSpecialization.degree_id && dashboardData.degrees_with_courses
                          .find(d => d.id === parseInt(newSpecialization.degree_id))
                          ?.courses.map(course => (
                            <option key={course.id} value={course.id}>
                              {course.name}
                            </option>
                          ))
                        }
                      </select>
                    </div>
                  </div>
                  <Button
                    onClick={handleAddSpecialization}
                    className="mt-4 bg-blue-600"
                    size="sm"
                  >
                    הוסף קורס
                  </Button>
                </div>
              )}
              {dashboardData.tutor_profile.selections && dashboardData.tutor_profile.selections.length > 0 ? (
                <div className="space-y-2">
                  {dashboardData.tutor_profile.selections.map((selection, index) => (
                    <div key={index} className="p-3 bg-white rounded border flex justify-between items-center">
                      <div>
                        <p className="font-medium">{selection.course_name}</p>
                        <p className="text-sm text-gray-600">{selection.degree_name}, {selection.academy_name}</p>
                      </div>
                      {isEditingProfile && (
                        <Button
                          onClick={() => handleRemoveSpecialization(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500">לא נמצאו קורסים</p>
              )}
              
            </div>

            {/* Events */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium mb-4">אירועים</h3>
              {dashboardData.tutor_profile.events && dashboardData.tutor_profile.events.length > 0 ? (
                <div className="space-y-2">
                  {dashboardData.tutor_profile.events.map((event, index) => (
                    <div key={index} className="p-3 bg-white rounded border">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-gray-600">{event.description}</p>
                          {event.event_link && (
                            <p className="text-sm text-blue-600 mt-1">
                              <a href={event.event_link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                קישור לאירוע
                              </a>
                            </p>
                          )}
                          <div className="mt-2 text-xs text-gray-500">
                            <p>תאריך התחלה: {new Date(event.start_date).toLocaleDateString('he-IL')} {event.start_time}</p>
                            {event.end_date && event.end_time && (
                              <p>תאריך סיום: {new Date(event.end_date).toLocaleDateString('he-IL')} {event.end_time}</p>
                            )}
                          </div>
                        </div>
                        {isEditingProfile && (
                          <Button
                            onClick={() => handleRemoveEvent(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500">לא נמצאו אירועים</p>
              )}
              {isEditingProfile && (
                <div className="mt-4 p-4 border rounded bg-white">
                  <h4 className="font-medium mb-2">הוספת אירוע חדש</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">כותרת</label>
                      <input
                        type="text"
                        name="title"
                        value={newEvent.title || ''}
                        onChange={handleEventInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="כותרת האירוע"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">תיאור</label>
                      <input
                        type="text"
                        name="description"
                        value={newEvent.description || ''}
                        onChange={handleEventInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="תיאור האירוע"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">תאריך התחלה</label>
                      <input
                        type="date"
                        name="start_date"
                        value={newEvent.start_date || ''}
                        onChange={handleEventInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">שעת התחלה</label>
                      <input
                        type="time"
                        name="start_time"
                        value={newEvent.start_time || ''}
                        onChange={handleEventInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">תאריך סיום</label>
                      <input
                        type="date"
                        name="end_date"
                        value={newEvent.end_date || ''}
                        onChange={handleEventInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">שעת סיום</label>
                      <input
                        type="time"
                        name="end_time"
                        value={newEvent.end_time || ''}
                        onChange={handleEventInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">קישור לאירוע</label>
                      <input
                        type="url"
                        name="event_link"
                        value={newEvent.event_link || ''}
                        onChange={handleEventInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="https://your-event-link.com"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleAddEvent}
                    className="mt-4 bg-blue-600"
                    size="sm"
                  >
                    הוסף אירוע
                  </Button>
                </div>
              )}
            </div>

            {/* Grades */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium mb-4">ציונים</h3>
              {dashboardData.tutor_profile.grades && dashboardData.tutor_profile.grades.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">קורס</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">ציון</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">שנה</th>
                        {isEditingProfile && <th className="px-6 py-3"></th>}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dashboardData.tutor_profile.grades.map((grade, index) => (
                        <tr key={grade.id || index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{grade.course_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-full ${
                              grade.grade >= 90 ? 'bg-green-100 text-green-800' :
                              grade.grade >= 80 ? 'bg-blue-100 text-blue-800' :
                              grade.grade >= 70 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {grade.grade}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">שנה {grade.year}</td>
                          {isEditingProfile && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                              <Button
                                onClick={() => handleRemoveGrade(index)}
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500">לא נמצאו ציונים</p>
              )}
              {isEditingProfile && (
                <div className="mt-4 p-4 border rounded bg-white">
                  <h4 className="font-medium mb-2">הוספת ציון חדש</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">תואר</label>
                      <select
                        name="degree_id"
                        value={newGrade.degree_id || ''}
                        onChange={handleGradeInputChange}
                        className="w-full p-2 border rounded"
                      >
                        <option value="">בחר תואר</option>
                        {dashboardData.degrees_with_courses.map(degree => (
                          <option key={degree.id} value={degree.id}>
                            {degree.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">קורס</label>
                      <select
                        name="course_id"
                        value={newGrade.course_id || ''}
                        onChange={handleGradeInputChange}
                        className="w-full p-2 border rounded"
                        disabled={!newGrade.degree_id}
                      >
                        <option value="">בחר קורס</option>
                        {newGrade.degree_id && dashboardData.degrees_with_courses
                          .find(d => d.id === parseInt(newGrade.degree_id))
                          ?.courses.map(course => (
                            <option key={course.id} value={course.id}>
                              {course.name}
                            </option>
                          ))
                        }
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">ציון</label>
                      <input
                        type="number"
                        name="grade"
                        min="0"
                        max="100"
                        value={newGrade.grade || ''}
                        onChange={handleGradeInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="ציון (0-100)"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleAddGrade}
                    className="mt-4 bg-blue-600"
                    size="sm"
                  >
                    הוסף ציון
                  </Button>
                </div>
              )}
            </div>

            {isEditingProfile && (
              <div className="flex justify-end mt-4">
                <Button
                  onClick={() => setIsEditingProfile(false)}
                  className="bg-gray-200 text-gray-800 mr-2"
                >
                  ביטול
                </Button>
                <Button
                  onClick={handleTutorProfileUpdate}
                  className="bg-blue-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoaderComponent />
                      שומר שינויים...
                    </>
                  ) : (
                    'שמור שינויים'
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TutorProfile; 