import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Book, ChevronRight, BarChart2, Settings, Edit, Save, Loader, Tag, Trash2, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { supabase } from '../lib/supabase';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import { courseStyles } from '../config/courseStyles';
import { showNotification } from '../components/ui/notification';

const UserDashboard = () => {
  const { user, session, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTutor, setIsTutor] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    recentSales: [],
    totalSales: 0,
    monthlySales: []
  });
  
  // Course management states
  const [tutorCourses, setTutorCourses] = useState([]);
  
  // Coupon management states
  const [coupons, setCoupons] = useState([]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');
  const [newCouponExpiry, setNewCouponExpiry] = useState('');
  const [selectedCourseForCoupon, setSelectedCourseForCoupon] = useState('');
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  // Mock data for tutor analytics
  const mockAnalyticsData = {
    recentSales: [
      { id: 1, user: 'יוסי כהן', course: 'אלגוריתמים 1', amount: 120, date: '2023-06-01' },
      { id: 2, user: 'רונית לוי', course: 'מבוא למדעי המחשב', amount: 90, date: '2023-06-03' },
      { id: 3, user: 'דניאל אברהם', course: 'מבני נתונים', amount: 110, date: '2023-06-07' },
      { id: 4, user: 'שירה גולן', course: 'אלגוריתמים 1', amount: 120, date: '2023-06-10' },
    ],
    totalSales: 2580,
    monthlySales: [
      { month: 'ינואר', amount: 320 },
      { month: 'פברואר', amount: 280 },
      { month: 'מרץ', amount: 340 },
      { month: 'אפריל', amount: 390 },
      { month: 'מאי', amount: 410 },
      { month: 'יוני', amount: 440 },
      { month: 'יולי', amount: 400 },
    ]
  };

  // Mock data for purchased courses
  const mockPurchasedCourses = [
    { id: 1, title: 'אלגוריתמים 1', instructor: 'ד"ר משה כהן', purchaseDate: '2023-05-15', progress: 75 },
    { id: 2, title: 'מבוא למדעי המחשב', instructor: 'פרופ\' רונית לוי', purchaseDate: '2023-04-20', progress: 100 },
    { id: 3, title: 'מבני נתונים', instructor: 'ד"ר אבי ישראלי', purchaseDate: '2023-06-05', progress: 30 },
  ];

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // In a real app, fetch real data from Supabase
        // For now, using mock data and simulating API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock fetching profile data
        const mockProfile = {
          id: user?.id,
          email: user?.email,
          fullName: 'משתמש ישראלי',
          phone: '050-1234567',
          university: 'אוניברסיטת תל אביב',
          department: 'מדעי המחשב'
        };
        
        setUserProfile(mockProfile);
        setUpdatedProfile(mockProfile);
        setPurchasedCourses(mockPurchasedCourses);
        
        // Check if user is a tutor (mock check)
        setIsTutor(user?.email?.includes('tutor') || user?.email?.includes('danielziv'));
        
        if (isTutor) {
          setAnalyticsData(mockAnalyticsData);
          fetchTutorCourses();
          fetchCoupons();
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        showNotification('שגיאה בטעינת נתוני משתמש', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, loading, isAuthenticated, navigate, isTutor]);

  // Fetch tutor's courses
  const fetchTutorCourses = async () => {
    try {
      // In a real app, fetch from Supabase
      // For now, using mock data
      const mockTutorCourses = [
        {
          id: 1,
          title: 'אלגוריתמים מתקדמים',
          description: 'קורס מעמיק בנושאי אלגוריתמים מתקדמים, כולל אלגוריתמי גרפים, תכנות דינמי ועוד',
          price: 250,
          sale_price: 199,
          is_active: true,
          students_count: 42,
          created_at: '2023-02-15',
        },
        {
          id: 2,
          title: 'מבוא לבינה מלאכותית',
          description: 'למד את יסודות הבינה המלאכותית, כולל למידת מכונה, רשתות נוירונים ועיבוד שפה טבעית',
          price: 350,
          sale_price: null,
          is_active: true,
          students_count: 28,
          created_at: '2023-05-10',
        },
        {
          id: 3,
          title: 'פיתוח Full Stack',
          description: 'קורס מקיף המכסה פיתוח צד לקוח וצד שרת עם React, Node.js, ו-MongoDB',
          price: 300,
          sale_price: 249,
          is_active: false,
          students_count: 15,
          created_at: '2023-08-22',
        },
      ];
      
      setTutorCourses(mockTutorCourses);
    } catch (error) {
      console.error('Error fetching tutor courses:', error);
      showNotification('שגיאה בטעינת הקורסים', 'error');
    }
  };

  // Fetch coupons
  const fetchCoupons = async () => {
    try {
      // In a real app, fetch from Supabase
      // For now, using mock data
      const mockCoupons = [
        {
          id: 1,
          code: 'SUMMER2023',
          discount: 20,
          expiry_date: '2023-09-30',
          course_id: 1,
          course_title: 'אלגוריתמים מתקדמים',
        },
        {
          id: 2,
          code: 'WELCOME15',
          discount: 15,
          expiry_date: '2023-12-31',
          course_id: 2,
          course_title: 'מבוא לבינה מלאכותית',
        },
      ];
      
      setCoupons(mockCoupons);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      showNotification('שגיאה בטעינת הקופונים', 'error');
    }
  };

  // Handle creating a new coupon
  const handleCreateCoupon = async () => {
    try {
      setIsLoading(true);
      
      // Validate inputs
      if (!newCouponCode || !newCouponDiscount || !newCouponExpiry || !selectedCourseForCoupon) {
        showNotification('אנא מלא את כל השדות הנדרשים', 'warning');
        return;
      }
      
      // In a real app, create the coupon in Supabase
      // For now, just simulate API delay and add to local state
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find the course title
      const course = tutorCourses.find(c => c.id.toString() === selectedCourseForCoupon);
      
      const newCoupon = {
        id: coupons.length + 1,
        code: newCouponCode,
        discount: parseInt(newCouponDiscount),
        expiry_date: newCouponExpiry,
        course_id: parseInt(selectedCourseForCoupon),
        course_title: course ? course.title : 'Unknown Course',
      };
      
      setCoupons([...coupons, newCoupon]);
      
      // Reset form
      setNewCouponCode('');
      setNewCouponDiscount('');
      setNewCouponExpiry('');
      setSelectedCourseForCoupon('');
      setIsCouponModalOpen(false);
      
      showNotification('הקופון נוצר בהצלחה', 'success');
    } catch (error) {
      console.error('Error creating coupon:', error);
      showNotification('שגיאה ביצירת הקופון', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting a coupon
  const handleDeleteCoupon = async (couponId) => {
    try {
      setIsLoading(true);
      
      // In a real app, delete from Supabase
      // For now, just simulate API delay and update local state
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setCoupons(coupons.filter(coupon => coupon.id !== couponId));
      
      showNotification('הקופון נמחק בהצלחה', 'success');
    } catch (error) {
      console.error('Error deleting coupon:', error);
      showNotification('שגיאה במחיקת הקופון', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Course management functions
  const handleEditCourse = (courseId) => {
    setTutorCourses(prevCourses => 
      prevCourses.map(course => 
        course.id === courseId 
          ? { ...course, isEditing: true } 
          : course
      )
    );
  };

  const handleCourseEditChange = (courseId, field, value) => {
    setTutorCourses(prevCourses => 
      prevCourses.map(course => 
        course.id === courseId 
          ? { ...course, [field]: value } 
          : course
      )
    );
  };

  const handleCancelCourseEdit = (courseId) => {
    setTutorCourses(prevCourses => 
      prevCourses.map(course => 
        course.id === courseId 
          ? { 
              ...course, 
              isEditing: false,
              editTitle: undefined,
              editPrice: undefined,
              editSalePrice: undefined,
              editDescription: undefined
            } 
          : course
      )
    );
  };

  const handleSaveCourseEdit = async (courseId) => {
    try {
      setIsLoading(true);
      
      // Find the course to edit
      const courseToEdit = tutorCourses.find(course => course.id === courseId);
      
      if (!courseToEdit) {
        showNotification('הקורס לא נמצא', 'error');
        return;
      }
      
      // In a real app, update in Supabase
      // For now, just simulate API delay and update local state
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setTutorCourses(prevCourses => 
        prevCourses.map(course => 
          course.id === courseId 
            ? { 
                ...course, 
                title: course.editTitle || course.title,
                price: parseInt(course.editPrice) || course.price,
                sale_price: course.editSalePrice ? parseInt(course.editSalePrice) : null,
                description: course.editDescription || course.description,
                isEditing: false,
                editTitle: undefined,
                editPrice: undefined,
                editSalePrice: undefined,
                editDescription: undefined
              } 
            : course
        )
      );
      
      showNotification('הקורס עודכן בהצלחה', 'success');
    } catch (error) {
      console.error('Error updating course:', error);
      showNotification('שגיאה בעדכון הקורס', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleCourseVisibility = async (courseId, newVisibility) => {
    try {
      setIsLoading(true);
      
      // In a real app, update in Supabase
      // For now, just simulate API delay and update local state
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setTutorCourses(prevCourses => 
        prevCourses.map(course => 
          course.id === courseId 
            ? { ...course, is_active: newVisibility } 
            : course
        )
      );
      
      showNotification(
        newVisibility 
          ? 'הקורס הופעל בהצלחה ויוצג בפלטפורמה' 
          : 'הקורס הוסתר בהצלחה ולא יוצג יותר בפלטפורמה',
        'success'
      );
    } catch (error) {
      console.error('Error toggling course visibility:', error);
      showNotification('שגיאה בעדכון סטטוס הקורס', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    // In a real app, first show a confirmation dialog
    const confirmDelete = window.confirm('האם אתה בטוח שברצונך למחוק את הקורס? פעולה זו אינה ניתנת לביטול.');
    
    if (!confirmDelete) return;
    
    try {
      setIsLoading(true);
      
      // In a real app, delete from Supabase
      // For now, just simulate API delay and update local state
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setTutorCourses(prevCourses => 
        prevCourses.filter(course => course.id !== courseId)
      );
      
      showNotification('הקורס נמחק בהצלחה', 'success');
    } catch (error) {
      console.error('Error deleting course:', error);
      showNotification('שגיאה במחיקת הקורס', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      // In a real app, update profile in Supabase
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setUserProfile(updatedProfile);
      setIsEditing(false);
      showNotification('הפרופיל עודכן בהצלחה', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('שגיאה בעדכון פרופיל', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <Loader className="w-12 h-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <Navbar />
      <div className="container mx-auto px-4 pt-20">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h2 className="font-bold text-xl mb-4 text-center">{userProfile?.fullName}</h2>
                  <Button 
                    className={`w-full flex items-center justify-start gap-2 ${activeTab === 'profile' ? 'bg-blue-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    <User size={18} />
                    <span>פרופיל</span>
                  </Button>
                  <Button 
                    className={`w-full flex items-center justify-start gap-2 ${activeTab === 'courses' ? 'bg-blue-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    onClick={() => setActiveTab('courses')}
                  >
                    <Book size={18} />
                    <span>הקורסים שלי</span>
                  </Button>
                  {isTutor && (
                    <>
                      <Button 
                        className={`w-full flex items-center justify-start gap-2 ${activeTab === 'analytics' ? 'bg-blue-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                        onClick={() => setActiveTab('analytics')}
                      >
                        <BarChart2 size={18} />
                        <span>אנליטיקה</span>
                      </Button>
                      <Button 
                        className={`w-full flex items-center justify-start gap-2 ${activeTab === 'tutorCourses' ? 'bg-blue-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                        onClick={() => setActiveTab('tutorCourses')}
                      >
                        <Settings size={18} />
                        <span>ניהול קורסים</span>
                      </Button>
                      <Button 
                        className={`w-full flex items-center justify-start gap-2 ${activeTab === 'coupons' ? 'bg-blue-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                        onClick={() => setActiveTab('coupons')}
                      >
                        <Tag size={18} />
                        <span>קופונים</span>
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>פרופיל משתמש</CardTitle>
                    <CardDescription>צפייה ועריכת פרטים אישיים</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={isLoading}
                  >
                    {isEditing ? <Save size={18} /> : <Edit size={18} />}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">שם מלא</label>
                        {isEditing ? (
                          <input
                            name="fullName"
                            value={updatedProfile.fullName || ''}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                          />
                        ) : (
                          <p className="p-2 bg-gray-50 rounded">{userProfile?.fullName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">דוא"ל</label>
                        <p className="p-2 bg-gray-50 rounded">{userProfile?.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">טלפון</label>
                        {isEditing ? (
                          <input
                            name="phone"
                            value={updatedProfile.phone || ''}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                          />
                        ) : (
                          <p className="p-2 bg-gray-50 rounded">{userProfile?.phone}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">מוסד לימודים</label>
                        {isEditing ? (
                          <input
                            name="university"
                            value={updatedProfile.university || ''}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                          />
                        ) : (
                          <p className="p-2 bg-gray-50 rounded">{userProfile?.university}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">מחלקה/פקולטה</label>
                        {isEditing ? (
                          <input
                            name="department"
                            value={updatedProfile.department || ''}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                          />
                        ) : (
                          <p className="p-2 bg-gray-50 rounded">{userProfile?.department}</p>
                        )}
                      </div>
                    </div>
                    
                    {isEditing && (
                      <div className="flex justify-end mt-4">
                        <Button
                          onClick={handleProfileUpdate}
                          disabled={isLoading}
                          className="bg-blue-600"
                        >
                          {isLoading ? (
                            <>
                              <Loader size={16} className="mr-2 animate-spin" />
                              מעדכן...
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
            )}

            {activeTab === 'courses' && (
              <Card>
                <CardHeader>
                  <CardTitle>הקורסים שלי</CardTitle>
                  <CardDescription>רשימת הקורסים שרכשת</CardDescription>
                </CardHeader>
                <CardContent>
                  {purchasedCourses.length > 0 ? (
                    <div className="space-y-4">
                      {purchasedCourses.map(course => (
                        <div key={course.id} className="bg-white p-4 rounded-lg shadow border">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-bold text-lg">{course.title}</h3>
                              <p className="text-sm text-gray-600">{course.instructor}</p>
                              <p className="text-xs text-gray-500 mt-1">נרכש בתאריך: {course.purchaseDate}</p>
                            </div>
                            <div className="flex items-center">
                              <div className="mr-4">
                                <span className="text-sm font-medium">התקדמות: {course.progress}%</span>
                                <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
                                  <div 
                                    className="h-full bg-blue-600 rounded-full" 
                                    style={{ width: `${course.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                              <Button
                                onClick={() => navigate(`/course/${course.id}`)}
                                className="flex items-center bg-blue-600"
                              >
                                <span>צפייה בקורס</span>
                                <ChevronRight size={16} className="ml-1" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">לא נמצאו קורסים שרכשת</p>
                      <Button
                        onClick={() => navigate('/courses')}
                        className="bg-blue-600"
                      >
                        עבור לחנות הקורסים
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'analytics' && isTutor && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>סיכום מכירות</CardTitle>
                    <CardDescription>נתוני מכירות עדכניים עבור הקורסים שלך</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg border">
                        <h3 className="text-lg font-medium text-gray-500">סה"כ מכירות</h3>
                        <p className="text-3xl font-bold">₪{analyticsData.totalSales}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <h3 className="text-lg font-medium text-gray-500">מכירות החודש</h3>
                        <p className="text-3xl font-bold">₪{analyticsData.monthlySales[analyticsData.monthlySales.length - 1]?.amount || 0}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <h3 className="text-lg font-medium text-gray-500">סטודנטים</h3>
                        <p className="text-3xl font-bold">{analyticsData.recentSales.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>מכירות אחרונות</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="py-2 px-4 text-right font-medium">תאריך</th>
                            <th className="py-2 px-4 text-right font-medium">סטודנט</th>
                            <th className="py-2 px-4 text-right font-medium">קורס</th>
                            <th className="py-2 px-4 text-right font-medium">סכום</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analyticsData.recentSales.map(sale => (
                            <tr key={sale.id} className="border-b">
                              <td className="py-2 px-4">{sale.date}</td>
                              <td className="py-2 px-4">{sale.user}</td>
                              <td className="py-2 px-4">{sale.course}</td>
                              <td className="py-2 px-4">₪{sale.amount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>מכירות חודשיות</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60">
                      <div className="flex h-full items-end">
                        {analyticsData.monthlySales.map((monthData, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div 
                              className="w-full max-w-[40px] bg-blue-600 rounded-t"
                              style={{ 
                                height: `${(monthData.amount / Math.max(...analyticsData.monthlySales.map(m => m.amount))) * 180}px` 
                              }}
                            ></div>
                            <span className="text-xs mt-2">{monthData.month}</span>
                            <span className="text-xs font-medium">₪{monthData.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'coupons' && isTutor && (
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
                      {coupons.length > 0 ? (
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
                              {coupons.map(coupon => (
                                <tr key={coupon.id} className="border-b">
                                  <td className="py-2 px-4">{coupon.code}</td>
                                  <td className="py-2 px-4">{coupon.discount}%</td>
                                  <td className="py-2 px-4">{new Date(coupon.expiry_date).toLocaleDateString('he-IL')}</td>
                                  <td className="py-2 px-4">{coupon.course_title}</td>
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
            )}

            {activeTab === 'tutorCourses' && isTutor && (
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
                        {tutorCourses.map(course => (
                          <div key={course.id} className="bg-white p-4 rounded-lg shadow border">
                            <div className="flex flex-col md:flex-row justify-between">
                              <div className="mb-4 md:mb-0">
                                <h3 className="font-bold text-lg">{course.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">מחיר: ₪{course.price}</p>
                                {course.sale_price && (
                                  <p className="text-sm text-green-600">מחיר מבצע: ₪{course.sale_price}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{course.description}</p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Button
                                  onClick={() => handleEditCourse(course.id)}
                                  className="bg-gray-100 text-gray-800 hover:bg-gray-200"
                                  size="sm"
                                >
                                  <Edit size={14} className="mr-1" />
                                  ערוך
                                </Button>
                                <Button
                                  onClick={() => handleToggleCourseVisibility(course.id, !course.is_active)}
                                  className={`${course.is_active ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}
                                  size="sm"
                                >
                                  {course.is_active ? 'הסתר' : 'הצג'}
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
                            
                            {course.isEditing && (
                              <div className="mt-4 pt-4 border-t">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <label className="block text-sm font-medium mb-1">כותרת</label>
                                    <input
                                      type="text"
                                      value={course.editTitle || course.title}
                                      onChange={(e) => handleCourseEditChange(course.id, 'editTitle', e.target.value)}
                                      className="w-full p-2 border rounded"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-1">מחיר (₪)</label>
                                    <input
                                      type="number"
                                      value={course.editPrice || course.price}
                                      onChange={(e) => handleCourseEditChange(course.id, 'editPrice', e.target.value)}
                                      className="w-full p-2 border rounded"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-1">מחיר מבצע (₪) - אופציונלי</label>
                                    <input
                                      type="number"
                                      value={course.editSalePrice || course.sale_price || ''}
                                      onChange={(e) => handleCourseEditChange(course.id, 'editSalePrice', e.target.value)}
                                      className="w-full p-2 border rounded"
                                    />
                                  </div>
                                </div>
                                
                                <div className="mb-4">
                                  <label className="block text-sm font-medium mb-1">תיאור</label>
                                  <textarea
                                    value={course.editDescription || course.description}
                                    onChange={(e) => handleCourseEditChange(course.id, 'editDescription', e.target.value)}
                                    className="w-full p-2 border rounded"
                                    rows={3}
                                  />
                                </div>
                                
                                <div className="flex justify-end gap-2">
                                  <Button
                                    onClick={() => handleCancelCourseEdit(course.id)}
                                    className="bg-gray-200 text-gray-800"
                                    size="sm"
                                  >
                                    ביטול
                                  </Button>
                                  <Button
                                    onClick={() => handleSaveCourseEdit(course.id)}
                                    className="bg-blue-600"
                                    size="sm"
                                  >
                                    שמור שינויים
                                  </Button>
                                </div>
                              </div>
                            )}
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
