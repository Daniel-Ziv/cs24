import React from "react";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import menuLinkVariants from "./menuLinkVariants";
import menuLinkArrowVariants from "./menuLinkArrowVariants";

const DropdownMenuLink = ({ text, styles }) => {
    return (
        <motion.a
        variants={menuLinkVariants}
        rel="nofollow"
        href="#"
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
        </motion.a>
    );
};

export default DropdownMenuLink;