import React, { useState } from 'react';
import { Button } from './ui/button';
import { UserPlus, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import JoinRequestModal from './JoinRequestModal';
import { showNotification } from './ui/notification';
import GoogleLoginButton from './GoogleLoginButton';
import useAuth from '../hooks/useAuth';
import { courseStyles } from '../config/courseStyles';

const AuthButton = ({ courseType }) => {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, session, signOut, loading } = useAuth();

  const styles = courseStyles[courseType] || courseStyles.cs;

  const handleJoinRequest = async () => {
    if (!session) {
      setShowLoginModal(true);
    } else {
      setShowJoinModal(true);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLoginSuccess = (data) => {
    setShowLoginModal(false);
    // If the user just logged in and wants to join as a tutor, show the join modal
    if (!session) {
      setTimeout(() => {
        setShowJoinModal(true);
      }, 1000);
    }
  };

  const handleLoginError = (error) => {
    // Error is already handled in the GoogleLoginButton component
    setShowLoginModal(false);
  };

  return (
    <div className="flex gap-1 sm:gap-2">
      <Button
        onClick={handleJoinRequest}
        className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base ${styles.buttonPrimary}`}
        size="sm"
      >
        <UserPlus className="h-4 w-4" />
        <span className="hidden sm:inline">
          {!session ? 'הצטרף כמורה' : 'בקשת הצטרפות'}
        </span>
      </Button>

      {session && (
        <Button
          variant="outline"
          onClick={handleLogout}
          disabled={isLoggingOut || loading}
          className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base shadow-md ${styles.buttonSecondary}`}
          size="sm"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">
            {isLoggingOut ? '...מתנתק' : 'התנתקות'}
          </span>
        </Button>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-center">התחברות</h2>
            <p className="mb-4 text-center">
              לא אוהבים רובוטים 😉
              <br />
              כדי למנוע ספאם ולהבטיח קהילה נעימה באתר,
              <br />
              אנחנו משתמשים בהתחברות פשוטה עם גוגל.
            </p>
            <GoogleLoginButton 
              onSuccess={handleLoginSuccess} 
              onError={handleLoginError} 
            />
            
            <button
              onClick={() => setShowLoginModal(false)}
              className="w-full mt-4 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none"
            >
              ביטול
            </button>
          </div>
        </div>
      )}

      <JoinRequestModal 
        isOpen={showJoinModal} 
        onClose={() => setShowJoinModal(false)}
        courseType={courseType}
        session={session}
      />
    </div>
  );
};

export default AuthButton;