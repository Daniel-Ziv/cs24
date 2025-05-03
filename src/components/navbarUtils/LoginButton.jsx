import React from "react";
import { motion } from "framer-motion";
import handleLogin from "../../core/handleLogin";

const LoginButton = ({ onSuccess, onError, styles }) => {
    return (
      <motion.button
        onClick={() => handleLogin({ onError })}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-4 py-2 bg-gradient-to-r ${styles.buttonLoginGradient} text-white font-bold text-md rounded-md whitespace-nowrap`}
      >
        התחברות
      </motion.button>
    );
  };

  export default LoginButton;