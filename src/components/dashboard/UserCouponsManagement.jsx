import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, Trash2, Loader, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { showNotification } from '../ui/notification';
import LoaderComponent from '../Loader';

const UserCouponsManagement = ({
  tutorCourses,
  dashboardData
}) => {
  // Local state for coupon management
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');
  const [newCouponExpiry, setNewCouponExpiry] = useState('');
  const [selectedCoursesForCoupon, setSelectedCoursesForCoupon] = useState([]);
  const [newMaxUsesPerPerson, setNewMaxUsesPerPerson] = useState('1');
  const [newCouponCount, setNewCouponCount] = useState('');
  const [newIsEnabled, setNewIsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateCoupon = async () => {
    if (!newCouponCode || !newCouponDiscount || !newCouponExpiry || !selectedCoursesForCoupon || !newMaxUsesPerPerson || !newCouponCount) {
      showNotification('אנא מלא את כל השדות הנדרשים', 'warning');
      return;
    }

    try {
      setIsLoading(true);
      
      // Create new coupon object
      const newCoupon = {
        code: newCouponCode,
        discount_percent: parseInt(newCouponDiscount),
        expires_at: newCouponExpiry,
        video_course_ids: selectedCoursesForCoupon.map(id => parseInt(id)),
        max_uses_per_person: parseInt(newMaxUsesPerPerson),
        coupon_count: parseInt(newCouponCount),
        is_enabled: newIsEnabled ? 1 : 0,
        usage_count: 0
      };

      // Add the new coupon to existing coupons
      const updatedCoupons = [...(dashboardData.coupons || []), newCoupon];

      // Convert all is_enabled values to 0/1 before sending to API
      const couponsForApi = updatedCoupons.map(coupon => ({
        ...coupon,
        is_enabled: coupon.is_enabled ? 1 : 0
      }));

      // Call save-dashboard with all data including the new coupon
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
            coupons: couponsForApi
          }
        }
      });

      if (error) {
        console.error('Error creating coupon:', error);
        showNotification('שגיאה ביצירת הקופון', 'error');
        return;
      }

      // Check for partial failures
      if (data.results.some(result => result.status === "error")) {
        console.warn("Some operations failed:", data.results);
        showNotification('חלק מהעדכונים נכשלו', 'warning');
        return;
      }

      // Reset form
      setNewCouponCode('');
      setNewCouponDiscount('');
      setNewCouponExpiry('');
      setSelectedCoursesForCoupon([]);
      setNewMaxUsesPerPerson('1');
      setNewCouponCount('');
      setNewIsEnabled(true);
      setIsCouponModalOpen(false);
      
      showNotification('הקופון נוצר בהצלחה', 'success');
      
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error creating coupon:', error);
      showNotification('שגיאה ביצירת הקופון', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    try {
      setIsLoading(true);
      
      // Remove the coupon from existing coupons
      const updatedCoupons = (dashboardData.coupons || []).filter(coupon => coupon.code !== couponId);

      // Convert all is_enabled values to 0/1 before sending to API
      const couponsForApi = updatedCoupons.map(coupon => ({
        ...coupon,
        is_enabled: coupon.is_enabled ? 1 : 0
      }));

      // Call save-dashboard with all data excluding the deleted coupon
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
            coupons: couponsForApi
          }
        }
      });

      if (error) {
        console.error('Error deleting coupon:', error);
        showNotification('שגיאה במחיקת הקופון', 'error');
        return;
      }

      // Check for partial failures
      if (data.results.some(result => result.status === "error")) {
        console.warn("Some operations failed:", data.results);
        showNotification('חלק מהעדכונים נכשלו', 'warning');
        return;
      }
      
      showNotification('הקופון נמחק בהצלחה', 'success');
      
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      showNotification('שגיאה במחיקת הקופון', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleCoupon = async (couponIndex) => {
    try {
      setIsLoading(true);
      
      // Toggle the coupon's enabled status
      const updatedCoupons = [...(dashboardData.coupons || [])];
      updatedCoupons[couponIndex] = {
        ...updatedCoupons[couponIndex],
        is_enabled: !updatedCoupons[couponIndex].is_enabled
      };

      // Convert all is_enabled values to 0/1 before sending to API
      const couponsForApi = updatedCoupons.map(coupon => ({
        ...coupon,
        is_enabled: coupon.is_enabled ? 1 : 0
      }));

      // Call save-dashboard with all data including the updated coupon
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
            coupons: couponsForApi
          }
        }
      });

      if (error) {
        console.error('Error toggling coupon:', error);
        showNotification('שגיאה בעדכון הקופון', 'error');
        return;
      }

      // Check for partial failures
      if (data.results.some(result => result.status === "error")) {
        console.warn("Some operations failed:", data.results);
        showNotification('חלק מהעדכונים נכשלו', 'warning');
        return;
      }
      
      showNotification('הקופון עודכן בהצלחה', 'success');
      
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error toggling coupon:', error);
      showNotification('שגיאה בעדכון הקופון', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ניהול קופונים</CardTitle>
          <CardDescription>צור וערוך קופונים עבור הקורסים שלך</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Button 
              onClick={() => setIsCouponModalOpen(true)}
              className="bg-blue-600 mb-4"
            >
              <Plus size={16} className="mr-2" />
              צור קופון חדש
            </Button>
            
            {/* Coupon creation form */}
            {isCouponModalOpen && (
              <div className="bg-white p-4 rounded-lg border shadow-md mb-6">
                <h3 className="font-bold text-lg mb-4">יצירת קופון חדש</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">קוד קופון</label>
                    <input
                      type="text"
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="לדוגמה: SUMMER20"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">הנחה (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={newCouponDiscount}
                      onChange={(e) => setNewCouponDiscount(e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="לדוגמה: 20"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">תאריך תפוגה</label>
                    <input
                      type="date"
                      value={newCouponExpiry}
                      onChange={(e) => setNewCouponExpiry(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">קורסים</label>
                    <select
                      multiple
                      value={selectedCoursesForCoupon}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, option => option.value);
                        setSelectedCoursesForCoupon(values);
                      }}
                      className="w-full p-2 border rounded"
                      size="5"
                    >
                      {tutorCourses.map(course => (
                        <option key={course.video_course_id} value={course.video_course_id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">בחר קורסים (החזק Ctrl/Cmd לחיפוש מרובה)</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">מספר שימושים מקסימלי לאדם</label>
                    <input
                      type="number"
                      min="1"
                      value={newMaxUsesPerPerson}
                      onChange={(e) => setNewMaxUsesPerPerson(e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="לדוגמה: 1"
                    />
                    <p className="text-xs text-gray-500 mt-1">כמה פעמים אדם יכול להשתמש בקופון</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">מספר קופונים כולל (הגבלה)</label>
                    <input
                      type="number"
                      min="1"
                      value={newCouponCount}
                      onChange={(e) => setNewCouponCount(e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="לדוגמה: 100"
                    />
                    <p className="text-xs text-gray-500 mt-1">כמה קופונים בסך הכל ניתן להשתמש</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="couponEnabled"
                      checked={newIsEnabled}
                      onChange={(e) => setNewIsEnabled(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="couponEnabled" className="text-sm font-medium">הקופון פעיל</label>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      onClick={() => setIsCouponModalOpen(false)}
                      className="bg-gray-200 text-gray-800"
                    >
                      ביטול
                    </Button>
                    <Button 
                      onClick={handleCreateCoupon}
                      className="bg-blue-600"
                      disabled={!newCouponCode || !newCouponDiscount || !newCouponExpiry || !selectedCoursesForCoupon || !newMaxUsesPerPerson || !newCouponCount || isLoading}
                    >
                      {isLoading ? (
                        <>
                          <LoaderComponent />
                          יוצר קופון...
                        </>
                      ) : (
                        'צור קופון'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Coupons list */}
            {dashboardData.coupons && dashboardData.coupons.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-right font-medium">קוד קופון</th>
                      <th className="py-2 px-4 text-right font-medium">הנחה</th>
                      <th className="py-2 px-4 text-right font-medium">תאריך תפוגה</th>
                      <th className="py-2 px-4 text-right font-medium">קורסים</th>
                      <th className="py-2 px-4 text-right font-medium">מקס שימושים</th>
                      <th className="py-2 px-4 text-right font-medium">שימושים</th>
                      <th className="py-2 px-4 text-right font-medium">סה״כ קופונים</th>
                      <th className="py-2 px-4 text-right font-medium">סטטוס</th>
                      <th className="py-2 px-4 text-right font-medium">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.coupons.map((coupon, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{coupon.code}</td>
                        <td className="py-2 px-4">{coupon.discount_percent}%</td>
                        <td className="py-2 px-4">{coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString('he-IL') : 'ללא תפוגה'}</td>
                        <td className="py-2 px-4">
                          {coupon.video_course_ids && coupon.video_course_ids.length > 0 
                            ? coupon.video_course_ids.map(id => 
                                tutorCourses.find(course => course.video_course_id === id)?.title
                              ).filter(Boolean).join(', ')
                            : 'כל הקורסים'
                          }
                        </td>
                        <td className="py-2 px-4">{coupon.max_uses_per_person || 'ללא הגבלה'}</td>
                        <td className="py-2 px-4">{coupon.usage_count || 0}</td>
                        <td className="py-2 px-4">{coupon.coupon_count || 'ללא הגבלה'}</td>
                        <td className="py-2 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${coupon.is_enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {coupon.is_enabled ? 'פעיל' : 'לא פעיל'}
                          </span>
                        </td>
                        <td className="py-2 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleCoupon(index)}
                              className={`${coupon.is_enabled ? 'text-orange-500 hover:text-orange-700' : 'text-green-500 hover:text-green-700'}`}
                            >
                              {coupon.is_enabled ? <EyeOff size={16} /> : <Eye size={16} />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCoupon(coupon.code)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">לא נמצאו קופונים</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserCouponsManagement; 