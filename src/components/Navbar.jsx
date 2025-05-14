import { motion } from "framer-motion";
import { useState } from "react";
import { FiMenu, FiArrowLeft } from "react-icons/fi";
import { courseStyles } from '../config/courseStyles';
import useAuth from "../hooks/useAuth";
import NavbarLink from "./navbarUtils/NavbarLink";
import DropdownMenuLink from "./navbarUtils/DropdownMenuLink";
import LoginButton from "./navbarUtils/LoginButton";
import LogoutButton from "./navbarUtils/LogoutButton";
import Logo from "./navbarUtils/Logo";
import menuVariants from "./navbarUtils/menuVariants";
import Avatar from "./Avatar";

const Navbar = ({ courseType = 'cs'}) => {
  const [isOpen, setIsOpen] = useState(false);
  const styles = courseStyles[courseType] || courseStyles.cs;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white p-3 shadow-md flex items-center justify-between">
      <NavRightSection setIsOpen={setIsOpen} styles={styles} />
      <NavLeftSection styles={styles} courseType={courseType} />
      <NavDropdownMenu isOpen={isOpen} styles={styles} />
    </nav>
  );
};

const NavRightSection = ({ setIsOpen, styles }) => {
  return (
    <div className="flex items-center gap-6 lg:mr-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="block lg:hidden text-gray-950 text-2xl"
        onClick={() => setIsOpen((pv) => !pv)}
      >
        <FiMenu size={32}/>
      </motion.button>
      <Logo styles={styles} />
      <NavbarLink text="ראשי" styles={styles} to="/" />
      <NavbarLink text="מחשבון ציונים" styles={styles} to="/gpa" />
      <NavbarLink text="אודות" styles={styles} to="/about" />
    </div>
  );
};

const NavLeftSection = ({ styles, courseType }) => {
  const auth = useAuth();

  return (
    <div className="flex items-center gap-4 ml-6">
      {auth.session ? (
        <Avatar courseType={courseType} />
      ) : (
        <LoginButton styles={styles} />
      )}
    </div>
  );
};

const NavDropdownMenu = ({ isOpen, styles }) => {
  return (
    <motion.div
      variants={menuVariants}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      className="absolute p-5 bg-white shadow-lg left-0 right-0 top-full origin-top flex flex-col gap-4 lg:hidden"
    >
    <DropdownMenuLink text="ראשי" styles={styles} to="/" />
    <DropdownMenuLink text="מחשבון ציונים" styles={styles} to="/gpa" />
    <DropdownMenuLink text="אודות" styles={styles} to="/about" />
    </motion.div>
  );
};

export default Navbar;