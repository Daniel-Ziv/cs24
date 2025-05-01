import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { supabase } from '../lib/supabase';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { courseMappings } from '../config/courseMappings';
import { showNotification } from './ui/notification';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const AdminPanel = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [error, setError] = useState(null);
  const [showAllRequests, setShowAllRequests] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('new_tutor_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        setError(`Error loading requests: ${error.message}`);
        throw error;
      }
      
      setRequests(data || []);
    } catch (error) {
      setError(`Error loading requests: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAdminStatus = async () => {
      setLoading(true);
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .rpc('check_is_admin', { p_user_id: user.id });
        
        if (error) throw error;
        setIsAdmin(data);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (user && isAdmin) {
      loadRequests();
    }
  }, [user, isAdmin]);

  if (loading) return null;
  if (!isAdmin) return null;

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      if (newStatus === 'approved') {
        const { error } = await supabase
          .rpc('approve_tutor_request', { p_request_id: requestId });

        if (error) throw error;
      } else {
        // For rejection, just update the status
        const { error } = await supabase
          .from('new_tutor_requests')
          .update({ status: newStatus })
          .eq('id', requestId);

        if (error) throw error;
      }

      loadRequests();
      
      // Show notification instead of alert
      showNotification(
        newStatus === 'approved' ? 'הבקשה אושרה בהצלחה' : 'הבקשה נדחתה',
        newStatus === 'approved' ? 'success' : 'info'
      );
    } catch (error) {
      showNotification('שגיאה בעדכון הבקשה', 'error');
    }
  };

  // Get unique years from requests
  const years = [...new Set(requests.map(req => req.year).filter(Boolean))].sort();
  
  const getCoursesByYear = (year, degree) => {
    return courseMappings[degree]?.[year]?.map(course => course.name) || [];
  };

  const handleYearClick = (year) => {
    if (selectedYear === year) {
      setSelectedYear(null);
      setSelectedCourses([]);
    } else {
      setSelectedYear(year);
      // Get courses for both CS and EE for the selected year
      const csCourses = getCoursesByYear(year, 'cs');
      const eeCourses = getCoursesByYear(year, 'ee');
      setSelectedCourses([...csCourses, ...eeCourses]);
    }
  };

  return (
    <Card className="mb-8 max-h-[600px] flex flex-col">
      <CardHeader className="border-b sticky top-0 bg-white z-10">
        <CardTitle className="text-2xl">ניהול בקשות מורים</CardTitle>
        <div className="text-sm text-gray-500">מחובר כמנהל: {user?.email}</div>
        <div className="flex justify-between items-center">
          <Button 
            onClick={() => setShowAllRequests(!showAllRequests)}
            size="sm"
            variant="outline"
            className="text-blue-600 hover:text-blue-700"
          >
            {showAllRequests ? 'הצג רק בקשות ממתינות' : 'הצג את כל הבקשות'}
          </Button>
          <Button 
            onClick={loadRequests} 
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            רענן נתונים
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-y-auto flex-1">
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4">
            <p>שגיאה בטעינת הנתונים:</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center text-gray-500 p-4">
            <p>אין בקשות</p>
            <p className="text-sm mt-2">נסה לרענן את הנתונים או לבדוק את החיבור לשרת</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Year filter buttons */}
            <div className="flex gap-2 mb-4">
              {years.map((year) => (
                <Button
                  key={year}
                  onClick={() => handleYearClick(year)}
                  className={`${
                    selectedYear === year 
                      ? 'bg-sky-600 text-white hover:bg-sky-700'
                      : 'bg-white text-sky-600 border border-sky-600 hover:bg-sky-50'
                  }`}
                  size="sm"
                >
                  {year}
                </Button>
              ))}
            </div>

            {/* Course list */}
            {selectedYear && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCourses.map((course) => (
                  <span
                    key={course}
                    className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800"
                  >
                    {course}
                  </span>
                ))}
              </div>
            )}

            {/* Requests list - show all requests regardless of status */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {requests
                .filter(req => !selectedYear || req.year === selectedYear)
                .map((request) => (
                  <Card key={request.id} className="border p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{request.name}</h3>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-600">{request.phone}</p>
                          <a
                            href={`https://wa.me/972${request.phone?.substring(1)}?text=${encodeURIComponent('היי, לפני שאני מאשר אותך באתר, אשמח לשמוע עלייך קצת. תודה!')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-500 hover:text-green-600"
                            title="WhatsApp"
                          >
                            <FontAwesomeIcon icon={faWhatsapp} size="lg" />
                          </a>
                        </div>
                        <p className="text-sm text-gray-600">
                        {request.degree === 'cs' ? 'מדעי המחשב'
                            : request.degree === 'ee' ? 'הנדסת חשמל'
                            : 'הנדסת תעשייה וניהול'}

                        </p>
                        {request.year && (
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 mr-1">
                            {request.year}
                          </span>
                        )}
                        {/* Show status badge */}
                        <span className={`text-xs px-2 py-1 rounded-full mr-1 ${
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {request.status === 'approved' ? 'מאושר' :
                           request.status === 'rejected' ? 'נדחה' :
                           'ממתין לאישור'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {request.status === 'pending' && (
                          <>
                            <Button
                              onClick={() => handleStatusChange(request.id, 'approved')}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleStatusChange(request.id, 'rejected')}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="outline"
                          onClick={() => setExpandedRequest(expandedRequest === request.id ? null : request.id)}
                        >
                          {expandedRequest === request.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {expandedRequest === request.id && (
                      <div className="mt-4 space-y-2">
                        {request.years && (
                          <div>
                            <p className="text-sm font-medium">שנים:</p>
                            <p className="text-sm text-gray-600">{Array.isArray(request.years) ? request.years.join(', ') : request.years}</p>
                          </div>
                        )}
                        {request.specialization && (
                          <div>
                            <p className="text-sm font-medium">התמחות:</p>
                            <p className="text-sm text-gray-600">{request.specialization}</p>
                          </div>
                        )}
                        {request.subjects && (
                          <div>
                            <p className="text-sm font-medium">קורסים:</p>
                            <p className="text-sm text-gray-600">{Array.isArray(request.subjects) ? request.subjects.join(', ') : request.subjects}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium">סטטוס:</p>
                          <p className={`text-sm ${
                            request.status === 'approved' ? 'text-green-600' :
                            request.status === 'rejected' ? 'text-red-600' :
                            'text-yellow-600'
                          }`}>
                            {request.status === 'approved' ? 'מאושר' :
                             request.status === 'rejected' ? 'נדחה' :
                             'ממתין לאישור'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">תאריך הגשה:</p>
                          <p className="text-sm text-gray-600">
                            {new Date(request.created_at).toLocaleDateString('he-IL')}
                          </p>
                        </div>
                        {request.email && (
                          <div>
                            <p className="text-sm font-medium">אימייל:</p>
                            <p className="text-sm text-gray-600">{request.email}</p>
                          </div>
                        )}
                        {request.comments && (
                          <div>
                            <p className="text-sm font-medium">הערות:</p>
                            <p className="text-sm text-gray-600">{request.comments}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminPanel;