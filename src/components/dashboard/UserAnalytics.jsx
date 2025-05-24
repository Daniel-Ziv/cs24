import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';  // Adjust import path if needed
import { DollarSign, Calendar, Users, Database, BarChart2, Clock, Play, Eye } from 'lucide-react';  // Added new icons

const UserAnalytics = ({ activeTab, isTutor, dashboardData, isLoading: parentLoading }) => {
  const [analyticsData, setAnalyticsData] = useState({
    recentSales: [],
    totalSales: 0,
    totalRevenue: 0,
    monthlySales: [],
    totalStudents: 0,
    courseAnalytics: [],
    // New video analytics
    totalViewingTime: 0,
    averageViewingTime: 0,
    totalVideos: 0,
    videoAnalytics: []
  });

  // Process video analytics data
  const processVideoAnalytics = (courses) => {
    if (!courses || courses.length === 0) return { totalViewingTime: 0, averageViewingTime: 0, totalVideos: 0, videoAnalytics: [] };
    
    let totalViewingTime = 0;
    let totalVideos = 0;
    const videoAnalytics = [];
    
    courses.forEach(course => {
      if (course.analytics && course.analytics.length > 0) {
        // Calculate total viewing time for this course
        const courseViewingTime = course.analytics.reduce((total, session) => total + (session.minutes || 0), 0);
        const courseVideos = course.analytics.length;
        const averageSessionTime = courseVideos > 0 ? courseViewingTime / courseVideos : 0;
        
        totalViewingTime += courseViewingTime;
        totalVideos += courseVideos;
        
        videoAnalytics.push({
          courseId: course.video_course_id,
          courseTitle: course.title,
          totalViewingTime: courseViewingTime,
          totalVideos: courseVideos,
          averageSessionTime: averageSessionTime,
          // Calculate engagement score (viewing time per view)
          engagementScore: averageSessionTime
        });
      } else {
        // Course with no analytics
        videoAnalytics.push({
          courseId: course.video_course_id,
          courseTitle: course.title,
          totalViewingTime: 0,
          totalVideos: 0,
          averageSessionTime: 0,
          engagementScore: 0
        });
      }
    });
    
    const averageViewingTime = totalVideos > 0 ? totalViewingTime / totalVideos : 0;
    
    return {
      totalViewingTime,
      averageViewingTime,
      totalVideos,
      videoAnalytics: videoAnalytics.sort((a, b) => b.totalViewingTime - a.totalViewingTime) // Sort by total viewing time
    };
  };

  // Process course data for analytics
  const processCourseData = (courses) => {
    if (!courses || courses.length === 0) return;
    
    console.log("Processing course data:", courses);
    
    // Process video analytics
    const videoAnalyticsData = processVideoAnalytics(courses);
    
    // Analyze sales data per course
    const allSales = [];
    const courseStats = [];
    
    courses.forEach(course => {
      if (!course.purchasers || course.purchasers.length === 0) {
        courseStats.push({
          courseId: course.video_course_id,
          courseTitle: course.title,
          totalSales: 0,
          totalRevenue: 0,
          paidOrders: 0,
          pendingOrders: 0,
          conversionRate: 0,
          uniqueCustomers: 0,
          recentSales: []
        });
        return;
      }
      
      // Get all paid orders - only students who actually paid
      const paidOrders = course.purchasers.filter(order => order.paid === true);
      
      // Calculate total revenue from this course
      const totalRevenue = paidOrders.reduce((total, order) => total + order.amount, 0);
      
      // Get unique customers for this course
      const uniqueCustomers = [...new Set(
        paidOrders
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
          courseId: course.video_course_id,
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
        courseId: course.video_course_id,
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
    
    // Get unique students across all courses (only paid students)
    const allCustomers = new Set();
    courses.forEach(course => {
      if (course.purchasers) {
        course.purchasers
          .filter(purchaser => purchaser.paid === true)
          .forEach(purchaser => {
            if (purchaser.customer_email) {
              allCustomers.add(purchaser.customer_email);
            }
          });
      }
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
      courseAnalytics: courseStats,
      // Add video analytics
      totalViewingTime: videoAnalyticsData.totalViewingTime,
      averageViewingTime: videoAnalyticsData.averageViewingTime,
      totalVideos: videoAnalyticsData.totalVideos,
      videoAnalytics: videoAnalyticsData.videoAnalytics
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

  useEffect(() => {
    // Use the my_courses data from dashboardData (this is the tutor's courses)
    if (dashboardData.my_courses) {
      processCourseData(dashboardData.my_courses);
    }
  }, [dashboardData.my_courses]);

  return (
    activeTab === 'analytics' && isTutor && (
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
                    <h3 className="text-sm font-medium text-gray-500">סה\"כ הכנסות</h3>
                    <p className="text-2xl font-bold">₪{analyticsData.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full mr-3">
                    <Calendar size={24} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">הכנסות החודש</h3>
                    <p className="text-2xl font-bold">₪{analyticsData.monthlySales[0]?.amount.toLocaleString() || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="bg-amber-100 p-3 rounded-full mr-3">
                    <Users size={24} className="text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">סטודנטים פעילים</h3>
                    <p className="text-2xl font-bold">{analyticsData.totalStudents}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full mr-3">
                    <BarChart2 size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">סה\"כ מכירות</h3>
                    <p className="text-2xl font-bold">{analyticsData.totalSales}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>אנליטיקת צפייה</CardTitle>
            <CardDescription>נתוני צפייה עבור הקורסים שלך</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-3 rounded-full mr-3">
                    <Clock size={24} className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">סה\"כ זמן צפייה</h3>
                    <p className="text-2xl font-bold">{Math.round(analyticsData.totalViewingTime)} דקות</p>
                    <p className="text-xs text-gray-400">{(analyticsData.totalViewingTime / 60).toFixed(1)} שעות</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="bg-teal-100 p-3 rounded-full mr-3">
                    <Play size={24} className="text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">סה\"כ סרטונים שצפו</h3>
                    <p className="text-2xl font-bold">{analyticsData.totalVideos}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="bg-rose-100 p-3 rounded-full mr-3">
                    <Eye size={24} className="text-rose-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">ממוצע זמן לסרטון</h3>
                    <p className="text-2xl font-bold">{analyticsData.averageViewingTime.toFixed(1)} דקות</p>
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
                        <td className="py-2 px-4">{sale.customerName}</td>
                        <td className="py-2 px-4">
                          <a 
                            href={`mailto:${sale.customerEmail}`} 
                            className="text-blue-600 hover:underline"
                          >
                            {sale.customerEmail}
                          </a>
                        </td>
                        <td className="py-2 px-4">{sale.courseTitle}</td>
                        <td className="py-2 px-4">₪{sale.amount.toLocaleString()}</td>
                        <td className="py-2 px-4">
                          {sale.discount > 0 && (
                            <span className="text-green-600">{sale.discount}%</span>
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
                        <span className="text-xs font-medium">₪{monthData.amount.toLocaleString()}</span>
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

        <Card>
          <CardHeader>
            <CardTitle>אנליטיקה לפי קורס</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      קורס
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      מכירות
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      הכנסות
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      סטודנטים
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      אחוז המרה
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      זמן צפייה
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      סרטונים
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analyticsData.courseAnalytics.map((course) => {
                    // Find corresponding video analytics
                    const videoData = analyticsData.videoAnalytics.find(v => v.courseId === course.courseId) || {
                      totalViewingTime: 0,
                      totalVideos: 0,
                      averageSessionTime: 0
                    };
                    
                    return (
                      <tr key={course.courseId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {course.courseTitle}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {course.totalSales}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₪{course.totalRevenue.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {course.uniqueCustomers}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {course.conversionRate.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {Math.round(videoData.totalViewingTime)} דקות
                          <div className="text-xs text-gray-500">
                            ממוצע: {videoData.averageSessionTime.toFixed(1)} דקות לסרטון
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {videoData.totalVideos}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>פירוט אנליטיקת צפייה</CardTitle>
            <CardDescription>נתוני צפייה מפורטים לכל קורס</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsData.videoAnalytics && analyticsData.videoAnalytics.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        קורס
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        סה\"כ זמן צפייה
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        מספר סרטונים
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ממוצע לסרטון
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ציון מעורבות
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analyticsData.videoAnalytics.map((video) => (
                      <tr key={video.courseId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {video.courseTitle}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {Math.round(video.totalViewingTime)} דקות
                          <div className="text-xs text-gray-500">
                            ({(video.totalViewingTime / 60).toFixed(1)} שעות)
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {video.totalVideos}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {video.averageSessionTime.toFixed(1)} דקות
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  video.engagementScore >= 5 ? 'bg-green-500' :
                                  video.engagementScore >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ 
                                  width: `${Math.min((video.engagementScore / 10) * 100, 100)}%` 
                                }}
                              ></div>
                            </div>
                            <span className="text-xs">
                              {video.engagementScore.toFixed(1)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">אין נתוני צפייה עדיין</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  );
};

export default UserAnalytics; 