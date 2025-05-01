import React from "react";
import { motion } from "framer-motion";

const NavbarLink = ({ text, styles }) => {
  return (
    <a
      href="#"
      rel="nofollow"
      className="hidden lg:block h-[30px] overflow-hidden font-bold text-lg"
    >
      <motion.div whileHover={{ y: -30 }}>
        <span className={`flex items-center h-[30px] ${styles.textColor}`}>{text}</span>
        <span className={`flex items-center h-[30px] ${styles.linksIconColor}`}>
          {text}
        </span>
      </motion.div>
    </a>
  );
};

export default NavbarLink;