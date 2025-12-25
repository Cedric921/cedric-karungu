import React from 'react';
import { useTranslations } from 'next-intl';
import { Icons } from '../constants';
import { useScrollAnimation } from '../hooks';

const Contact: React.FC = () => {
  const t = useTranslations();
  const { ref, isVisible } = useScrollAnimation(0.1);

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
    <section id="contact" className="py-24 relative overflow-hidden scroll-mt-28 bg-white dark:bg-[#050505] transition-colors duration-300" ref={ref}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-900/10 rounded-full blur-[120px] -z-10 hidden dark:block" />

      <div className="max-w-4xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block px-4 py-1 rounded-full bg-accent-100 dark:bg-white/5 border border-accent-200 dark:border-white/10 text-accent-700 dark:text-accent-400 text-sm font-medium mb-4">{t('contact.title')}</span>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">{t('contact.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">{t('contact.description')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className={`md:col-span-1 space-y-4 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="bg-gray-50 dark:bg-[#111] p-6 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-accent-500/30 transition-all shadow-sm dark:shadow-none">
              <div className="bg-accent-100 dark:bg-accent-500/10 w-10 h-10 rounded-lg flex items-center justify-center text-accent-600 dark:text-accent-500 mb-4"><Icons.Mail /></div>
              <h4 className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t('contact.email')}</h4>
              <p className="text-gray-900 dark:text-white font-medium text-sm">ckarungu921@gmail.com</p>
            </div>

            <div className="bg-gray-50 dark:bg-[#111] p-6 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-accent-500/30 transition-all shadow-sm dark:shadow-none">
              <div className="bg-accent-100 dark:bg-accent-500/10 w-10 h-10 rounded-lg flex items-center justify-center text-accent-600 dark:text-accent-500 mb-4"><Icons.Smartphone /></div>
              <h4 className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t('contact.phone')}</h4>
              <p className="text-gray-900 dark:text-white font-medium text-sm">+243 970 509 466</p>
            </div>

            <div className="bg-gray-50 dark:bg-[#111] p-6 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-accent-500/30 transition-all shadow-sm dark:shadow-none">
              <div className="bg-accent-100 dark:bg-accent-500/10 w-10 h-10 rounded-lg flex items-center justify-center text-accent-600 dark:text-accent-500 mb-4"><Icons.CheckCircle /></div>
              <h4 className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t('contact.availabilityTitle')}</h4>
              <p className="text-gray-900 dark:text-white font-medium text-sm flex items-center gap-2"><span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></span>{t('contact.availabilityStatus')}</p>
            </div> 
          </div>

          <div className={`md:col-span-2 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 dark:bg-[#111] p-8 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs text-gray-500 dark:text-gray-400 ml-1">{t('contact.name')}</label>
                  <input type="text" name="name" required placeholder={t('contact.namePlaceholder')} className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs text-gray-500 dark:text-gray-400 ml-1">{t('contact.email')}</label>
                  <input type="email" name="email" required placeholder={t('contact.emailPlaceholder')} className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-xs text-gray-500 dark:text-gray-400 ml-1">{t('contact.subject')}</label>
                <input type="text" name="subject" required placeholder={t('contact.subjectPlaceholder')} className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600" />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs text-gray-500 dark:text-gray-400 ml-1">{t('contact.message')}</label>
                <textarea name="message" required placeholder={t('contact.messagePlaceholder')} rows={4} className="w-full bg-white dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-gray-600"></textarea>
              </div>

              <button type="submit" className="w-full py-4 rounded-xl bg-accent-600 hover:bg-accent-500 text-white font-bold transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-accent-600/20">{t('contact.sendMessage')}<Icons.Mail /></button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
