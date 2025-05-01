import React from "react";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

const LogoutButton = ({ styles, auth }) => {
    return (
      <motion.button
        onClick={auth.signOut}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-2 px-4 py-2 ${styles.buttonSecondary} font-bold text-md rounded-md whitespace-nowrap`}
      >
          <LogOut className="h-4 w-4" />
          <span className="inline">
            התנתקות
          </span>
      </motion.button>
    )
  };

  export default LogoutButton;