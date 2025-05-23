import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';  // Assuming these icons are used

const UserCouponsManagement = ({
  isCouponModalOpen,
  setIsCouponModalOpen,
  newCouponCode,
  setNewCouponCode,
  newCouponDiscount,
  setNewCouponDiscount,
  newCouponExpiry,
  setNewCouponExpiry,
  selectedCourseForCoupon,
  setSelectedCourseForCoupon,
  tutorCourses,
  dashboardData
}) => {
  const handleCreateCoupon = async () => {
    // Implementation based on original logic; assume it uses props for state
    if (!newCouponCode || !newCouponDiscount || !newCouponExpiry || !selectedCourseForCoupon) return;  // Basic validation
    try {
      // Simulate API call or actual logic; in practice, this would update state or call an API
      console.log('Creating coupon with code:', newCouponCode);
      // After creation, you might want to update dashboardData or close the modal
      setIsCouponModalOpen(false);  // Close modal after success
      setNewCouponCode('');  // Reset state
      setNewCouponDiscount('');
      setNewCouponExpiry('');
      setSelectedCourseForCoupon('');
      // Assume this triggers a parent update if needed, e.g., via context or callback
    } catch (error) {
      console.error('Error creating coupon:', error);
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    // Implementation based on original logic
    try {
      // Simulate API call or actual logic; in practice, this would delete and update state
      console.log('Deleting coupon with ID:', couponId);
      // After deletion, update dashboardData if possible
    } catch (error) {
      console.error('Error deleting coupon:', error);
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
                    <label className="block text-sm font-medium mb-1">קורס</label>
                    <select
                      value={selectedCourseForCoupon}
                      onChange={(e) => setSelectedCourseForCoupon(e.target.value)}
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
                      disabled={!newCouponCode || !newCouponDiscount || !newCouponExpiry || !selectedCourseForCoupon}
                    >
                      צור קופון
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
                      <th className="py-2 px-4 text-right font-medium">קורס</th>
                      <th className="py-2 px-4 text-right font-medium">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.coupons.map((coupon, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{coupon.code}</td>
                        <td className="py-2 px-4">{coupon.discount}%</td>
                        <td className="py-2 px-4">{new Date(coupon.expiry_date).toLocaleDateString('he-IL')}</td>
                        <td className="py-2 px-4">{coupon.course_title || 'כל הקורסים'}</td>
                        <td className="py-2 px-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCoupon(coupon.id)}
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