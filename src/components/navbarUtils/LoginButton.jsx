import React from "react";
import { supabase } from '../../lib/supabase';
import { showNotification } from '../ui/notification';
import { motion } from "framer-motion";

const LoginButton = ({ onSuccess, onError, styles }) => {
    const handleLogin = async () => {
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
            queryParams: { prompt: 'select_account' }
          }
        });
  
        if (error) {
          throw error;
        }
  
        if (data?.url) {
          window.location.href = data.url;
        }
      } catch (error) {
        console.error('Authentication error:', error);
        showNotification(error.message || 'שגיאה בהתחברות. אנא נסה שוב.', 'error');
        if (onError) onError(error);
      }
    };
  
    return (
      <motion.button
        onClick={handleLogin}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-4 py-2 bg-gradient-to-r ${styles.buttonLoginGradient} text-white font-bold text-md rounded-md whitespace-nowrap`}
      >
        התחברות
      </motion.button>
    );
  };

  export default LoginButton;