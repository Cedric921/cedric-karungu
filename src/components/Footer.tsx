import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Icons } from "../constants";
import { usePublicData } from "../hooks";
import type { SocialLinkItem } from "../lib/public-data";

const DEFAULT_SOCIAL_LINKS: SocialLinkItem[] = [
  { label: "GitHub", url: "https://github.com/Cedric921", icon: "Github" },
  {
    label: "LinkedIn",
    url: "https://linkedin.com/in/cedric-karungu",
    icon: "Linkedin",
  },
  { label: "Email", url: "mailto:ckarungu921@gmail.com", icon: "Mail" },
];

const Footer: React.FC = () => {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();

  const { data: socialLinks } = usePublicData<SocialLinkItem[]>(
    "/api/public/social-links",
    DEFAULT_SOCIAL_LINKS,
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const linkVariants = {
    rest: { x: 0 },
    hover: { x: 6 },
  };

  const iconVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: { scale: 1.2, rotate: 12, color: "rgb(124, 58, 237)" },
  };

  return (
    <motion.footer
      className="border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#050505] transition-colors duration-300 relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-5"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)",
        }}
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-5"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)",
        }}
        animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
          variants={containerVariants}
        >
          {/* Brand section */}
          <motion.div className="lg:col-span-1" variants={itemVariants}>
            <motion.a
              href="#"
              className="text-2xl font-bold tracking-tighter text-gray-900 dark:text-white inline-block mb-4 relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              CK<span className="text-accent-500">.</span>
            </motion.a>
            <motion.p
              className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed"
              variants={itemVariants}
            >
              {t("footer.tagline")}
            </motion.p>

            <motion.div className="space-y-3" variants={containerVariants}>
              <motion.a
                href="mailto:ckarungu921@gmail.com"
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 group"
                whileHover="hover"
                initial="rest"
                variants={linkVariants}
              >
                <motion.span
                  className="group-hover:scale-110 transition-transform duration-200"
                  variants={iconVariants}
                >
                  <Icons.Mail />
                </motion.span>
                <motion.span className="group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors duration-200">
                  ckarungu921@gmail.com
                </motion.span>
              </motion.a>

              <motion.div
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                variants={itemVariants}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{t("footer.location")}</span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Links section */}
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              {t("footer.links")}
            </h3>
            <motion.ul className="space-y-3" variants={containerVariants}>
              {[
                { name: t("nav.home"), href: "#home" },
                { name: t("nav.about"), href: "#about" },
                { name: t("nav.skills"), href: "#skills" },
                { name: t("nav.projects"), href: "#portfolio" },
                { name: t("nav.experience"), href: "#experience" },
                { name: t("nav.contact"), href: "#contact" },
              ].map((link) => (
                <motion.li key={link.name} variants={itemVariants}>
                  <motion.a
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 inline-block relative"
                    whileHover={{
                      color: "rgb(124, 58, 237)",
                      x: 4,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {link.name}
                  </motion.a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Featured Work section */}
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              {t("footer.featuredWork")}
            </h3>
            <motion.ul className="space-y-3" variants={containerVariants}>
              {[
                {
                  name: "AdminAtete",
                  url: "https://home-adminatete.vercel.app/",
                },
                { name: "CRES Startup", url: "https://le-cres.org/" },
                { name: "KADEA Academy", url: "https://www.kadea.academy/" },
                { name: "Ever Technologies Projects", url: "" },
                { name: "Buku My Class", url: "" },
              ].map((project) => (
                <motion.li key={project.name} variants={itemVariants}>
                  {project.url ? (
                    <motion.a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5 group hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
                    >
                      <motion.span className="group-hover:translate-x-0.5 transition-transform duration-200">
                        {project.name}
                      </motion.span>
                      <motion.span className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200">
                        <Icons.ExternalLink />
                      </motion.span>
                    </motion.a>
                  ) : (
                    <span className="text-sm text-gray-600 dark:text-gray-400 cursor-default">
                      {project.name}
                    </span>
                  )}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Tech Stack & Connect section */}
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              {t("footer.techStack")}
            </h3>
            <motion.div
              className="flex flex-wrap gap-2 mb-6"
              variants={containerVariants}
            >
              {[
                "PostgreSQL",
                "JavaScript",
                "Web Application",
                "RESTful API",
                "Git",
                "GitHub",
                "Database",
                "ExpressJS",
                "TypeScript",
                "Node.js",
                "React Native",
                "React",
                "Redux",
                "HTML5",
                "CSS 3",
              ].map((tech) => (
                <motion.span
                  key={tech}
                  className="text-xs px-2.5 py-1 bg-gray-200 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded border border-gray-300 dark:border-white/10 cursor-default"
                  whileHover={{
                    borderColor: "rgb(124, 58, 237)",
                    backgroundColor: "rgba(124, 58, 237, 0.1)",
                    scale: 1.05,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>

            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              {t("footer.connect")}
            </h3>
            <motion.div className="flex gap-4" variants={containerVariants}>
              {socialLinks.map((s, idx) => {
                const Icon =
                  (Icons[s.icon] as React.FC | undefined) ?? Icons.ExternalLink;
                const isExternal = !s.url.startsWith("mailto:");
                return (
                  <motion.a
                    key={(s._id as string | undefined) ?? `${s.label}-${idx}`}
                    href={s.url}
                    {...(isExternal
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="text-gray-500 dark:text-gray-500"
                    whileHover={{
                      scale: 1.2,
                      color: "rgb(124, 58, 237)",
                      rotate: idx % 2 === 0 ? -12 : 12,
                    }}
                    transition={{ duration: 0.2 }}
                    aria-label={s.label}
                  >
                    <Icon />
                  </motion.a>
                );
              })}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer bottom */}
      <motion.div
        className="border-t border-gray-200 dark:border-white/5 relative z-10"
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-center gap-4"
            variants={containerVariants}
          >
            <motion.p
              className="text-xs text-gray-500 dark:text-gray-500 text-center md:text-left"
              variants={itemVariants}
            >
              © {currentYear} Cédric Karungu. {t("footer.copyright")}
            </motion.p>
            <motion.div
              className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-500"
              variants={containerVariants}
            >
              <motion.span
                whileHover={{ color: "rgb(124, 58, 237)" }}
                transition={{ duration: 0.2 }}
              >
                {t("footer.role")}
              </motion.span>
              <span className="hidden sm:inline">•</span>
              <motion.span
                className="hidden sm:inline cursor-default"
                whileHover={{ color: "rgb(124, 58, 237)" }}
                transition={{ duration: 0.2 }}
              >
                {t("footer.opportunity")}
              </motion.span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
