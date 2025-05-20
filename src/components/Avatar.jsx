import { useState, useEffect, useRef } from 'react';
import { fetchAvatar } from '../lib/avatar';
import StaggeredDropDown from './StaggeredDropDown';
import { courseStyles } from '../config/courseStyles';
import { supabase } from '../lib/supabase';

const Avatar = ({ courseType = 'cs' }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [userInitials, setUserInitials] = useState('');
  const [imgError, setImgError] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const styles = courseStyles[courseType] || courseStyles.cs;

  useEffect(() => {
    const getAvatar = async () => {
      const url = await fetchAvatar();
      setAvatarUrl(url);
      
      // Get user email for initials fallback
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        const initials = user.email
          .split('@')[0]
          .split(/[._-]/)
          .map(part => part[0]?.toUpperCase() || '')
          .join('')
          .slice(0, 2);
        setUserInitials(initials);
      }
    };
    
    getAvatar();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleImageError = () => {
    setImgError(true);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <div 
        onClick={() => setOpen(prev => !prev)}
        className="cursor-pointer"
      >
        {avatarUrl && !imgError ? (
          <img
            src={avatarUrl}
            alt="User avatar"
            onError={handleImageError}
            className={`w-10 h-10 rounded-full object-cover border-2 ${styles.cardBorderStrong}`}
          />
        ) : (
          <div className={`w-10 h-10 rounded-full ${styles.bgLight} flex items-center justify-center`}>
            <span className={`text-lg font-semibold ${styles.iconColor}`}>
              {userInitials || '?'}
            </span>
          </div>
        )}
      </div>
      <StaggeredDropDown open={open} setOpen={setOpen} courseType={courseType} />
    </div>
  );
};

export default Avatar; 