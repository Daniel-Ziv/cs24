import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { courseMappings, specializationsMappings } from '../config/courseMappings.js';
import { courseStyles } from '../config/courseStyles';
import { showNotification } from './ui/notification';

// ————————————————————————————————————————————————
// Hebrew degree names mapping
const DEGREE_NAMES = {
  cs: 'מדעי המחשב',
  ee: 'הנדסת חשמל',
  ie: 'הנדסת תעשייה וניהול'
};

const YEAR_ID_MAP = {
  "שנה א'": 1,
  "שנה ב'": 2,
  "שנה ג'": 3,
  "שנה ד'": 4
};

const ACADEMY_ID = 1;

// ————————————————————————————————————————————————

const getYearsForDegree = (degree) =>
  Object.keys(courseMappings[degree] || {})
    .filter(y => y !== 'רב-תחומי');

export default function JoinRequestModal({
  isOpen,
  onClose,
  courseType: initialCourseType,
  session
}) {
  const [courseType, setCourseType] = useState(initialCourseType);
  const [selectedYearLabels, setSelectedYearLabels] = useState([]);   // e.g. ["שנה א'", "שנה ג'"]
  const [specialization, setSpecialization] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCourseNames, setSelectedCourseNames] = useState([]);   // e.g. ["קורס א'", "קורס ג'"]
  const [isSubmitting, setIsSubmitting] = useState(false);

  const styles = courseStyles[initialCourseType] || courseStyles.cs;
  if (!isOpen || !session) return null;

  // gather courses by the Hebrew-label years + optional tag
  const getCoursesByYears = (deg, years, spec) => {
    let all = [];
    years.forEach(label => {
      const list = courseMappings[deg]?.[label] || [];
      const filtered = (!spec || !["שנה ג'","שנה ד'"].includes(label))
        ? list.filter(c => !c.tag)
        : list.filter(c =>
            !c.tag ||
            (Array.isArray(c.tag)
              ? c.tag.includes(spec)
              : c.tag === spec
            )
          );
      all.push(...filtered);
    });
    return all;
  };

  const toggleYear = label =>
    setSelectedYearLabels(prev =>
      prev.includes(label)
        ? prev.filter(x => x !== label)
        : [...prev, label]
    );

  const toggleSubject = courseName =>
    setSelectedCourseNames(prev =>
      prev.includes(courseName) ? prev.filter(x => x !== courseName) : [...prev, courseName]
    );

  const availableCourses = getCoursesByYears(courseType, selectedYearLabels, specialization);

  const handleSubmit = async e => {
    e.preventDefault();
    // 1) basic validation
    if (!name || !phone || !selectedYearLabels.length || !selectedCourseNames.length) {
      return showNotification('אנא מלא את כל השדות הנדרשים', 'warning');
    }
    if (!/^05\d{8}$/.test(phone)) {
      return showNotification('מספר טלפון לא תקין. אנא הזן 05XXXXXXXX', 'warning');
    }

    setIsSubmitting(true);
    try {
      // 3) check pending requests
      const { data: pend, error: chkErr } = await supabase
        .from('new_tutor_requests')
        .select('id')
        .eq('phone', phone)
        .eq('status', 'pending');
      if (chkErr) throw chkErr;
      if (pend.length) {
        return showNotification('כבר יש בקשה ממתינה עם מספר זה.', 'warning');
      }

      // Get degree ID using the function
      const { data: degreeId, error: degreeError } = await supabase.rpc(
        'get_degree_id_by_details',
        {
          p_degree_name: DEGREE_NAMES[courseType],
          p_academy_id: ACADEMY_ID
        }
      );

      if (degreeError) {
        console.error('Failed to get degree:', degreeError);
        showNotification(`המסלול "${DEGREE_NAMES[courseType]}" לא נמצא`, 'error');
        setIsSubmitting(false);
        return;
      }
      
      console.log('Got degree ID:', degreeId);

      // Convert course names to IDs using the Supabase function
      const courseIds = [];

      for (const courseName of selectedCourseNames) {
        // Find the year for this course from availableCourses
        const courseInfo = availableCourses.find(c => c.name === courseName);
        if (!courseInfo) continue;

        // Get the year number from the Hebrew year label
        const yearLabel = selectedYearLabels.find(y => 
          courseMappings[courseType][y].some(c => c.name === courseName)
        );
        const yearNumber = YEAR_ID_MAP[yearLabel];

        const { data: courseId, error } = await supabase.rpc(
          'get_course_id_by_details',
          { 
            p_course_name: courseName, 
            p_degree_id: degreeId, 
            p_year: yearNumber 
          }
        );

        if (error) {
          showNotification(
            `לא הצלחתי למצוא את הקורס "${courseName}" (deg=${degreeId}, year=${yearNumber})`,
            'error'
          );
          setIsSubmitting(false);
          return;
        } else if (courseId === null) {
          // you opted for NULL-on-miss
          showNotification(`הקורס "${courseName}" לא קיים בבסיס הנתונים`, 'warning');
          setIsSubmitting(false);
          return;
        } else {
          courseIds.push(courseId);
        }
      }

      if (courseIds.length === 0) {
        showNotification('לא נמצאו קורסים תקינים', 'error');
        setIsSubmitting(false);
        return;
      }

      // 4) insert new request
      const payload = {
        name,
        phone,
        degree: [degreeId],
        years: selectedYearLabels.map(l => YEAR_ID_MAP[l]),
        courses: courseIds,
        academy: [ACADEMY_ID],
        status: 'pending',
        created_at: new Date().toISOString(),
        user_id: session.user.id,
        email: session.user.email
      };
      console.log('RPC payload →', payload);

      const { error: insErr } = await supabase
        .from('new_tutor_requests')
        .insert([payload]);
      if (insErr) throw insErr;

      showNotification('בקשתך נשלחה בהצלחה! ', 'success');
      onClose();
    } catch (err) {
      console.error(err);
      showNotification('שגיאה בשליחת הבקשה. אנא נסה שוב מאוחר יותר.', 'error');
    } finally {
      setIsSubmitting(false);
      // reset form
      setName('');
      setPhone('');
      setSelectedYearLabels([]);
      setSpecialization('');
      setSelectedCourseNames([]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white flex flex-col max-h-[90vh]">
        <CardHeader className="relative border-b">
          <Button
            variant="outline"
            className="absolute left-2 top-2 p-1"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl text-center" dir="rtl">
            בקשת הצטרפות למאגר המורים
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto p-4" dir="rtl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* שם מלא */}
            <div>
              <label className="block text-sm font-medium">שם מלא</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            {/* מספר טלפון */}
            <div>
              <label className="block text-sm font-medium">מספר טלפון</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            {/* מסלול */}
            <div>
              <label className="block text-sm font-medium">מסלול</label>
              <select
                value={courseType}
                onChange={e => {
                  setCourseType(e.target.value);
                  setSelectedYearLabels([]);
                  setSpecialization('');
                  setSelectedCourseNames([]);
                }}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">בחר מסלול</option>
                <option value="cs">מדעי המחשב</option>
                <option value="ee">הנדסת חשמל</option>
                <option value="ie">הנדסת תעשייה וניהול</option>
              </select>
            </div>

            {/* שנים */}
            <div>
              <label className="block text-sm font-medium">שנים</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {getYearsForDegree(courseType).map(label => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => toggleYear(label)}
                    className={`p-2 text-sm rounded transition-colors ${
                      selectedYearLabels.includes(label)
                        ? styles.buttonPrimary
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* התמחות */}
            {specializationsMappings[courseType]?.length > 0 &&
              selectedYearLabels.some(y => ["שנה ג'","שנה ד'"].includes(y)) && (
                <div>
                  <label className="block text-sm font-medium">התמחות (אופציונלי)</label>
                  <select
                    value={specialization}
                    onChange={e => {
                      setSpecialization(e.target.value);
                      setSelectedCourseNames([]);
                    }}
                    className="w-full border p-2 rounded"
                  >
                    <option value="">ללא</option>
                    {specializationsMappings[courseType].map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
              )
            }

            {/* קורסים */}
            {selectedYearLabels.length > 0 && (
              <div>
                <label className="block text-sm font-medium">קורסים</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableCourses.map(c => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => toggleSubject(c.name)}
                      className={`p-2 text-sm rounded transition-colors ${
                        selectedCourseNames.includes(c.name)
                          ? styles.buttonPrimary
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* כפתורים */}
            <div className="flex justify-end gap-2 pt-4 mt-4 border-t">
              <Button variant="outline" onClick={onClose}>ביטול</Button>
              <Button type="submit" disabled={isSubmitting} className={styles.buttonPrimary}>
                {isSubmitting ? '…שולח' : 'שליחה'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
