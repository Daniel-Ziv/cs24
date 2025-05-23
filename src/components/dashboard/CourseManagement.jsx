import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Users, Zap, Trash2, Loader, Eye, EyeOff } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { showNotification } from '../../components/ui/notification';
import { supabase } from '../../lib/supabase';

const CourseManagement = ({ 
  tutorCourses: initialTutorCourses, 
  handleStartCourseEdit, 
  handleToggleCourseVisibility, 
  handleDeleteCourse,
  handleGrantAccess,
  handleRevokeAccess,
  fetchUserAccessList,
  isLoading: parentLoading 
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [tutorCourses, setTutorCourses] = useState(initialTutorCourses || []);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [selectedCourseForAccess, setSelectedCourseForAccess] = useState('');
  const [selectedUserToRevoke, setSelectedUserToRevoke] = useState(null);
  const [accessEmail, setAccessEmail] = useState('');
  const [accessExpiry, setAccessExpiry] = useState('');
  const [userAccessList, setUserAccessList] = useState([]);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [currentEditingCourse, setCurrentEditingCourse] = useState(null);
  const [showAccessManagement, setShowAccessManagement] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserExpiry, setNewUserExpiry] = useState('');

  // Update tutorCourses when initialTutorCourses changes
  useEffect(() => {
    setTutorCourses(initialTutorCourses || []);
  }, [initialTutorCourses]);

  const handleCourseEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentEditingCourse(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancelCourseEdit = () => {
    setCurrentEditingCourse(null);
    setIsEditingCourse(false);
  };

  const handleSaveCourseEdit = async () => {
    if (!currentEditingCourse) return;
    
    try {
      setIsLoading(true);
      
      // Prepare update data
      const updateData = {
        title: currentEditingCourse.editTitle,
        description: currentEditingCourse.editDescription,
        shown: currentEditingCourse.editShown
      };
      
      // Call Supabase to update the course
      const { error } = await supabase
        .from('video_courses')
        .update(updateData)
        .eq('id', currentEditingCourse.video_course_id);
        
      if (error) {
        console.error('Error updating course:', error);
        showNotification('שגיאה בעדכון הקורס', 'error');
        return;
      }
      
      // Update local state
      setTutorCourses(prevCourses => 
        prevCourses.map(course => 
          course.id === currentEditingCourse.id
            ? { 
                ...course, 
                title: updateData.title,
                description: updateData.description,
                is_active: updateData.shown
              } 
            : course
        )
      );
      
      setIsEditingCourse(false);
      setCurrentEditingCourse(null);
      showNotification('הקורס עודכן בהצלחה', 'success');
    } catch (error) {
      console.error('Error updating course:', error);
      showNotification('שגיאה בעדכון הקורס', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUserAccess = async () => {
    if (!newUserEmail || !selectedCourseForAccess) {
      showNotification('אנא מלא את כל השדות הנדרשים', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('grant_course_access', {
        email: newUserEmail,
        course_id: selectedCourseForAccess.id,
        expires_at: newUserExpiry ? new Date(newUserExpiry).toISOString() : null
      });

      if (error) {
        console.error('Error granting access:', error);
        showNotification('שגיאה בהענקת גישה לקורס', 'error');
        return;
      }

      fetchUserAccessList(selectedCourseForAccess.id.toString());
      
      setNewUserEmail('');
      setNewUserExpiry('');
      
      showNotification('הגישה הוענקה בהצלחה', 'success');
    } catch (error) {
      console.error('Error granting access:', error);
      showNotification('שגיאה בהענקת גישה לקורס', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveUserAccess = async (accessId) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('access')
        .delete()
        .eq('id', accessId);

      if (error) {
        console.error('Error removing access:', error);
        showNotification('שגיאה בהסרת הגישה', 'error');
        return;
      }

      setUserAccessList(prev => prev.filter(user => user.id !== accessId));
      showNotification('הגישה הוסרה בהצלחה', 'success');
    } catch (error) {
      console.error('Error removing access:', error);
      showNotification('שגיאה בהסרת הגישה', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>ניהול קורסים</CardTitle>
            <CardDescription>ערוך ונהל את הקורסים שלך בפלטפורמה</CardDescription>
          </div>
          <Button
            onClick={() => navigate('/UploadPage')}
            className="bg-blue-600"
          >
            <Plus size={16} className="mr-2" />
            העלה קורס חדש
          </Button>
        </CardHeader>
        <CardContent>
          {tutorCourses.length > 0 ? (
            <div className="space-y-4">
              {tutorCourses.map((course, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow border">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center">
                        <h3 className="font-bold text-lg">{course.title}</h3>
                        <span className={`mr-2 text-xs font-medium py-1 px-2 rounded-full ${course.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {course.is_active ? 'פעיל' : 'לא פעיל'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">מחיר: ₪{course.price}</p>
                      {course.sale_price && (
                        <p className="text-sm text-green-600">מחיר מבצע: ₪{course.sale_price}</p>
                      )}
                      <div className="flex items-center mt-2">
                        <Users size={14} className="text-gray-400 mr-1" />
                        <p className="text-xs text-gray-500">
                          {course.students_count} סטודנטים
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        נוצר בתאריך: {new Date(course.created_at).toLocaleDateString('he-IL')}
                      </p>
                      {course.description && (
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">{course.description}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={() => handleStartCourseEdit(course)}
                        className="bg-gray-100 text-gray-800 hover:bg-gray-200"
                        size="sm"
                      >
                        <Edit size={14} className="mr-1" />
                        ערוך
                      </Button>
                      <Button
                        onClick={() => handleToggleCourseVisibility(course)}
                        className={`${course.is_active ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}
                        size="sm"
                      >
                        {course.is_active ? 'הסתר' : 'הצג'}
                      </Button>
                      <Button
                        onClick={() => navigate(`/course/${course.video_id}`)}
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                        size="sm"
                      >
                        <Zap size={14} className="mr-1" />
                        צפה
                      </Button>
                      <Button
                        onClick={() => {
                          if (course.id) {
                            setSelectedCourseForAccess(course.id.toString());
                            fetchUserAccessList(course.id);
                          } else {
                            showNotification('מזהה הקורס לא זמין', 'error');
                          }
                          setIsAccessModalOpen(true);
                        }}
                        className="bg-purple-100 text-purple-800 hover:bg-purple-200"
                        size="sm"
                      >
                        <Users size={14} className="mr-1" />
                        נהל גישה
                      </Button>
                      <Button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="bg-red-100 text-red-800 hover:bg-red-200"
                        size="sm"
                      >
                        <Trash2 size={14} className="mr-1" />
                        מחק
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">עדיין אין לך קורסים בפלטפורמה</p>
              <Button
                onClick={() => navigate('/UploadPage')}
                className="bg-blue-600"
              >
                התחל ליצור קורס
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Access Management Modal */}
      {isAccessModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">ניהול גישה לקורס</h3>
                <button 
                  onClick={() => setIsAccessModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">הענק גישה למשתמש חדש</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">אימייל</label>
                    <input
                      type="email"
                      value={accessEmail}
                      onChange={(e) => setAccessEmail(e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="user@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">קורס</label>
                    <select
                      value={selectedCourseForAccess}
                      onChange={(e) => {
                        setSelectedCourseForAccess(e.target.value);
                        if (e.target.value) {
                          fetchUserAccessList(parseInt(e.target.value));
                        }
                      }}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">בחר קורס</option>
                      {tutorCourses.map(course => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">תאריך תפוגה</label>
                    <input
                      type="date"
                      value={accessExpiry}
                      onChange={(e) => setAccessExpiry(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={handleGrantAccess}
                    className="bg-blue-600"
                    disabled={!accessEmail || !selectedCourseForAccess || !accessExpiry || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader size={16} className="mr-2 animate-spin" />
                        מעניק גישה...
                      </>
                    ) : (
                      'הענק גישה'
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">משתמשים עם גישה</h4>
                {userAccessList.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 px-4 text-right font-medium">משתמש</th>
                          <th className="py-2 px-4 text-right font-medium">אימייל</th>
                          <th className="py-2 px-4 text-right font-medium">הוענק בתאריך</th>
                          <th className="py-2 px-4 text-right font-medium">תוקף עד</th>
                          <th className="py-2 px-4 text-right font-medium">פעולות</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {userAccessList.map((access, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="py-2 px-4">{access.user_name || 'לא ידוע'}</td>
                            <td className="py-2 px-4">{access.user_email}</td>
                            <td className="py-2 px-4">{new Date(access.granted_at).toLocaleDateString('he-IL')}</td>
                            <td className="py-2 px-4">{new Date(access.expires_at).toLocaleDateString('he-IL')}</td>
                            <td className="py-2 px-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedUserToRevoke(access);
                                  setIsRevokeModalOpen(true);
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">אין משתמשים עם גישה לקורס זה</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revoke Access Confirmation Modal */}
      {isRevokeModalOpen && selectedUserToRevoke && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">אישור ביטול גישה</h3>
            <p className="mb-6">
              האם אתה בטוח שברצונך לבטל את הגישה של {selectedUserToRevoke.user_name || selectedUserToRevoke.user_email} לקורס?
            </p>
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setIsRevokeModalOpen(false)}
                className="bg-gray-200 text-gray-800"
              >
                ביטול
              </Button>
              <Button
                onClick={handleRevokeAccess}
                className="bg-red-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader size={16} className="mr-2 animate-spin" />
                    מבטל גישה...
                  </>
                ) : (
                  'בטל גישה'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement; 