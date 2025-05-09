import { useState, useEffect, useRef } from 'react';
import { fetchAvatar } from '../lib/avatar';
import StaggeredDropDown from './StaggeredDropDown';
import { courseStyles } from '../config/courseStyles';

const Avatar = ({ courseType = 'cs' }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const styles = courseStyles[courseType] || courseStyles.cs;

  useEffect(() => {
    const getAvatar = async () => {
      const url = await fetchAvatar();
      setAvatarUrl(url);
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

  return (
    <div ref={dropdownRef} className="relative">
      <div 
        onClick={() => setOpen(prev => !prev)}
        className="cursor-pointer"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="User avatar"
            className={`w-10 h-10 rounded-full object-cover border-2 ${styles.cardBorderStrong}`}
          />
        ) : (
          <div className={`w-10 h-10 rounded-full ${styles.bgLight} flex items-center justify-center`}>
            <span className={`text-lg font-semibold ${styles.iconColor}`}>
              {/* Default avatar with first letter of email */}
              ?
            </span>
          </div>
        )}
      </div>
      <StaggeredDropDown open={open} setOpen={setOpen} courseType={courseType} />
    </div>
  );
};

export default Avatar; 