import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Icons } from '../constants';
import { useScrollAnimation } from '../hooks';

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
      boxShadow: '0 20px 40px rgba(124, 58, 237, 0.15)',
      transition: { duration: 0.3 },
    },
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    (async () => {
      try {
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const name = (formData.get('name') as string | null)?.trim();
        const email = (formData.get('email') as string | null)?.trim();
        const subject = (formData.get('subject') as string | null)?.trim();
        const message = (formData.get('message') as string | null)?.trim();

        if (!name || !email || !subject || !message) {
          alert(t('contact.fillAllFields'));
          return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          alert(t('contact.invalidEmail'));
          return;
        }

        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, subject, message }),
        });

        const data = await res.json();
        if (!res.ok) {
          console.error('Contact error', data);
          alert(data.error || 'Failed to send message');
          return;
        }

        alert(t('contact.sentSuccess') || 'Message sent — thank you!');
        form.reset();
      } catch (err) {
        console.error('Contact submit error', err);
        alert('An error occurred while sending your message.');
      }
    })();
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden scroll-mt-28 bg-white dark:bg-[#100B17] transition-colors duration-300" ref={ref}>
      {/* Background animations */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] -z-10 hidden dark:block"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <motion.div
        className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-5 hidden dark:block"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
        }}
        animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          <motion.span
            className="inline-block px-4 py-1 rounded-full bg-accent-100 dark:bg-white/5 border border-accent-200 dark:border-white/10 text-accent-700 dark:text-accent-400 text-sm font-medium mb-4"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {t('contact.title')}
          </motion.span>

          <motion.h2
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300"
            variants={itemVariants}
          >
            {t('contact.title')}
          </motion.h2>

          <motion.p
            className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-lg"
            variants={itemVariants}
          >
            {t('contact.description')}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          {/* Info cards */}
          <motion.div className="md:col-span-1 space-y-4" variants={containerVariants}>
            {/* Email card */}
            <motion.div
              className="bg-gray-50 dark:bg-[#111] p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none"
              variants={itemVariants}
              whileHover="hover"
              initial="rest"
              animate="rest"
              custom={cardVariants}
            >
              <motion.div
                className="bg-accent-100 dark:bg-accent-500/10 w-10 h-10 rounded-lg flex items-center justify-center text-accent-600 dark:text-accent-500 mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Icons.Mail />
              </motion.div>
              <h4 className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t('contact.email')}</h4>
              <p className="text-gray-900 dark:text-white font-medium text-sm hover:text-accent-600 dark:hover:text-accent-400 transition-colors">
                ckarungu921@gmail.com
              </p>
            </motion.div>

            {/* Phone card */}
            <motion.div
              className="bg-gray-50 dark:bg-[#111] p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none"
              variants={itemVariants}
              whileHover="hover"
              initial="rest"
              animate="rest"
              custom={cardVariants}
            >
              <motion.div
                className="bg-accent-100 dark:bg-accent-500/10 w-10 h-10 rounded-lg flex items-center justify-center text-accent-600 dark:text-accent-500 mb-4"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Icons.Smartphone />
              </motion.div>
              <h4 className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t('contact.phone')}</h4>
              <p className="text-gray-900 dark:text-white font-medium text-sm">+243 970 509 466</p>
            </motion.div>

            {/* Availability card */}
            <motion.div
              className="bg-gray-50 dark:bg-[#111] p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none"
              variants={itemVariants}
              whileHover="hover"
              initial="rest"
              animate="rest"
              custom={cardVariants}
            >
              <motion.div
                className="bg-accent-100 dark:bg-accent-500/10 w-10 h-10 rounded-lg flex items-center justify-center text-accent-600 dark:text-accent-500 mb-4"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Icons.CheckCircle />
              </motion.div>
              <h4 className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t('contact.availabilityTitle')}</h4>
              <p className="text-gray-900 dark:text-white font-medium text-sm flex items-center gap-2">
                <motion.span
                  className="w-2 h-2 bg-accent-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {t('contact.availabilityStatus')}
              </p>
            </motion.div>
          </motion.div>

          {/* Contact form */}
          <motion.div className="md:col-span-2" variants={itemVariants}>
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4 bg-gray-50 dark:bg-[#111] p-8 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Name and Email row */}
              <motion.div className="grid grid-cols-2 gap-4" variants={containerVariants}>
                <motion.div className="space-y-2" variants={itemVariants}>
                  <label htmlFor="name" className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    {t('contact.name')}
                  </label>
                  <motion.input
                    type="text"
                    name="name"
                    required
                    placeholder={t('contact.namePlaceholder')}
                    className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                    whileFocus={{ borderColor: 'rgb(124, 58, 237)', boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.1)' }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>

                <motion.div className="space-y-2" variants={itemVariants}>
                  <label htmlFor="email" className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    {t('contact.email')}
                  </label>
                  <motion.input
                    type="email"
                    name="email"
                    required
                    placeholder={t('contact.emailPlaceholder')}
                    className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                    whileFocus={{ borderColor: 'rgb(124, 58, 237)', boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.1)' }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>
              </motion.div>

              {/* Subject */}
              <motion.div className="space-y-2" variants={itemVariants}>
                <label htmlFor="subject" className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                  {t('contact.subject')}
                </label>
                <motion.input
                  type="text"
                  name="subject"
                  required
                  placeholder={t('contact.subjectPlaceholder')}
                  className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  whileFocus={{ borderColor: 'rgb(124, 58, 237)', boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.1)' }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>

              {/* Message */}
              <motion.div className="space-y-2" variants={itemVariants}>
                <label htmlFor="message" className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                  {t('contact.message')}
                </label>
                <motion.textarea
                  name="message"
                  required
                  placeholder={t('contact.messagePlaceholder')}
                  rows={4}
                  className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  whileFocus={{ borderColor: 'rgb(124, 58, 237)', boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.1)' }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>

              {/* Submit button */}
              <motion.button
                type="submit"
                className="w-full py-4 rounded-xl bg-accent-600 text-white font-bold transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-accent-600/20"
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 20px 30px rgba(124, 58, 237, 0.3)',
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                variants={itemVariants}
              >
                {t('contact.sendMessage')}
                <Icons.Mail />
              </motion.button>
            </motion.form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
