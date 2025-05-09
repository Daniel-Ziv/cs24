import {
  FiLogOut,
  FiUser
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { courseStyles } from '../config/courseStyles';

const StaggeredDropDown = ({ open, setOpen, courseType = 'cs' }) => {
  const navigate = useNavigate();
  const styles = courseStyles[courseType] || courseStyles.cs;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    navigate("/");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
    setOpen(false);
  };

  return (
    <motion.div animate={open ? "open" : "closed"} className="absolute left-1/2 -translate-x-1/2">
      <motion.ul
        initial={wrapperVariants.closed}
        variants={wrapperVariants}
        style={{ originY: "top" }}
        className={`flex flex-col gap-3 p-3 rounded-lg bg-white shadow-xl absolute top-[calc(100%+5px)] left-1/2 -translate-x-1/2 w-56 overflow-hidden z-50 ${styles.cardBorder} border`}
      >
        <Option 
          onClick={handleDashboard}
          Icon={FiUser} 
          text="פרופיל"
          styles={styles}
        />
        <Option 
          onClick={handleLogout}
          Icon={FiLogOut} 
          text="התנתקות"
          styles={styles}
        />
      </motion.ul>
    </motion.div>
  );
};

const Option = ({ text, Icon, onClick, styles }) => {
  return (
    <motion.li
      variants={itemVariants}
      onClick={onClick}
      className={`flex items-center gap-3 w-full p-3 text-sm font-medium whitespace-nowrap rounded-md hover:${styles.bgLight} ${styles.textColor} hover:${styles.textSecondary} transition-colors cursor-pointer`}
    >
      <motion.span variants={actionIconVariants}>
        <Icon className={`w-5 h-5 ${styles.iconColor}`} />
      </motion.span>
      <span>{text}</span>
    </motion.li>
  );
};

const wrapperVariants = {
  open: {
    scaleY: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
    },
  },
  closed: {
    opacity: 0,
    y: -15,
    transition: {
      when: "afterChildren",
    },
  },
};

const actionIconVariants = {
  open: { scale: 1, y: 0 },
  closed: { scale: 0, y: -7 },
};

export default StaggeredDropDown; 