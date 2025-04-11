import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import GoogleLoginButton from './GoogleLoginButton';
import TutorCard from './TutorCard';
import { showNotification } from './ui/notification';
import { courseStyles } from '../config/courseStyles';

const TutorSection = ({ courseType, onSubmitFeedback }) => {
  const [user, setUser] = useState(null);
  const [tutors, setTutors] = useState([]);
  const [feedbackForms, setFeedbackForms] = useState({});
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedTutorForLogin, setSelectedTutorForLogin] = useState(null);
  const styles = courseStyles[courseType] || courseStyles.cs;
  
  useEffect(() => {
    // Check auth status
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Auth state changes
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Load tutors
    loadTutors();
  }, []);

  const loadTutors = async () => {
    const { data: tutors, error } = await supabase
      .from('tutors')
      .select('*');

    if (error) {
      // Error handling without console.error
      alert('שגיאה בטעינת המורים');
      return;
    }

    // Load feedback for each tutor
    const tutorsWithFeedback = await Promise.all(
      tutors.map(async (tutor) => {
        const feedback = await loadFeedback(tutor.id);
        return { ...tutor, feedback };
      })
    );

    setTutors(tutorsWithFeedback);
  };

  const loadFeedback = async (tutorId) => {
    const { data, error } = await supabase
      .from('feedback')
      .select('rating, comment')
      .eq('tutor_id', tutorId);

    if (error) return { avgRating: 0, count: 0 };

    if (data.length === 0) return { avgRating: 0, count: 0 };

    const avgRating = data.reduce((sum, item) => sum + item.rating, 0) / data.length;
    return { avgRating, count: data.length };
  };

  const toggleFeedbackForm = (tutorId) => {
    setFeedbackForms(prev => ({
      ...prev,
      [tutorId]: !prev[tutorId]
    }));
  };

  const handleFeedbackClick = async (tutorId) => {
    if (!user) {
      setSelectedTutorForLogin(tutorId);
      setShowLoginModal(true);
    } else {
      toggleFeedbackForm(tutorId);
    }
  };

  const handleLoginSuccess = (data) => {
    setShowLoginModal(false);
    // If the user just logged in and wants to submit feedback, open the feedback form
    if (selectedTutorForLogin) {
      setTimeout(() => {
        toggleFeedbackForm(selectedTutorForLogin);
        setSelectedTutorForLogin(null);
      }, 1000);
    }
  };

  const handleLoginError = (error) => {
    // Error is already handled in the GoogleLoginButton component
    setShowLoginModal(false);
    setSelectedTutorForLogin(null);
  };

  const submitFeedback = async (tutorId, rating, comment) => {
    if (!user) {
      alert('אנא התחבר כדי להשאיר ביקורת');
      return;
    }

    const { error } = await supabase
      .from('feedback')
      .insert([{ 
        tutor_id: tutorId, 
        user_id: user.id, 
        rating: parseInt(rating), 
        comment 
      }]);

    if (error) {
      alert('שגיאה בשליחת הביקורת');
      return;
    }

    toggleFeedbackForm(tutorId);
    loadTutors();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className={`mb-8 bg-white border ${styles.cardBorder}`}>
        <CardHeader>
          <CardTitle className={`text-3xl ${styles.textcolor}`}>
            מורים פרטיים מומלצים
          </CardTitle>
        </CardHeader>

        {/*ביקורות */}
        <CardContent className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {tutors.map((tutor) => (
            <Card key={tutor.id} className="p-4">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-xl font-semibold">{tutor.name}</h3>
                  <p className="text-gray-600 text-sm whitespace-nowrap">
                    {tutor.feedback.count > 0 ? (
                      <>
                        <Star className="inline-block h-4 w-4 text-yellow-400 mb-0.5" />
                        {tutor.feedback.avgRating.toFixed(1)} ({tutor.feedback.count} ביקורות)
                      </>
                    ) : (
                      'אין ביקורות עדיין'
                    )}
                  </p>
                </div>
                <p className="text-gray-600">{tutor.subjects}</p>
              </div>
              
              <Button
                onClick={() => handleFeedbackClick(tutor.id)}
                className="mt-4"
                variant="outline"
              >
                הוסף ביקורת
              </Button>

              {feedbackForms[tutor.id] && (
                <div className="mt-4">
                  <select
                    className="w-full mb-2 p-2 border rounded"
                    id={`rating-${tutor.id}`}
                  >
                    {[1,2,3,4,5].map(num => (
                      <option key={num} value={num}>{'★'.repeat(num)}</option>
                    ))}
                  </select>
                  <textarea
                    className="w-full mb-2 p-2 border rounded"
                    placeholder="הערות (אופציונלי)"
                    id={`comment-${tutor.id}`}
                  />
                  <Button
                    onClick={() => submitFeedback(
                      tutor.id,
                      document.getElementById(`rating-${tutor.id}`).value,
                      document.getElementById(`comment-${tutor.id}`).value
                    )}
                    className={`${styles.buttonPrimary} text-white`}
                  >
                    שלח ביקורת
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-center">התחברות</h2>
            <p className="mb-4 text-center">התחבר כדי לדרג מורים</p>
            
            <GoogleLoginButton 
              onSuccess={handleLoginSuccess} 
              onError={handleLoginError} 
            />
            
            <button
              onClick={() => {
                setShowLoginModal(false);
                setSelectedTutorForLogin(null);
              }}
              className="w-full mt-4 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none"
            >
              ביטול
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorSection;