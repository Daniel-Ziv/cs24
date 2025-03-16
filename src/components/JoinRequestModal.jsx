import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { yearOneCourses, yearTwoCourses, yearThreeCourses, eeYearOneCourses, eeYearTwoCourses, eeYearThreeCourses, eeYearFourCourses } from './CoursesList';
import { showNotification } from './ui/notification';

const YEARS = ['שנה א', 'שנה ב', 'שנה ג', 'שנה ד'];

const EE_SPECIALIZATIONS = [
  'בקרה',
  'ביו הנדסה',
  'תקשורת ועיבוד אותות',
  'אלקטרואופטיקה ומיקרואלקטרוניקה',
  'אנרגיה ומערכות הספק(זרם חזק)',
  'אנרגיות חלופיות ומערכות הספק משולב',
  'מערכות משובצות מחשב'
];

// Helper function to get courses based on degree and selected years
const getCoursesByYears = (degree, selectedYears, specialization = null) => {
  let allCourses = [];
  
  selectedYears.forEach(year => {
    let yearCourses = [];
    if (degree === 'cs') {
      switch(year) {
        case 'שנה א': yearCourses = yearOneCourses; break;
        case 'שנה ב': yearCourses = yearTwoCourses; break;
        case 'שנה ג': yearCourses = yearThreeCourses; break;
        default: yearCourses = [];
      }
    } else {
      switch(year) {
        case 'שנה א': yearCourses = eeYearOneCourses; break;
        case 'שנה ב': yearCourses = eeYearTwoCourses; break;
        case 'שנה ג': yearCourses = eeYearThreeCourses; break;
        case 'שנה ד': yearCourses = eeYearFourCourses; break;
        default: yearCourses = [];
      }
    }
    
    // Filter courses based on specialization
    if (degree === 'ee' && (year === 'שנה ג' || year === 'שנה ד')) {
      if (specialization) {
        // If specialization is selected, show courses for that specialization
        yearCourses = yearCourses.filter(course => 
          !course.tag || // Include general courses
          (Array.isArray(course.tag) && course.tag.includes(specialization)) || // Handle array of tags
          course.tag === specialization // Handle single tag
        );
      } else {
        // If no specialization is selected, only show general courses
        yearCourses = yearCourses.filter(course => !course.tag);
      }
    }
    
    allCourses = [...allCourses, ...yearCourses];
  });
  
  return allCourses;
};

const JoinRequestModal = ({ isOpen, onClose, courseType, session }) => {
  const [degree, setDegree] = useState(courseType);
  const [selectedYears, setSelectedYears] = useState([]);
  const [specialization, setSpecialization] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !session) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!name || !phone || selectedYears.length === 0 || selectedSubjects.length === 0) {
      showNotification('אנא מלא את כל השדות הנדרשים', 'warning');
      return;
    }

    // Validate phone number format
    const phoneRegex = /^05\d{8}$/;
    if (!phoneRegex.test(phone)) {
      showNotification('מספר טלפון לא תקין. אנא הזן מספר בפורמט 05XXXXXXXX', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert new request
      const { error: insertError } = await supabase
        .from('tutor_requests')
        .insert([{
          name,
          phone,
          degree,
          years: selectedYears,
          specialization: degree === 'ee' ? specialization : null,
          subjects: selectedSubjects,
          status: 'pending',
          created_at: new Date().toISOString(),
          user_id: session.user.id,
          email: session.user.email
        }]);

      if (insertError) {
        if (insertError.code === '23505') { // Unique constraint violation
          showNotification('כבר קיימת בקשה פעילה עם מספר טלפון זה. אנא המתן לתשובה.', 'warning');
          return;
        }
        throw insertError;
      }

      showNotification('בקשתך נשלחה בהצלחה! נחזור אליך בקרוב', 'success');
      onClose();
      // Reset form
      setName('');
      setPhone('');
      setSelectedYears([]);
      setSpecialization('');
      setSelectedSubjects([]);
    } catch (error) {
      console.error('Error submitting request:', error);
      showNotification('אירעה שגיאה בשליחת הבקשה. אנא נסה שוב מאוחר יותר', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleYear = (year) => {
    setSelectedYears(prev => 
      prev.includes(year)
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
    setSelectedSubjects([]); // Clear selected subjects when years change
  };

  const availableCourses = getCoursesByYears(degree, selectedYears, specialization);

  const toggleSubject = (subject) => {
    setSelectedSubjects(prev => 
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white flex flex-col max-h-[90vh]">
        <CardHeader className="relative border-b">
          <Button
            variant="outline"
            className="absolute left-2 sm:left-4 top-2 sm:top-4 p-1 sm:p-2"
            onClick={onClose}
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <CardTitle className="text-2xl font-bold text-center" dir="rtl">
            בקשת הצטרפות למאגר המורים
          </CardTitle>
          <p className="text-gray-600 text-center mt-2" dir="rtl">
            אנא מלא את הפרטים הבאים. נבדוק את בקשתך ונחזור אליך בהקדם.
          </p>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4 py-4" dir="rtl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                שם מלא
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                מספר טלפון
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                מסלול
              </label>
              <select
                value={degree}
                onChange={(e) => {
                  setDegree(e.target.value);
                  setSelectedYears([]);
                  setSpecialization('');
                  setSelectedSubjects([]);
                }}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">בחר מסלול</option>
                <option value="cs">מדעי המחשב</option>
                <option value="ee">הנדסת חשמל</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                שנים
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {YEARS.filter(y => degree === 'cs' ? y !== 'שנה ד' : true).map(year => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => toggleYear(year)}
                    className={`p-2 text-sm rounded-md transition-colors ${
                      selectedYears.includes(year)
                        ? degree === 'cs'
                          ? 'bg-blue-600 text-white'
                          : 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {degree === 'ee' && selectedYears.some(y => y === 'שנה ג' || y === 'שנה ד') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  התמחות (אופציונלי - בחר רק אם אתה רוצה ללמד קורסי התמחות)
                </label>
                <select
                  value={specialization}
                  onChange={(e) => {
                    setSpecialization(e.target.value);
                    setSelectedSubjects([]);
                  }}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">ללא התמחות - קורסי חובה בלבד</option>
                  {EE_SPECIALIZATIONS.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
            )}

            {selectedYears.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  קורסים
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableCourses.map(course => (
                    <button
                      key={course.id}
                      type="button"
                      onClick={() => toggleSubject(course.name)}
                      className={`p-2 text-sm rounded-md transition-colors ${
                        selectedSubjects.includes(course.name)
                          ? degree === 'cs'
                            ? 'bg-blue-600 text-white'
                            : 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {course.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="sticky bottom-0 flex justify-end gap-2 pt-4 mt-6 border-t bg-white">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-24"
              >
                ביטול
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !selectedSubjects.length}
                className={`w-24 text-white ${degree === 'cs' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'}`}
              >
                {isSubmitting ? '...שולח' : 'שליחה'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinRequestModal; 