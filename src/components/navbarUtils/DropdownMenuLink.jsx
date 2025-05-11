import React from "react";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import menuLinkVariants from "./menuLinkVariants";
import menuLinkArrowVariants from "./menuLinkArrowVariants";

const DropdownMenuLink = ({ text, styles, to = "#" }) => {
  return (
    <motion.div variants={menuLinkVariants}>
      <Link
        to={to}
        rel="nofollow"
        className="h-[30px] overflow-hidden font-bold text-lg flex items-start gap-2"
      >
        <motion.span variants={menuLinkArrowVariants}>
            <FiArrowLeft className="h-[30px] text-gray-950"/>
        </motion.span>
        <motion.div whileHover={{ y: -30 }}>
          <span className={`flex items-center h-[30px] ${styles.textColor}`}>{text}</span>
          <span className={`flex items-center h-[30px] ${styles.linksIconColor}`}>
            {text}
          </span>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default DropdownMenuLink;