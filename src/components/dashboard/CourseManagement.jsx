import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Users, Zap, Trash2, Loader } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { showNotification } from '../../components/ui/notification';
import { supabase } from '../../lib/supabase';

const CourseManagement = ({ 
  tutorCourses: initialTutorCourses, 
  handleStartCourseEdit, 
  handleGrantAccess,
  handleRevokeAccess,
  dashboardData,
  isLoading: parentLoading 
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [tutorCourses, setTutorCourses] = useState(initialTutorCourses || []);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [selectedCourseForAccess, setSelectedCourseForAccess] = useState('');
  const [selectedUserToRevoke, setSelectedUserToRevoke] = useState(null);
  const [userAccessList, setUserAccessList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [currentEditingCourse, setCurrentEditingCourse] = useState(null);
  const [showAccessManagement, setShowAccessManagement] = useState(false);

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
          course.video_course_id === currentEditingCourse.video_course_id
            ? { 
                ...course, 
                title: updateData.title,
                description: updateData.description,
                shown: updateData.shown
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

  // Fetch user access list for a specific course
  const fetchUserAccessList = async (courseId) => {
    try {
      setIsLoading(true);
      
      // Find the course and use its purchasers data
      const course = tutorCourses.find(c => c.video_course_id === courseId);
      if (course && course.purchasers) {
        // Transform purchasers data to match expected format - only include paid students
        const transformedData = course.purchasers
          .filter(purchaser => purchaser.paid === true) // Only show students who have actually paid
          .map(purchaser => ({
            user_uuid: purchaser.user_uuid,
            user_name: purchaser.customer_full_name || 'לא ידוע',
            user_email: purchaser.customer_email,
            granted_at: purchaser.purchase_date,
            expires_at: null, // Purchasers don't have expiry dates
            enabled: purchaser.enabled,
            video_course_id: courseId
          }));
        setUserAccessList(transformedData);
      } else {
        setUserAccessList([]);
      }
    } catch (error) {
      console.error('Error fetching access list:', error);
      showNotification('שגיאה בטעינת רשימת הגישות', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveUserAccess = async (userUuid) => {
    setIsLoading(true);
    try {
      // Create access update to disable user
      const accessUpdate = {
        user_uuid: userUuid,
        video_course_id: selectedCourseForAccess.video_course_id,
        enabled: 0 // Use 0 to disable
      };

      // Get existing access_updates from dashboardData or create empty array
      const existingAccessUpdates = dashboardData.access_updates || [];

      // Use save-dashboard with complete data including access update
      const { data, error } = await supabase.functions.invoke("save-dashboard", {
        method: "POST",
        body: {
          profile_data: {
            name: dashboardData.tutor_profile?.name || '',
            mail: dashboardData.tutor_profile?.mail || '',
            phone: dashboardData.tutor_profile?.phone || '',
            about_me: dashboardData.tutor_profile?.about_me || '',
            github: dashboardData.tutor_profile?.github || '',
            linkedin: dashboardData.tutor_profile?.linkedin || '',
            other_link: dashboardData.tutor_profile?.other_link || '',
            education: dashboardData.tutor_profile?.education || [],
            grades: dashboardData.tutor_profile?.grades || [],
            events: dashboardData.tutor_profile?.events || [],
            selections: dashboardData.tutor_profile?.selections || [],
            access_updates: [...existingAccessUpdates, accessUpdate]
          }
        }
      });

      if (error) {
        console.error('Error removing access:', error);
        showNotification('שגיאה בהסרת הגישה', 'error');
        return;
      }

      // Update local state
      const updatedAccessList = userAccessList.map(access => 
        access.user_uuid === userUuid ? { ...access, enabled: false } : access
      );
      setUserAccessList(updatedAccessList);
      
      setIsRevokeModalOpen(false);
      setSelectedUserToRevoke(null);
      showNotification('הגישה הוסרה בהצלחה', 'success');
    } catch (error) {
      console.error('Error removing access:', error);
      showNotification('שגיאה בהסרת הגישה', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreAccess = async (access) => {
    setIsLoading(true);
    try {
      // Create access update to enable user
      const accessUpdate = {
        user_uuid: access.user_uuid,
        video_course_id: selectedCourseForAccess.video_course_id,
        enabled: 1 // Use 1 to enable
      };

      // Get existing access_updates from dashboardData or create empty array
      const existingAccessUpdates = dashboardData.access_updates || [];

      // Use save-dashboard with complete data including access update
      const { data, error } = await supabase.functions.invoke("save-dashboard", {
        method: "POST",
        body: {
          profile_data: {
            name: dashboardData.tutor_profile?.name || '',
            mail: dashboardData.tutor_profile?.mail || '',
            phone: dashboardData.tutor_profile?.phone || '',
            about_me: dashboardData.tutor_profile?.about_me || '',
            github: dashboardData.tutor_profile?.github || '',
            linkedin: dashboardData.tutor_profile?.linkedin || '',
            other_link: dashboardData.tutor_profile?.other_link || '',
            education: dashboardData.tutor_profile?.education || [],
            grades: dashboardData.tutor_profile?.grades || [],
            events: dashboardData.tutor_profile?.events || [],
            selections: dashboardData.tutor_profile?.selections || [],
            access_updates: [...existingAccessUpdates, accessUpdate]
          }
        }
      });

      if (error) {
        console.error('Error restoring access:', error);
        showNotification('שגיאה בהחזרת הגישה', 'error');
        return;
      }

      // Update local state
      const updatedAccessList = userAccessList.map(acc => 
        acc.user_uuid === access.user_uuid ? { ...acc, enabled: true } : acc
      );
      setUserAccessList(updatedAccessList);
      
      showNotification('הגישה הוחזרה בהצלחה', 'success');
    } catch (error) {
      console.error('Error restoring access:', error);
      showNotification('שגיאה בהחזרת הגישה', 'error');
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
            onClick={() => navigate('/create-course')}
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
                    <div className="flex gap-4 mb-4 md:mb-0">
                      {/* Thumbnail */}
                      <div className="flex-shrink-0">
                        {course.custom_thumbnail_url ? (
                          <img 
                            src={course.custom_thumbnail_url} 
                            alt={course.title}
                            className="w-24 h-16 md:w-32 md:h-20 object-cover rounded-lg border shadow-sm"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        {/* Fallback placeholder */}
                        <div 
                          className={`w-24 h-16 md:w-32 md:h-20 bg-gray-100 rounded-lg border shadow-sm flex items-center justify-center ${course.custom_thumbnail_url ? 'hidden' : 'flex'}`}
                          style={{ display: course.custom_thumbnail_url ? 'none' : 'flex' }}
                        >
                          <Zap size={20} className="text-gray-400" />
                        </div>
                      </div>
                      
                      {/* Course Info */}
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="font-bold text-lg">{course.title}</h3>
                          <span className={`mr-2 text-xs font-medium py-1 px-2 rounded-full ${course.shown ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {course.shown ? 'פעיל' : 'לא פעיל'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">קורס: {course.course_name}</p>
                        <div className="flex items-center mt-2">
                          <Users size={14} className="text-gray-400 mr-1" />
                          <p className="text-xs text-gray-500">
                            {course.purchasers?.filter(p => p.paid === true).length || 0} סטודנטים
                          </p>
                        </div>
                        {course.description && (
                          <p className="text-xs text-gray-500 mt-2 line-clamp-2">{course.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={() => navigate(`/course-editor/${course.video_id}`)}
                        className="bg-gray-100 text-gray-800 hover:bg-gray-200"
                        size="sm"
                      >
                        <Edit size={14} className="mr-1" />
                        ערוך
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
                          if (course.video_course_id) {
                            setSelectedCourseForAccess(course);
                            fetchUserAccessList(course.video_course_id);
                            setIsAccessModalOpen(true);
                          } else {
                            showNotification('מזהה הקורס לא זמין', 'error');
                          }
                        }}
                        className="bg-purple-100 text-purple-800 hover:bg-purple-200"
                        size="sm"
                      >
                        <Users size={14} className="mr-1" />
                        נהל גישה
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
                  onClick={() => {
                    setIsAccessModalOpen(false);
                    setSearchQuery('');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>

              {selectedCourseForAccess && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">קורס נבחר:</h4>
                  <p className="text-blue-800">{selectedCourseForAccess.title}</p>
                  <p className="text-sm text-blue-600">{selectedCourseForAccess.course_name}</p>
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">משתמשים עם גישה לקורס</h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="חפש לפי שם או אימייל..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                {(() => {
                  // Filter users based on search query
                  const filteredUsers = userAccessList.filter(access => {
                    const searchLower = searchQuery.toLowerCase();
                    const nameMatch = (access.user_name || '').toLowerCase().includes(searchLower);
                    const emailMatch = (access.user_email || '').toLowerCase().includes(searchLower);
                    return nameMatch || emailMatch;
                  });

                  return filteredUsers.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="py-3 px-4 text-right font-medium text-gray-700">שם משתמש</th>
                            <th className="py-3 px-4 text-right font-medium text-gray-700">אימייל</th>
                            <th className="py-3 px-4 text-right font-medium text-gray-700">תאריך רכישה</th>
                            <th className="py-3 px-4 text-right font-medium text-gray-700">סטטוס גישה</th>
                            <th className="py-3 px-4 text-right font-medium text-gray-700">פעולות</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredUsers.map((access, index) => {
                            const isActive = access.enabled;
                            
                            return (
                              <tr key={access.user_uuid || index} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">{access.user_name || 'לא ידוע'}</td>
                                <td className="py-3 px-4">{access.user_email}</td>
                                <td className="py-3 px-4">{new Date(access.granted_at).toLocaleDateString('he-IL')}</td>
                                <td className="py-3 px-4">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    isActive 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {isActive ? 'גישה פעילה' : 'גישה חסומה'}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex gap-2">
                                    {access.enabled ? (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedUserToRevoke(access);
                                          setIsRevokeModalOpen(true);
                                        }}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs"
                                        title="חסום גישה"
                                      >
                                        <Trash2 size={14} className="ml-1" />
                                        חסום גישה
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRestoreAccess(access)}
                                        className="text-green-500 hover:text-green-700 hover:bg-green-50 text-xs"
                                        title="החזר גישה"
                                      >
                                        <Users size={14} className="ml-1" />
                                        החזר גישה
                                      </Button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Users size={48} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">
                        {searchQuery ? 'לא נמצאו משתמשים התואמים לחיפוש' : 'אין משתמשים עם גישה לקורס זה'}
                      </p>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revoke Access Confirmation Modal */}
      {isRevokeModalOpen && selectedUserToRevoke && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">אישור חסימת גישה</h3>
            <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>משתמש:</strong> {selectedUserToRevoke.user_name || selectedUserToRevoke.user_email}
              </p>
              <p className="text-sm text-yellow-800">
                <strong>אימייל:</strong> {selectedUserToRevoke.user_email}
              </p>
              <p className="text-sm text-yellow-800">
                <strong>קורס:</strong> {selectedCourseForAccess?.title}
              </p>
            </div>
            <p className="mb-6 text-gray-700">
              האם אתה בטוח שברצונך לחסום את הגישה של המשתמש לקורס זה? 
              <br />
              <span className="text-sm text-gray-500">ניתן יהיה להחזיר את הגישה מאוחר יותר.</span>
            </p>
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  setIsRevokeModalOpen(false);
                  setSelectedUserToRevoke(null);
                }}
                className="bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                ביטול
              </Button>
              <Button
                onClick={() => handleRemoveUserAccess(selectedUserToRevoke.user_uuid)}
                className="bg-red-600 hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader size={16} className="mr-2 animate-spin" />
                    חוסם גישה...
                  </>
                ) : (
                  'חסום גישה'
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