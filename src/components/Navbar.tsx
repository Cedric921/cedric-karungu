import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Icons } from "../constants";
import LanguageSwitcher from "./LanguageSwitcher";

type NavbarProps = {
  theme: string;
  toggleTheme: () => void;
};

const NAV_SECTIONS = [
  "home",
  "about",
  "skills",
  "portfolio",
  "experience",
] as const;

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("home");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active section tracking via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    NAV_SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [pathname]);

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const locale = pathname.split("/")[1] || "en";
    const isHome =
      pathname === "/" ||
      pathname === `/${locale}` ||
      pathname === `/${locale}/`;
    if (isHome) {
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/${locale}${href}`);
    }
  };

  const navLinks = [
    { name: t("nav.home"), href: "#home", id: "home" },
    { name: t("nav.about"), href: "#about", id: "about" },
    { name: t("nav.skills"), href: "#skills", id: "skills" },
    { name: t("nav.projects"), href: "#portfolio", id: "portfolio" },
    { name: t("nav.experience"), href: "#experience", id: "experience" },
  ];

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 },
    },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3 px-4" : "py-4 px-0"
      }`}
    >
      <div
        className={`flex justify-between items-center mx-auto transition-all duration-300 px-6 ${
          scrolled
            ? "max-w-[calc(100%-2rem)] py-3 rounded-2xl glass"
            : "max-w-full py-3 bg-transparent border-b border-transparent"
        }`}
      >
        {/* Logo */}
        <motion.a
          href="#"
          onClick={(e) => handleLinkClick(e, "#about")}
          className="text-2xl font-bold tracking-tighter text-gray-900 dark:text-white ring-accent-focus rounded-md"
          whileHover={{ scale: 1.05, color: "rgb(124, 58, 237)" }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          CK<span className="text-accent-500">.</span>
        </motion.a>

        {/* Desktop Navigation */}
        <motion.div
          className="hidden md:flex items-center space-x-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`relative px-3 py-2 rounded-full text-sm font-medium transition-colors ring-accent-focus ${
                  isActive
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
                whileHover={{ y: -1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-dot"
                      className="inline-block w-1.5 h-1.5 rounded-full bg-accent-500 shadow-[0_0_8px_rgba(124,58,237,0.7)]"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 28,
                      }}
                    />
                  )}
                  {link.name}
                </span>
              </motion.a>
            );
          })}

          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <LanguageSwitcher />

            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300"
              whileHover={{
                scale: 1.1,
                backgroundColor: "rgba(124, 58, 237, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Icons.Sun /> : <Icons.Moon />}
            </motion.button>

            <motion.a
              href="#contact"
              onClick={(e) => handleLinkClick(e, "#contact")}
              className="px-5 py-2.5 rounded-full bg-accent-600 text-white text-sm font-semibold shadow-lg shadow-accent-600/20"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 30px rgba(124, 58, 237, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {t("nav.getInTouch")}
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Mobile Navigation Toggle */}
        <motion.div
          className="md:hidden flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Icons.Sun /> : <Icons.Moon />}
          </motion.button>

          <motion.button
            className="text-gray-900 dark:text-white"
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90 }}
                  animate={{ rotate: 0 }}
                  exit={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icons.X />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90 }}
                  animate={{ rotate: 0 }}
                  exit={{ rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icons.Menu />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`md:hidden glass transition-all duration-300 ${
              scrolled ? "rounded-3xl mt-2 mx-4" : "rounded-none mx-0"
            }`}
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="px-6 py-4 space-y-3">
              {navLinks.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="block py-2 text-sm font-medium text-gray-600 dark:text-gray-300"
                  variants={menuItemVariants}
                  whileHover={{ x: 4, color: "rgb(124, 58, 237)" }}
                  transition={{ duration: 0.2 }}
                >
                  {link.name}
                </motion.a>
              ))}

              <motion.div
                className="my-3 border-t border-gray-200 dark:border-white/10 pt-3"
                variants={menuItemVariants}
              >
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  Language
                </p>
                <LanguageSwitcher />
              </motion.div>

              <motion.a
                href="#contact"
                onClick={(e) => handleLinkClick(e, "#contact")}
                className="block mt-4 w-full px-5 py-2.5 rounded-full bg-accent-600 text-white text-sm font-semibold transition-all text-center"
                variants={menuItemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {t("nav.getInTouch")}
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
