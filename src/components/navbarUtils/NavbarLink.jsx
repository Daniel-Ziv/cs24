import React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const NavbarLink = ({ text, styles, to }) => {
  return (
    <NavLink
      to={to}
      rel="nofollow"
      className="hidden lg:block h-[30px] overflow-hidden font-bold text-lg"
    >
      <motion.div whileHover={{ y: -30 }}>
        <span className={`flex items-center h-[30px] ${styles.textColor}`}>{text}</span>
        <span className={`flex items-center h-[30px] ${styles.linksIconColor}`}>
          {text}
        </span>
      </motion.div>
    </NavLink>
  );
};

export default NavbarLink;