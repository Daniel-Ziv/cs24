import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Book, ChevronRight, BarChart2, Settings, Edit, Save, Loader, Tag, Trash2, Plus, Zap, DollarSign, Users, Calendar, Database, Eye, EyeOff } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { supabase } from '../lib/supabase';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import { courseStyles } from '../config/courseStyles';
import { showNotification } from '../components/ui/notification';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';

const UserDashboard = () => {
  const { user, session, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('main');
  const [dashboardData, setDashboardData] = useState({
    my_courses: [],
    tutor_profile: null,
    is_tutor: false,
    tutor_id: null,
    coupons: [],
    recent_activity: [],
    recently_watched: [],
    total_spent: 0,
    total_revenue: 0,
    total_students: 0,
    total_watch_time: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isTutor, setIsTutor] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    recentSales: [],
    totalSales: 0,
    monthlySales: [],
    totalStudents: 0,
    courseAnalytics: [] // Will contain per-course analytics
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

  // Access management states
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [accessEmail, setAccessEmail] = useState('');
  const [selectedCourseForAccess, setSelectedCourseForAccess] = useState('');
  const [accessExpiry, setAccessExpiry] = useState('');
  const [userAccessList, setUserAccessList] = useState([]);
  const [selectedUserToRevoke, setSelectedUserToRevoke] = useState(null);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  
  // Course editing states
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [currentEditingCourse, setCurrentEditingCourse] = useState(null);
  
  // Tutor profile states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
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
    selections: []
  });
  
  // New education entry
  const [newEducation, setNewEducation] = useState({
    institution: '',
    degree: '',
    field: '',
    year: ''
  });
  
  // New grade entry
  const [newGrade, setNewGrade] = useState({
    course: '',
    grade: ''
  });

  // Course analytics state
  const [courseAnalytics, setCourseAnalytics] = useState({
    totalSales: 0,
    totalRevenue: 0,
    conversionRate: 0,
    totalStudents: 0
  });

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

  // Additional access management states
  const [showAccessManagement, setShowAccessManagement] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserExpiry, setNewUserExpiry] = useState('');
  const [showCouponForm, setShowCouponForm] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("get-dashboard");
        
        if (error) {
          console.error('Error fetching dashboard data:', error);
          showNotification('שגיאה בטעינת נתוני לוח בקרה', 'error');
          return;
        }
        
        console.log('Dashboard data:', data);
        
        // Set dashboard data
        setDashboardData(data);
        
        // Set tutor state
        setIsTutor(data.is_tutor);
        
        // Initialize tutor profile data if available
        if (data.tutor_profile) {
          setTutorProfileData({
            name: data.tutor_profile.name || '',
            mail: data.tutor_profile.mail || '',
            phone: data.tutor_profile.phone || '',
            about_me: data.tutor_profile.about_me || '',
            github: data.tutor_profile.github || '',
            linkedin: data.tutor_profile.linkedin || '',
            other_link: data.tutor_profile.other_link || '',
            education: data.tutor_profile.education || [],
            grades: data.tutor_profile.grades || [],
            selections: data.tutor_profile.selections || []
          });
        }
        
        // Process data for features if user is a tutor
        if (data.is_tutor && data.my_courses) {
          processCourseData(data.my_courses);
          setCoupons(data.coupons || []);
        }
      } catch (error) {
        console.error('Error in dashboard data fetching:', error);
        showNotification('שגיאה בטעינת נתוני לוח בקרה', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, loading, isAuthenticated, navigate]);

  // Process course data for analytics and management
  const processCourseData = (courses) => {
    if (!courses || courses.length === 0) return;
    
    console.log("Processing course data:", courses);
    
    // Set tutor courses for management
    setTutorCourses(courses.map(course => ({
      id: course.course_id,
      title: course.title,
      description: course.description || '',
      video_id: course.video_id,
      video_course_id: course.video_course_id,
      thumbnail: course.thumbnail,
      custom_thumbnail_url: course.custom_thumbnail_url,
      is_active: course.shown,
      video_uid: course.video_uid,
      course_name: course.course_name
    })));
    
    // Analyze sales data per course
    const allSales = [];
    const courseStats = [];
    
    courses.forEach(course => {
      if (!course.purchasers || course.purchasers.length === 0) {
        courseStats.push({
          courseId: course.course_id,
          courseTitle: course.title,
          totalSales: 0,
          totalRevenue: 0,
          paidOrders: 0,
          pendingOrders: 0,
          conversionRate: 0,
          uniqueCustomers: [],
          recentSales: []
        });
        return;
      }
      
      // Get all paid orders
      const paidOrders = course.purchasers.filter(order => order.paid);
      
      // Calculate total revenue from this course
      const totalRevenue = paidOrders.reduce((total, order) => total + order.amount, 0);
      
      // Get unique customers
      const uniqueCustomers = [...new Set(
        course.purchasers
          .filter(order => order.customer_email)
          .map(order => order.customer_email)
      )];
      
      // Format recent sales for this course
      const recentSales = paidOrders
        .sort((a, b) => new Date(b.purchase_date) - new Date(a.purchase_date))
        .slice(0, 5)
        .map(order => ({
          customerId: order.user_uuid,
          customerName: order.customer_full_name || 'משתמש לא מזוהה',
          customerEmail: order.customer_email || 'אין מידע',
          amount: order.amount,
          discount: order.discount_percent,
          coupon: order.coupon_used,
          date: new Date(order.purchase_date).toLocaleDateString('he-IL'),
          originalDate: order.purchase_date
        }));
      
      // Add all sales to global sales array
      paidOrders.forEach(order => {
        allSales.push({
          courseId: course.course_id,
          courseTitle: course.title,
          customerId: order.user_uuid,
          customerName: order.customer_full_name || 'משתמש לא מזוהה',
          customerEmail: order.customer_email || 'אין מידע',
          amount: order.amount,
          discount: order.discount_percent,
          coupon: order.coupon_used,
          date: new Date(order.purchase_date).toLocaleDateString('he-IL'),
          originalDate: order.purchase_date
        });
      });
      
      // Calculate conversion rate
      const conversionRate = course.purchasers.length > 0 
        ? (paidOrders.length / course.purchasers.length) * 100 
        : 0;
      
      // Add to course stats
      courseStats.push({
        courseId: course.course_id,
        courseTitle: course.title,
        totalSales: paidOrders.length,
        totalRevenue,
        paidOrders: paidOrders.length,
        pendingOrders: course.purchasers.length - paidOrders.length,
        conversionRate,
        uniqueCustomers: uniqueCustomers.length,
        recentSales
      });
    });
    
    // Sort all sales by date for overall recent sales
    allSales.sort((a, b) => new Date(b.originalDate) - new Date(a.originalDate));
    
    // Calculate total metrics across all courses
    const totalSales = courseStats.reduce((total, course) => total + course.totalSales, 0);
    const totalRevenue = courseStats.reduce((total, course) => total + course.totalRevenue, 0);
    
    // Get unique students across all courses
    const allCustomers = new Set();
    courseStats.forEach(course => {
      course.purchasers?.forEach(purchaser => {
        if (purchaser.customer_email) {
          allCustomers.add(purchaser.customer_email);
        }
      });
    });
    
    // Process monthly sales data
    const monthlySales = processMonthlyOrders(allSales);
    
    // Set analytics data
    setAnalyticsData({
      recentSales: allSales.slice(0, 10),
      totalSales,
      totalRevenue,
      monthlySales,
      totalStudents: allCustomers.size,
      courseAnalytics: courseStats
    });
  };

  // Process orders by month
  const processMonthlyOrders = (sales) => {
    const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
    const monthlyData = {};
    
    // Initialize all months with zero
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    
    for (let i = 0; i < 12; i++) {
      const monthIndex = (currentMonth - i + 12) % 12; // Go back i months
      monthlyData[months[monthIndex]] = 0;
    }
    
    // Fill in the data
    sales.forEach(sale => {
      const saleDate = new Date(sale.originalDate);
      const monthName = months[saleDate.getMonth()];
      
      // Only include sales from the last 12 months
      const isWithinLastYear = (currentDate.getTime() - saleDate.getTime()) < 365 * 24 * 60 * 60 * 1000;
      
      if (isWithinLastYear && monthlyData.hasOwnProperty(monthName)) {
        monthlyData[monthName] += sale.amount;
      }
    });
    
    // Convert to array format
    return Object.entries(monthlyData)
      .map(([month, amount]) => ({ month, amount }))
      .reverse(); // Most recent month first
  };

  // Fetch tutor's courses
  const fetchTutorCourses = async () => {
    try {
      // Extract course info from orders
      if (dashboardData.orders && dashboardData.orders.length > 0) {
        console.log("Processing orders for tutor courses:", dashboardData.orders);
        
        const courseMap = new Map();
        
        dashboardData.orders.forEach(order => {
          console.log("Processing order:", order);
          const courseId = order.course_id || (order.video_id ? parseInt(order.video_id) : null);
          
          if (!courseMap.has(order.course_name) && courseId) {
            const courseData = {
              id: courseId,
              title: order.course_name,
              description: '',
              price: order.amount > 0 ? order.amount : 199,
              sale_price: null,
              is_active: true,
              students_count: 0,
              created_at: order.purchase_date || new Date().toISOString(),
              video_id: order.video_id
            };
            console.log("Adding course to map:", courseData);
            courseMap.set(order.course_name, courseData);
          }
          
          // Count students for this course
          if (courseMap.has(order.course_name)) {
            const course = courseMap.get(order.course_name);
            if (order.paid && order.customer_email) {
              course.students_count += 1;
            }
          }
        });
        
        const courses = Array.from(courseMap.values());
        console.log("Final courses array:", courses);
        setTutorCourses(courses);
      } else {
        console.log("No orders data available for tutor courses");
      }
    } catch (error) {
      console.error('Error processing tutor courses:', error);
      showNotification('שגיאה בטעינת הקורסים', 'error');
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
      
      // In a real implementation, we would call an API endpoint to create the coupon
      // For now, simulate API call and update local state
      const { data, error } = await supabase
        .from('coupons')
        .insert({
          code: newCouponCode,
          discount: parseInt(newCouponDiscount),
          expiry_date: newCouponExpiry,
          course_id: parseInt(selectedCourseForCoupon),
          tutor_id: dashboardData.tutor_id
        })
        .select();
        
      if (error) {
        console.error('Error creating coupon:', error);
        showNotification('שגיאה ביצירת הקופון', 'error');
        return;
      }
      
      // Add the new coupon to the local state
      const courseTitle = tutorCourses.find(
        c => c.id.toString() === selectedCourseForCoupon
      )?.title || '';
      
      const newCoupon = {
        id: data?.[0]?.id || Date.now(),
        code: newCouponCode,
        discount: parseInt(newCouponDiscount),
        expiry_date: newCouponExpiry,
        course_id: parseInt(selectedCourseForCoupon),
        course_title: courseTitle
      };
      
      // Update dashboard data with the new coupon
      setDashboardData(prev => ({
        ...prev,
        coupons: [...(prev.coupons || []), newCoupon]
      }));
      
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
      
      // In a real implementation, we would call an API endpoint to delete the coupon
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', couponId);
        
      if (error) {
        console.error('Error deleting coupon:', error);
        showNotification('שגיאה במחיקת הקופון', 'error');
        return;
      }
      
      // Update the local state
      setDashboardData(prev => ({
        ...prev,
        coupons: (prev.coupons || []).filter(coupon => coupon.id !== couponId)
      }));
      
      showNotification('הקופון נמחק בהצלחה', 'success');
    } catch (error) {
      console.error('Error deleting coupon:', error);
      showNotification('שגיאה במחיקת הקופון', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Course management functions
  const handleStartCourseEdit = (course) => {
    setCurrentEditingCourse(course);
  };

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
      
      // Update the dashboard data
      setDashboardData(prev => ({
        ...prev,
        my_courses: prev.my_courses.map(course => 
          course.course_id === currentEditingCourse.id
            ? {
                ...course,
                title: updateData.title,
                description: updateData.description,
                shown: updateData.shown
              }
            : course
        )
      }));
      
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

  const handleToggleCourseVisibility = async (course) => {
    try {
      const courseId = course.id || course.course_id;
      const newVisibility = !course.is_visible;
      
      setIsLoading(true);
      
      const { error } = await supabase
        .from('courses')
        .update({ is_visible: newVisibility })
        .eq('id', courseId);
      
      if (error) throw error;
      
      // Update local state
      setTutorCourses(prev => 
        prev.map(c => c.id === courseId || c.course_id === courseId ? { ...c, is_visible: newVisibility } : c)
      );
      
      setDashboardData(prev => ({
        ...prev,
        my_courses: prev.my_courses.map(c => 
          c.id === courseId || c.course_id === courseId ? { ...c, is_visible: newVisibility } : c
        )
      }));
      
      showNotification(
        newVisibility ? "הקורס הוצג בהצלחה" : "הקורס הוסתר בהצלחה",
        newVisibility ? "הקורס כעת גלוי למשתמשים" : "הקורס כעת מוסתר ממשתמשים",
        "success"
      );
    } catch (error) {
      console.error("Error toggling course visibility:", error);
      showNotification(
        "שגיאה בעדכון הקורס",
        "אירעה שגיאה בעת עדכון נראות הקורס. אנא נסה שוב מאוחר יותר.",
        "error"
      );
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
      
      // In a real implementation, we would call an API endpoint to delete the course
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);
        
      if (error) {
        console.error('Error deleting course:', error);
        showNotification('שגיאה במחיקת הקורס', 'אירעה שגיאה במחיקת הקורס. אנא נסה שוב.', 'error');
        return;
      }
      
      // Update local state
      setTutorCourses(prevCourses => 
        prevCourses.filter(course => course.id !== courseId)
      );
      
      showNotification('הקורס נמחק בהצלחה', 'הקורס נמחק מהמערכת בהצלחה', 'success');
    } catch (error) {
      console.error('Error deleting course:', error);
      showNotification('שגיאה במחיקת הקורס', 'אירעה שגיאה במחיקת הקורס. אנא נסה שוב.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      // In a real app, update profile in Supabase
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setDashboardData(prev => ({
        ...prev,
        access: [prev.access[0]],
        is_tutor: prev.is_tutor,
        tutor_id: prev.tutor_id
      }));
      setIsCouponModalOpen(false);
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
    setDashboardData(prev => ({
      ...prev,
      access: [prev.access[0]],
      is_tutor: prev.is_tutor,
      tutor_id: prev.tutor_id
    }));
  };

  // Fetch user access list for a course
  const fetchUserAccessList = async (courseId) => {
    setIsLoading(true);
    
    if (!courseId) {
      console.error("Invalid course ID provided to fetchUserAccessList");
      showNotification("מזהה קורס לא תקין", "לא ניתן לטעון את רשימת המשתמשים", "error");
      setIsLoading(false);
      return;
    }
    
    console.log("Fetching user access list for course ID:", courseId);
    
    // Call Supabase to get the list of users with access to this course
    const { data, error } = await supabase
      .from('access')
      .select(`
        id,
        user_id,
        user_email,
        user_name,
        granted_at,
        expires_at
      `)
      .eq('course_id', courseId);
      
    if (error) {
      console.error('Error fetching user access list:', error);
      showNotification('שגיאה בטעינת רשימת המשתמשים', 'error');
      return;
    }
    
    console.log("User access list data:", data);
    setUserAccessList(data || []);
    setIsLoading(false);
  };

  // Grant access to a user for a course
  const handleGrantAccess = async () => {
    try {
      setIsLoading(true);
      
      // Validate inputs
      if (!accessEmail || !selectedCourseForAccess || !accessExpiry) {
        showNotification('אנא מלא את כל השדות הנדרשים', 'warning');
        return;
      }
      
      // Calculate expiry date
      const expiryDate = new Date(accessExpiry);
      if (isNaN(expiryDate.getTime())) {
        showNotification('תאריך תפוגה לא תקין', 'warning');
        return;
      }
      
      // Call Supabase function to grant access
      const { data, error } = await supabase.rpc('grant_course_access', {
        user_email: accessEmail,
        course_id: parseInt(selectedCourseForAccess),
        expires_at: expiryDate.toISOString()
      });
      
      if (error) {
        console.error('Error granting access:', error);
        showNotification('שגיאה בהענקת גישה לקורס', 'error');
        return;
      }
      
      // Reset form and refresh access list
      setAccessEmail('');
      setSelectedCourseForAccess('');
      setAccessExpiry('');
      setIsAccessModalOpen(false);
      
      // Refresh the access list
      fetchUserAccessList(parseInt(selectedCourseForAccess));
      
      showNotification('הגישה הוענקה בהצלחה', 'success');
    } catch (error) {
      console.error('Error granting access:', error);
      showNotification('שגיאה בהענקת גישה לקורס', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Revoke access for a user
  const handleRevokeAccess = async () => {
    if (!selectedUserToRevoke) return;
    
    try {
      setIsLoading(true);
      
      // Call Supabase function to revoke access
      const { error } = await supabase.rpc('revoke_course_access', {
        access_id: selectedUserToRevoke.id
      });
      
      if (error) {
        console.error('Error revoking access:', error);
        showNotification('שגיאה בביטול הגישה לקורס', 'error');
        return;
      }
      
      // Remove from the list
      setUserAccessList(prev => prev.filter(item => item.id !== selectedUserToRevoke.id));
      setIsRevokeModalOpen(false);
      setSelectedUserToRevoke(null);
      
      showNotification('הגישה בוטלה בהצלחה', 'success');
    } catch (error) {
      console.error('Error revoking access:', error);
      showNotification('שגיאה בביטול הגישה לקורס', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle tutor profile update
  const handleTutorProfileUpdate = async () => {
    try {
      setIsLoading(true);
      
      // Prepare the data for update
      const updateData = {
        name: tutorProfileData.name,
        mail: tutorProfileData.mail,
        phone: tutorProfileData.phone,
        about_me: tutorProfileData.about_me,
        github: tutorProfileData.github,
        linkedin: tutorProfileData.linkedin,
        other_link: tutorProfileData.other_link,
        education: tutorProfileData.education,
        grades: tutorProfileData.grades
        // We don't update selections here as they have a different update mechanism
      };
      
      // Call Supabase to update the tutor profile
      const { error } = await supabase
        .from('tutors')
        .update(updateData)
        .eq('id', dashboardData.tutor_profile.id);
        
      if (error) {
        console.error('Error updating tutor profile:', error);
        showNotification('שגיאה בעדכון פרופיל המרצה', 'error');
        return;
      }
      
      // Update local state
      setDashboardData(prev => ({
        ...prev,
        tutor_profile: {
          ...prev.tutor_profile,
          ...updateData
        }
      }));
      
      setIsEditingProfile(false);
      showNotification('פרופיל המרצה עודכן בהצלחה', 'success');
    } catch (error) {
      console.error('Error updating tutor profile:', error);
      showNotification('שגיאה בעדכון פרופיל המרצה', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle adding a new education item
  const handleAddEducation = () => {
    if (!newEducation.institution || !newEducation.degree || !newEducation.field) {
      showNotification('אנא מלא את כל שדות ההשכלה', 'warning');
      return;
    }
    
    setTutorProfileData(prev => ({
      ...prev,
      education: [...prev.education, { ...newEducation }]
    }));
    
    // Reset new education form
    setNewEducation({
      institution: '',
      degree: '',
      field: '',
      year: ''
    });
  };
  
  // Handle removing an education item
  const handleRemoveEducation = (index) => {
    setTutorProfileData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };
  
  // Handle adding a new grade item
  const handleAddGrade = () => {
    if (!newGrade.course || !newGrade.grade) {
      showNotification('אנא מלא את כל שדות הציון', 'warning');
      return;
    }
    
    setTutorProfileData(prev => ({
      ...prev,
      grades: [...prev.grades, { ...newGrade }]
    }));
    
    // Reset new grade form
    setNewGrade({
      course: '',
      grade: ''
    });
  };
  
  // Handle removing a grade item
  const handleRemoveGrade = (index) => {
    setTutorProfileData(prev => ({
      ...prev,
      grades: prev.grades.filter((_, i) => i !== index)
    }));
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
      [name]: value
    }));
  };

  // User access management functions
  const handleAddUserAccess = async () => {
    if (!newUserEmail || !selectedCourseForAccess) {
      showNotification('אנא מלא את כל השדות הנדרשים', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      // Call Supabase function to grant access
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

      // Refresh the user access list
      fetchUserAccessList(selectedCourseForAccess.id.toString());
      
      // Reset form
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
      // Call Supabase to revoke access
      const { error } = await supabase
        .from('access')
        .delete()
        .eq('id', accessId);

      if (error) {
        console.error('Error removing access:', error);
        showNotification('שגיאה בהסרת הגישה', 'error');
        return;
      }

      // Update the list
      setUserAccessList(prev => prev.filter(user => user.id !== accessId));
      showNotification('הגישה הוסרה בהצלחה', 'success');
    } catch (error) {
      console.error('Error removing access:', error);
      showNotification('שגיאה בהסרת הגישה', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Show toast as notification fallback
  const showToast = (title, description, status = "info") => {
    showNotification({
      title,
      description: description || title,
      status
    });
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
                  <h2 className="font-bold text-xl mb-4 text-center">{user?.email}</h2>
                  <Button 
                    className={`w-full flex items-center justify-start gap-2 ${activeTab === 'main' ? 'bg-blue-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    onClick={() => setActiveTab('main')}
                  >
                    <BarChart2 size={18} />
                    <span>סקירה כללית</span>
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
                        className={`w-full flex items-center justify-start gap-2 ${activeTab === 'tutorProfile' ? 'bg-blue-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                        onClick={() => setActiveTab('tutorProfile')}
                      >
                        <User size={18} />
                        <span>פרופיל מרצה</span>
                      </Button>
                      <Button 
                        className={`w-full flex items-center justify-start gap-2 ${activeTab === 'analytics' ? 'bg-blue-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                        onClick={() => {
                          setActiveTab('analytics');
                          if (dashboardData.my_courses) {
                            processCourseData(dashboardData.my_courses);
                          }
                        }}
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
            {activeTab === 'courses' && (
              <Card>
                <CardHeader>
                  <CardTitle>הקורסים שלי</CardTitle>
                  <CardDescription>רשימת הקורסים שרכשת</CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboardData.access && dashboardData.access.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.access.map((course, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-bold text-lg">{course.title}</h3>
                              <p className="text-sm text-gray-600">מרצה: {course.tutor_name}</p>
                              <div className="mt-2 flex flex-col space-y-1">
                                <p className="text-xs text-gray-500 flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  נרכש בתאריך: {new Date(course.granted_at).toLocaleDateString('he-IL')}
                                </p>
                                <p className="text-xs text-gray-500 flex items-center">
                                  <Tag className="h-3 w-3 mr-1" />
                                  תוקף עד: {new Date(course.expires_at).toLocaleDateString('he-IL')}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Button
                                onClick={() => navigate(`/course/${course.video_course_id}`)}
                                className="flex items-center bg-blue-600 hover:bg-blue-700 transition-colors"
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
                        className="bg-blue-600 hover:bg-blue-700 transition-colors"
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-3 rounded-full mr-3">
                            <DollarSign size={24} className="text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">סה"כ מכירות</h3>
                            <p className="text-2xl font-bold">₪{analyticsData.totalSales}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                          <div className="bg-green-100 p-3 rounded-full mr-3">
                            <Calendar size={24} className="text-green-600" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">מכירות החודש</h3>
                            <p className="text-2xl font-bold">₪{analyticsData.monthlySales[0]?.amount || 0}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                          <div className="bg-amber-100 p-3 rounded-full mr-3">
                            <Users size={24} className="text-amber-600" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">סטודנטים</h3>
                            <p className="text-2xl font-bold">{analyticsData.totalStudents}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                          <div className="bg-purple-100 p-3 rounded-full mr-3">
                            <Database size={24} className="text-purple-600" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">קורסים</h3>
                            <p className="text-2xl font-bold">{dashboardData.access ? dashboardData.access.length : 0}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>מכירות אחרונות</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analyticsData.recentSales && analyticsData.recentSales.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="py-2 px-4 text-right font-medium">תאריך</th>
                              <th className="py-2 px-4 text-right font-medium">סטודנט</th>
                              <th className="py-2 px-4 text-right font-medium">אימייל</th>
                              <th className="py-2 px-4 text-right font-medium">קורס</th>
                              <th className="py-2 px-4 text-right font-medium">סכום</th>
                              <th className="py-2 px-4 text-right font-medium">הנחה</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analyticsData.recentSales.map((sale, index) => (
                              <tr key={index} className="border-b hover:bg-gray-50">
                                <td className="py-2 px-4">{sale.date}</td>
                                <td className="py-2 px-4">{sale.user}</td>
                                <td className="py-2 px-4">
                                  <a 
                                    href={`mailto:${sale.email}`} 
                                    className="text-blue-600 hover:underline"
                                  >
                                    {sale.email}
                                  </a>
                                </td>
                                <td className="py-2 px-4">
                                  {sale.video_id ? (
                                    <a 
                                      href={`/course/${sale.video_id}`}
                                      className="text-blue-600 hover:underline"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {sale.course}
                                    </a>
                                  ) : (
                                    sale.course
                                  )}
                                </td>
                                <td className="py-2 px-4">₪{sale.amount}</td>
                                <td className="py-2 px-4">
                                  {sale.discount ? (
                                    <span className="text-green-600">{sale.discount}%</span>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                  {sale.coupon && (
                                    <span className="text-xs ml-1 bg-blue-100 text-blue-800 py-0.5 px-2 rounded-full">
                                      {sale.coupon}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">אין מכירות עדיין</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>מכירות חודשיות</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60">
                      {analyticsData.monthlySales && analyticsData.monthlySales.length > 0 && 
                       analyticsData.monthlySales.some(month => month.amount > 0) ? (
                        <div className="flex h-full items-end">
                          {analyticsData.monthlySales.map((monthData, index) => {
                            const maxAmount = Math.max(...analyticsData.monthlySales.map(m => m.amount));
                            const height = maxAmount > 0 
                              ? (monthData.amount / maxAmount) * 180 
                              : 0;
                            
                            return (
                              <div key={index} className="flex-1 flex flex-col items-center">
                                <div 
                                  className="w-full max-w-[40px] bg-blue-600 rounded-t"
                                  style={{ 
                                    height: `${height}px`,
                                    minHeight: monthData.amount > 0 ? '4px' : '0'
                                  }}
                                ></div>
                                <span className="text-xs mt-2">{monthData.month}</span>
                                <span className="text-xs font-medium">₪{monthData.amount}</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-gray-500">אין מספיק נתונים להצגת גרף</p>
                        </div>
                      )}
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
                                      // Handle case where course.id is undefined
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
                            
                            {isEditingCourse && currentEditingCourse.id === course.id && (
                              <div className="mt-4 pt-4 border-t">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <label className="block text-sm font-medium mb-1">כותרת</label>
                                    <input
                                      type="text"
                                      value={currentEditingCourse.editTitle || course.title}
                                      onChange={(e) => handleCourseEditChange('editTitle', e.target.value)}
                                      className="w-full p-2 border rounded"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-1">מחיר (₪)</label>
                                    <input
                                      type="number"
                                      value={currentEditingCourse.editPrice || course.price}
                                      onChange={(e) => handleCourseEditChange('editPrice', e.target.value)}
                                      className="w-full p-2 border rounded"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-1">מחיר מבצע (₪) - אופציונלי</label>
                                    <input
                                      type="number"
                                      value={currentEditingCourse.editSalePrice || course.sale_price || ''}
                                      onChange={(e) => handleCourseEditChange('editSalePrice', e.target.value)}
                                      className="w-full p-2 border rounded"
                                    />
                                  </div>
                                </div>
                                
                                <div className="mb-4">
                                  <label className="block text-sm font-medium mb-1">תיאור</label>
                                  <textarea
                                    value={currentEditingCourse.editDescription || course.description}
                                    onChange={(e) => handleCourseEditChange('editDescription', e.target.value)}
                                    className="w-full p-2 border rounded"
                                    rows={3}
                                  />
                                </div>
                                
                                <div className="flex justify-end gap-2">
                                  <Button
                                    onClick={handleCancelCourseEdit}
                                    className="bg-gray-200 text-gray-800"
                                    size="sm"
                                  >
                                    ביטול
                                  </Button>
                                  <Button
                                    onClick={handleSaveCourseEdit}
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
                                {tutorCourses.map((course, index) => (
                                  <option key={index} value={course.id}>
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
                                <tbody>
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
            )}

            {/* Tutor Profile Tab */}
            {activeTab === 'tutorProfile' && isTutor && dashboardData.tutor_profile && (
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">מוסד לימודים</label>
                                <input
                                  type="text"
                                  name="institution"
                                  value={newEducation.institution}
                                  onChange={handleEducationInputChange}
                                  className="w-full p-2 border rounded"
                                  placeholder="שם המוסד האקדמי"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">תואר</label>
                                <input
                                  type="text"
                                  name="degree"
                                  value={newEducation.degree}
                                  onChange={handleEducationInputChange}
                                  className="w-full p-2 border rounded"
                                  placeholder="סוג התואר (B.Sc, M.Sc, וכו')"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">תחום</label>
                                <input
                                  type="text"
                                  name="field"
                                  value={newEducation.field}
                                  onChange={handleEducationInputChange}
                                  className="w-full p-2 border rounded"
                                  placeholder="תחום הלימודים"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">שנה</label>
                                <input
                                  type="text"
                                  name="year"
                                  value={newEducation.year}
                                  onChange={handleEducationInputChange}
                                  className="w-full p-2 border rounded"
                                  placeholder="שנת סיום"
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
                        
                        {tutorProfileData.education && tutorProfileData.education.length > 0 ? (
                          <div className="space-y-2">
                            {tutorProfileData.education.map((edu, index) => (
                              <div key={index} className="p-3 bg-white rounded border flex justify-between items-center">
                                <div>
                                  <p className="font-medium">{edu.degree} {edu.field}</p>
                                  <p className="text-sm text-gray-600">{edu.institution}, {edu.year}</p>
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
                        {dashboardData.tutor_profile.selections && dashboardData.tutor_profile.selections.length > 0 ? (
                          <div className="space-y-2">
                            {dashboardData.tutor_profile.selections.map((selection, index) => (
                              <div key={index} className="p-3 bg-white rounded border">
                                <p className="font-medium">{selection.course_name}</p>
                                <p className="text-sm text-gray-600">{selection.degree_name}, {selection.academy_name}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center py-4 text-gray-500">לא נמצאו קורסים</p>
                        )}
                        <p className="mt-4 text-sm text-gray-500">* ניתן להוסיף קורסים דרך עמוד הגדרות המרצה.</p>
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
                                <Loader size={16} className="mr-2 animate-spin" />
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
            )}

            {/* Courses Analytics Tab */}
            {activeTab === 'courses' && isTutor && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>ניהול הקורסים שלי</CardTitle>
                    <CardDescription>פרטי הקורסים שלך וביצועים אנליטיים</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Analytics Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border">
                        <h3 className="text-lg font-medium mb-2">סה״כ מכירות</h3>
                        <p className="text-3xl font-bold">{courseAnalytics.totalSales || 0}</p>
                        <p className="text-sm text-gray-600 mt-1">רכישות סה״כ</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border">
                        <h3 className="text-lg font-medium mb-2">סה״כ הכנסה</h3>
                        <p className="text-3xl font-bold">₪{courseAnalytics.totalRevenue ? courseAnalytics.totalRevenue.toLocaleString() : 0}</p>
                        <p className="text-sm text-gray-600 mt-1">הכנסות מכל הקורסים</p>
                      </div>
                      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border">
                        <h3 className="text-lg font-medium mb-2">שיעור המרה</h3>
                        <p className="text-3xl font-bold">{courseAnalytics.conversionRate || '0'}%</p>
                        <p className="text-sm text-gray-600 mt-1">ממוצע לכל הקורסים</p>
                      </div>
                    </div>

                    {/* Courses List */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-medium mb-4">הקורסים שלי</h3>
                      
                      {tutorCourses.length > 0 ? (
                        tutorCourses.map((course) => (
                          <Card key={course.id} className="mb-6">
                            <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
                              <div>
                                <CardTitle className="flex items-center">
                                  {course.title}
                                  {!course.is_visible && <span className="mr-2 px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full">מוסתר</span>}
                                </CardTitle>
                                <CardDescription>
                                  כמות מכירות: <span className="font-bold">{course.total_sales || 0}</span> | 
                                  סה״כ הכנסה: <span className="font-bold">₪{course.total_revenue ? course.total_revenue.toLocaleString() : 0}</span>
                                </CardDescription>
                              </div>
                              <div className="flex">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleToggleCourseVisibility(course)}
                                  className={`mr-2 ${course.is_visible ? 'text-blue-600' : 'text-amber-600'}`}
                                >
                                  {course.is_visible ? (
                                    <><EyeOff size={16} className="mr-1" /> הסתר</>
                                  ) : (
                                    <><Eye size={16} className="mr-1" /> הצג</>
                                  )}
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleStartCourseEdit(course)}
                                  className="text-green-600"
                                >
                                  <Edit size={16} className="mr-1" /> ערוך
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="p-4">
                              {currentEditingCourse && currentEditingCourse.id === course.id ? (
                                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                                  <div>
                                    <label className="block text-sm font-medium mb-1">כותרת הקורס</label>
                                    <input 
                                      type="text" 
                                      name="title"
                                      value={currentEditingCourse.title || ''}
                                      onChange={handleCourseEditChange}
                                      className="w-full p-2 border rounded"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-1">תיאור הקורס</label>
                                    <textarea 
                                      name="description"
                                      value={currentEditingCourse.description || ''}
                                      onChange={handleCourseEditChange}
                                      rows={3}
                                      className="w-full p-2 border rounded"
                                    />
                                  </div>
                                  <div className="flex justify-end mt-2">
                                    <Button 
                                      onClick={handleCancelCourseEdit}
                                      className="bg-gray-200 text-gray-800 mr-2"
                                    >
                                      ביטול
                                    </Button>
                                    <Button 
                                      onClick={handleSaveCourseEdit}
                                      className="bg-blue-600"
                                      disabled={isLoading}
                                    >
                                      {isLoading ? (
                                        <>
                                          <Loader size={16} className="mr-2 animate-spin" />
                                          שומר...
                                        </>
                                      ) : 'שמור שינויים'}
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <p className="mb-4">{course.description || 'אין תיאור לקורס זה.'}</p>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                      <h4 className="text-sm font-medium mb-1">כמות מכירות</h4>
                                      <p className="text-lg font-bold">{course.total_sales || 0}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                      <h4 className="text-sm font-medium mb-1">סה״כ הכנסה</h4>
                                      <p className="text-lg font-bold">₪{course.total_revenue ? course.total_revenue.toLocaleString() : 0}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                      <h4 className="text-sm font-medium mb-1">מחיר</h4>
                                      <p className="text-lg font-bold">₪{course.price ? course.price.toLocaleString() : 0}</p>
                                    </div>
                                  </div>
                                  
                                  {/* Recent Sales */}
                                  <div className="mt-4">
                                    <h4 className="text-md font-medium mb-2">מכירות אחרונות</h4>
                                    {course.recent_sales && course.recent_sales.length > 0 ? (
                                      <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                          <thead className="bg-gray-50">
                                            <tr>
                                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                תאריך
                                              </th>
                                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                לקוח
                                              </th>
                                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                סכום
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody className="bg-white divide-y divide-gray-200">
                                            {course.recent_sales.map((sale, index) => (
                                              <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                  {new Date(sale.created_at).toLocaleDateString('he-IL')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                  {sale.user_email || 'אנונימי'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                  ₪{sale.amount ? sale.amount.toLocaleString() : 0}
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    ) : (
                                      <p className="text-gray-500 text-center py-4">אין מכירות אחרונות לקורס זה</p>
                                    )}
                                  </div>
                                  
                                  {/* Access Management Button */}
                                  <div className="mt-4 flex justify-end">
                                    <Button
                                      onClick={() => {
                                        if (course.id) {
                                          fetchUserAccessList(course.id.toString());
                                          setSelectedCourseForAccess(course);
                                          setShowAccessManagement(true);
                                        } else {
                                          console.error("Course ID is missing", course);
                                          showToast({
                                            title: "שגיאה",
                                            description: "מזהה קורס חסר",
                                            status: "error",
                                          });
                                        }
                                      }}
                                      className="bg-blue-600"
                                    >
                                      <Users size={16} className="mr-1" /> ניהול גישות
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <Card>
                          <CardContent className="p-6 text-center">
                            <p className="text-gray-500 mb-4">לא נמצאו קורסים</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Access Management Modal */}
                {showAccessManagement && selectedCourseForAccess && (
                  <Dialog open={showAccessManagement} onOpenChange={setShowAccessManagement}>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>ניהול גישות - {selectedCourseForAccess.title}</DialogTitle>
                        <DialogDescription>ניהול משתמשים שיש להם גישה לקורס זה</DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        {/* Add User form */}
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="text-md font-medium mb-4">הוספת משתמש חדש</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">אימייל</label>
                              <input
                                type="email"
                                value={newUserEmail}
                                onChange={(e) => setNewUserEmail(e.target.value)}
                                className="w-full p-2 border rounded"
                                placeholder="email@example.com"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">תאריך תפוגה (אופציונלי)</label>
                              <input
                                type="date"
                                value={newUserExpiry}
                                onChange={(e) => setNewUserExpiry(e.target.value)}
                                className="w-full p-2 border rounded"
                              />
                            </div>
                          </div>
                          <Button
                            onClick={handleAddUserAccess}
                            className="mt-4 bg-blue-600"
                            disabled={!newUserEmail || isLoading}
                          >
                            {isLoading ? (
                              <>
                                <Loader size={16} className="mr-2 animate-spin" />
                                מוסיף גישה...
                              </>
                            ) : (
                              <>
                                <Plus size={16} className="mr-1" /> הוסף גישה
                              </>
                            )}
                          </Button>
                        </div>
                        
                        {/* Users List */}
                        <div>
                          <h3 className="text-md font-medium mb-4">משתמשים עם גישה</h3>
                          {isLoading ? (
                            <div className="flex justify-center py-6">
                              <Loader size={24} className="animate-spin" />
                            </div>
                          ) : userAccessList.length > 0 ? (
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      שם
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      אימייל
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      תאריך הענקה
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      תאריך תפוגה
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      פעולות
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {userAccessList.map((user) => (
                                    <tr key={user.id}>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.user_name || 'לא ידוע'}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.user_email}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.granted_at ? new Date(user.granted_at).toLocaleDateString('he-IL') : 'לא ידוע'}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.expires_at ? (
                                          <span className={new Date(user.expires_at) < new Date() ? 'text-red-600 font-medium' : ''}>
                                            {new Date(user.expires_at).toLocaleDateString('he-IL')}
                                          </span>
                                        ) : (
                                          'ללא תפוגה'
                                        )}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <Button
                                          onClick={() => handleRemoveUserAccess(user.id)}
                                          variant="ghost"
                                          size="sm"
                                          className="text-red-500 hover:text-red-700"
                                          disabled={isLoading}
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
                            <p className="text-center py-4 text-gray-500">אין משתמשים עם גישה לקורס זה</p>
                          )}
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAccessManagement(false)}>
                          סגור
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            )}

            {/* My Courses Tab (for students) */}
            {activeTab === 'courses' && !isTutor && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>הקורסים שלי</CardTitle>
                    <CardDescription>הקורסים שרכשת</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {dashboardData.my_courses && dashboardData.my_courses.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dashboardData.my_courses.map((course) => (
                          <Card key={course.id} className="overflow-hidden">
                            <div className="aspect-video relative overflow-hidden bg-gray-100">
                              {course.thumbnail_url ? (
                                <img 
                                  src={course.thumbnail_url} 
                                  alt={course.title} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                  <Book size={40} className="text-gray-400" />
                                </div>
                              )}
                            </div>
                            <CardContent className="p-4">
                              <h3 className="text-lg font-medium mb-2">{course.title}</h3>
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {course.description || 'אין תיאור לקורס זה.'}
                              </p>
                              
                              {course.expires_at && (
                                <div className="flex items-center mb-3 text-amber-600">
                                  <Calendar size={16} className="mr-1" />
                                  <span className="text-sm">
                                    תוקף עד: {new Date(course.expires_at).toLocaleDateString('he-IL')}
                                  </span>
                                </div>
                              )}
                              
                              <div className="mt-4">
                                <Button 
                                  onClick={() => navigate(`/course/${course.id}`)}
                                  className="w-full bg-blue-600"
                                >
                                  צפה בקורס
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
                          <Book size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">לא נמצאו קורסים</h3>
                        <p className="text-gray-500 mb-4">
                          עדיין לא רכשת קורסים באתר.
                        </p>
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
              </div>
            )}

            {/* Main Dashboard */}
            {activeTab === 'main' && (
              <div className="space-y-6">
                {/* Welcome Section */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-2xl">ברוך הבא {user?.user_metadata?.name || user?.email || 'לדשבורד'}</CardTitle>
                    <CardDescription>
                      הנה סיכום הפעילות שלך באתר
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {/* Course Count */}
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg flex items-center border">
                        <div className="rounded-full bg-blue-100 p-3 mr-4">
                          <Book size={24} className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">קורסים</h3>
                          <p className="text-2xl font-bold">
                            {isTutor ? 
                              (tutorCourses?.length || 0) : 
                              (dashboardData.my_courses?.length || 0)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {isTutor ? 'קורסים שאתה מלמד' : 'קורסים שרכשת'}
                          </p>
                        </div>
                      </div>

                      {/* Users/Revenue */}
                      {isTutor ? (
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg flex items-center border">
                          <div className="rounded-full bg-green-100 p-3 mr-4">
                            <DollarSign size={24} className="text-green-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">הכנסות</h3>
                            <p className="text-2xl font-bold">₪{dashboardData.total_revenue ? dashboardData.total_revenue.toLocaleString() : 0}</p>
                            <p className="text-sm text-gray-600">מכל המכירות</p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg flex items-center border">
                          <div className="rounded-full bg-purple-100 p-3 mr-4">
                            <DollarSign size={24} className="text-purple-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">השקעה</h3>
                            <p className="text-2xl font-bold">₪{dashboardData.total_spent ? dashboardData.total_spent.toLocaleString() : 0}</p>
                            <p className="text-sm text-gray-600">סה״כ השקעה בקורסים</p>
                          </div>
                        </div>
                      )}

                      {/* Students/Time */}
                      {isTutor ? (
                        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg flex items-center border">
                          <div className="rounded-full bg-amber-100 p-3 mr-4">
                            <Users size={24} className="text-amber-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">סטודנטים</h3>
                            <p className="text-2xl font-bold">{dashboardData.total_students || 0}</p>
                            <p className="text-sm text-gray-600">סטודנטים פעילים</p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg flex items-center border">
                          <div className="rounded-full bg-red-100 p-3 mr-4">
                            <Calendar size={24} className="text-red-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">שעות למידה</h3>
                            <p className="text-2xl font-bold">{dashboardData.total_watch_time || 0}</p>
                            <p className="text-sm text-gray-600">שעות למידה מצטברות</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity & Courses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle>פעילות אחרונה</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {dashboardData.recent_activity && dashboardData.recent_activity.length > 0 ? (
                        <div className="space-y-4">
                          {dashboardData.recent_activity.map((activity, idx) => (
                            <div key={idx} className="flex items-start border-b pb-4 last:border-0">
                              <div className={`p-2 rounded-full mr-3 ${
                                activity.type === 'purchase' ? 'bg-green-100' : 
                                activity.type === 'access_granted' ? 'bg-blue-100' :
                                activity.type === 'watch' ? 'bg-amber-100' : 'bg-gray-100'
                              }`}>
                                {activity.type === 'purchase' ? <DollarSign size={16} className="text-green-600" /> : 
                                 activity.type === 'access_granted' ? <Users size={16} className="text-blue-600" /> :
                                 activity.type === 'watch' ? <Zap size={16} className="text-amber-600" /> : 
                                 <Database size={16} className="text-gray-600" />}
                              </div>
                              <div>
                                <p className="font-medium">{activity.message}</p>
                                <p className="text-sm text-gray-500">
                                  {new Date(activity.created_at).toLocaleDateString('he-IL')} {new Date(activity.created_at).toLocaleTimeString('he-IL')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center py-4 text-gray-500">אין פעילות אחרונה</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Recent/Top Courses */}
                  <Card>
                    <CardHeader>
                      <CardTitle>{isTutor ? 'הקורסים המובילים' : 'קורסים אחרונים שנצפו'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isTutor ? (
                        // Top Courses for Tutors
                        tutorCourses && tutorCourses.length > 0 ? (
                          <div className="space-y-4">
                            {tutorCourses
                              .sort((a, b) => (b.total_sales || 0) - (a.total_sales || 0))
                              .slice(0, 5)
                              .map((course) => (
                                <div key={course.id} className="flex justify-between items-center border-b pb-3 last:border-0">
                                  <div>
                                    <p className="font-medium">{course.title}</p>
                                    <p className="text-sm text-gray-500">{course.total_sales || 0} מכירות</p>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setActiveTab('courses');
                                      // Scroll to course after tab change
                                      setTimeout(() => {
                                        const courseElem = document.getElementById(`course-${course.id}`);
                                        if (courseElem) courseElem.scrollIntoView({ behavior: 'smooth' });
                                      }, 100);
                                    }}
                                  >
                                    פרטים <ChevronRight size={16} />
                                  </Button>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <p className="text-center py-4 text-gray-500">אין קורסים להצגה</p>
                        )
                      ) : (
                        // Recently Watched Courses for Students
                        dashboardData.recently_watched && dashboardData.recently_watched.length > 0 ? (
                          <div className="space-y-4">
                            {dashboardData.recently_watched.map((course) => (
                              <div key={course.id} className="flex justify-between items-center border-b pb-3 last:border-0">
                                <div>
                                  <p className="font-medium">{course.title}</p>
                                  <p className="text-sm text-gray-500">נצפה לאחרונה: {new Date(course.last_watched).toLocaleDateString('he-IL')}</p>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/course/${course.id}`)}
                                >
                                  המשך צפייה <ChevronRight size={16} />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center py-4 text-gray-500">עדיין לא צפית בקורסים</p>
                        )
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Coupons for Tutors */}
                {isTutor && dashboardData.coupons && dashboardData.coupons.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>קופונים פעילים</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                קוד קופון
                              </th>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                הנחה
                              </th>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                קורס
                              </th>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                תוקף
                              </th>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                שימושים
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {dashboardData.coupons.slice(0, 5).map((coupon) => (
                              <tr key={coupon.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  <span className="bg-gray-100 px-2 py-1 rounded font-mono">
                                    {coupon.code}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {coupon.discount}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {coupon.course_title || 'כל הקורסים'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {new Date(coupon.expiry_date).toLocaleDateString('he-IL')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {coupon.uses || 0} פעמים
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {dashboardData.coupons.length > 5 && (
                          <div className="text-center mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setActiveTab('coupons')}
                              className="text-blue-600"
                            >
                              הצג את כל הקופונים ({dashboardData.coupons.length})
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
