import { useState } from "react";
import { UserPlus } from 'lucide-react';
import { Button } from './ui/button';
import { courseStyles } from '../config/courseStyles';
import { LogOut } from "lucide-react";
import useAuth from '../hooks/useAuth';
import JoinRequestModal from './JoinRequestModal';
import React from "react";
import LoginModal from "./LoginModal";

const AuthButton = ({ courseType }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const { session, signOut } = useAuth();
  
  const styles = courseStyles[courseType] || courseStyles.cs;

  const handleJoinRequest = () => {
    if (session) {
      setShowJoinModal(true);
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <>
    <div className="flex gap-1 sm:gap-2">
      <Button
        onClick={handleJoinRequest}
        className={`flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-2 h-9 text-sm sm:text-base ${styles.buttonPrimary}`}
      >
        <UserPlus className="h-4 w-4" />
        <span className="hidden sm:inline">
          { session ? 'בקשת הצטרפות' : 'הצטרף כמורה' }
        </span>
      </Button>

      {session && (
        <Button
          variant="outline"
          onClick={signOut}
          className={`flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-2 h-9 text-sm sm:text-base shadow-md ${styles.buttonSecondary}`}
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">
            התנתק
          </span>
        </Button>
      )}
      </div>

      <LoginModal isOpen={showLoginModal} setIsOpen={setShowLoginModal} styles={styles} />
      <JoinRequestModal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} courseType={courseType} session={session} />
    </>
  );
};

export default AuthButton;