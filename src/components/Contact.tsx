import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Icons } from "../constants";
import { useScrollAnimation } from "../hooks";
import SectionHeader from "./SectionHeader";

const Contact: React.FC = () => {
  const t = useTranslations();
  const { ref, isVisible } = useScrollAnimation(0.1);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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

  const cardVariants = {
    rest: { y: 0, scale: 1 },
    hover: {
      y: -8,
      scale: 1.05,
      boxShadow: "0 20px 40px rgba(139, 92, 246, 0.22)",
      transition: { duration: 0.3 },
    },
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("name") as string | null)?.trim();
    const email = (formData.get("email") as string | null)?.trim();
    const subject = (formData.get("subject") as string | null)?.trim();
    const message = (formData.get("message") as string | null)?.trim();

    if (!name || !email || !subject || !message) {
      toast.error(t("contact.fillAllFields"), {
        description: "Tous les champs sont requis.",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t("contact.invalidEmail"), {
        description: "Vérifie le format de ton adresse e-mail.",
      });
      return;
    }

    const toastId = toast.loading("Envoi du message…", {
      description: "Sécurisation et acheminement en cours.",
    });

    (async () => {
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, subject, message }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || "Failed to send message");
        }
        toast.success(t("contact.sentSuccess") || "Message sent — thank you!", {
          id: toastId,
          description: `Je te recontacte sous 24h, ${name}.`,
          duration: 6000,
        });
        form.reset();
      } catch (err) {
        toast.error("Échec de l'envoi", {
          id: toastId,
          description: (err as Error)?.message || "Réessaie dans un instant.",
        });
      }
    })();
  };

  return (
    <section
      id="contact"
      className="py-24 relative overflow-hidden scroll-mt-28 bg-white dark:bg-[#100B17] transition-colors duration-300"
      ref={ref}
    >
      {/* Background animations */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] -z-10 hidden dark:block"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.16) 0%, rgba(245,158,11,0.08) 45%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <motion.div
        className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-5 hidden dark:block"
        style={{
          background:
            "radial-gradient(circle, rgba(245,158,11,0.22) 0%, transparent 70%)",
        }}
        animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <SectionHeader
          index={6}
          eyebrow={t("nav.getInTouch")}
          title={t("contact.title")}
          description={t("contact.description")}
          visible={isVisible}
        />

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {/* Info cards */}
          <motion.div
            className="md:col-span-1 space-y-4"
            variants={containerVariants}
          >
            {/* Email card */}
            <motion.div
              className="glass glass-hover p-6 rounded-2xl relative"
              variants={itemVariants}
              whileHover="hover"
              initial="rest"
              animate="rest"
              custom={cardVariants}
            >
              <span className="absolute top-3 right-4 font-mono text-[10px] tabular-nums text-gray-400 dark:text-gray-600">
                01
              </span>
              <motion.div
                className="bg-accent-100 dark:bg-accent-500/10 w-10 h-10 rounded-lg flex items-center justify-center text-accent-600 dark:text-accent-500 mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Icons.Mail />
              </motion.div>
              <h4 className="font-mono text-[10px] uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400 mb-1">
                {t("contact.email")}
              </h4>
              <p className="text-gray-900 dark:text-white font-medium text-sm hover:text-accent-600 dark:hover:text-accent-400 transition-colors break-all">
                ckarungu921@gmail.com
              </p>
            </motion.div>

            {/* Phone card */}
            <motion.div
              className="glass glass-hover p-6 rounded-2xl relative"
              variants={itemVariants}
              whileHover="hover"
              initial="rest"
              animate="rest"
              custom={cardVariants}
            >
              <span className="absolute top-3 right-4 font-mono text-[10px] tabular-nums text-gray-400 dark:text-gray-600">
                02
              </span>
              <motion.div
                className="bg-accent-100 dark:bg-accent-500/10 w-10 h-10 rounded-lg flex items-center justify-center text-accent-600 dark:text-accent-500 mb-4"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Icons.Smartphone />
              </motion.div>
              <h4 className="font-mono text-[10px] uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400 mb-1">
                {t("contact.phone")}
              </h4>
              <p className="text-gray-900 dark:text-white font-medium text-sm tabular-nums">
                +243 970 509 466
              </p>
            </motion.div>

            {/* Availability card */}
            <motion.div
              className="glass glass-hover p-6 rounded-2xl relative"
              variants={itemVariants}
              whileHover="hover"
              initial="rest"
              animate="rest"
              custom={cardVariants}
            >
              <span className="absolute top-3 right-4 font-mono text-[10px] tabular-nums text-gray-400 dark:text-gray-600">
                03
              </span>
              <motion.div
                className="bg-accent-100 dark:bg-accent-500/10 w-10 h-10 rounded-lg flex items-center justify-center text-accent-600 dark:text-accent-500 mb-4"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Icons.CheckCircle />
              </motion.div>
              <h4 className="font-mono text-[10px] uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400 mb-1">
                {t("contact.availabilityTitle")}
              </h4>
              <p className="text-gray-900 dark:text-white font-medium text-sm flex items-center gap-2">
                <motion.span
                  className="w-2 h-2 bg-accent-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {t("contact.availabilityStatus")}
              </p>
            </motion.div>
          </motion.div>

          {/* Contact form */}
          <motion.div className="md:col-span-2" variants={itemVariants}>
            <motion.form
              onSubmit={handleSubmit}
              className="glass space-y-4 p-8 rounded-3xl"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Name and Email row */}
              <motion.div
                className="grid grid-cols-2 gap-4"
                variants={containerVariants}
              >
                <motion.div className="space-y-2" variants={itemVariants}>
                  <label
                    htmlFor="name"
                    className="text-xs text-gray-500 dark:text-gray-400 ml-1"
                  >
                    {t("contact.name")}
                  </label>
                  <motion.input
                    type="text"
                    name="name"
                    required
                    placeholder={t("contact.namePlaceholder")}
                    className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                    whileFocus={{
                      borderColor: "rgb(139, 92, 246)",
                      boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.2)",
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>

                <motion.div className="space-y-2" variants={itemVariants}>
                  <label
                    htmlFor="email"
                    className="text-xs text-gray-500 dark:text-gray-400 ml-1"
                  >
                    {t("contact.email")}
                  </label>
                  <motion.input
                    type="email"
                    name="email"
                    required
                    placeholder={t("contact.emailPlaceholder")}
                    className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                    whileFocus={{
                      borderColor: "rgb(139, 92, 246)",
                      boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.2)",
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>
              </motion.div>

              {/* Subject */}
              <motion.div className="space-y-2" variants={itemVariants}>
                <label
                  htmlFor="subject"
                  className="text-xs text-gray-500 dark:text-gray-400 ml-1"
                >
                  {t("contact.subject")}
                </label>
                <motion.input
                  type="text"
                  name="subject"
                  required
                  placeholder={t("contact.subjectPlaceholder")}
                  className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  whileFocus={{
                    borderColor: "rgb(139, 92, 246)",
                    boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.2)",
                  }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>

              {/* Message */}
              <motion.div className="space-y-2" variants={itemVariants}>
                <label
                  htmlFor="message"
                  className="text-xs text-gray-500 dark:text-gray-400 ml-1"
                >
                  {t("contact.message")}
                </label>
                <motion.textarea
                  name="message"
                  required
                  placeholder={t("contact.messagePlaceholder")}
                  rows={4}
                  className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  whileFocus={{
                    borderColor: "rgb(139, 92, 246)",
                    boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.2)",
                  }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>

              {/* Submit button — Lume gradient */}
              <motion.button
                type="submit"
                className="group relative w-full py-4 rounded-xl bg-lume text-zinc-950 font-bold flex items-center justify-center gap-2 mt-4 shadow-lg shadow-accent-600/20 ring-accent-focus overflow-hidden transition-shadow"
                whileHover={{
                  scale: 1.02,
                  boxShadow:
                    "0 20px 40px rgba(139, 92, 246, 0.4), 0 10px 20px rgba(245, 158, 11, 0.22)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                variants={itemVariants}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                <span className="relative">{t("contact.sendMessage")}</span>
                <span className="relative inline-block transition-transform duration-200 group-hover:translate-x-1">
                  <Icons.Mail />
                </span>
              </motion.button>
            </motion.form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
