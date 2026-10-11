"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import Section, { useSectionTotal } from "./ui/Section";
import Reveal from "./ui/Reveal";
import { SECTION_TOTAL } from "./AboutMe";
import MagneticLetters from "./fx/MagneticLetters";
import RollText from "./fx/RollText";

const PHONE = "+243 970 509 466";

const Contact: React.FC = () => {
  const t = useTranslations();
  const [sending, setSending] = useState(false);
  const EMAIL = t("contact.email");
  // Contact is always last: its index is the total section count.
  const total = useSectionTotal(SECTION_TOTAL);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const get = (k: string) => (data.get(k) as string | null)?.trim() || "";
    const [name, email, subject, message] = ["name", "email", "subject", "message"].map(get);

    if (!name || !email || !subject || !message) {
      toast.error(t("contact.fillAllFields"));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error(t("contact.invalidEmail"));
      return;
    }

    setSending(true);
    const toastId = toast.loading(t("ui.sending"));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message, locale: document.documentElement.lang }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to send message");
      toast.success(t("contact.sentSuccess") || "Message sent — thank you!", { id: toastId, duration: 6000 });
      form.reset();
    } catch (err) {
      toast.error(t("common.error"), { id: toastId, description: (err as Error)?.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <Section
      id="contact"
      index={total}
      total={total}
      label={t("nav.contact")}
      intro={t("contact.description")}
      title={t("contact.title")}
    >
      <Reveal>
        <p className="max-w-2xl text-xl leading-relaxed text-muted">{t("ui.sayHello")}</p>
        <a
          href={`mailto:${EMAIL}`}
          data-inspect="a[href^=mailto]"
          className="accent-serif mt-6 inline-block break-all text-[clamp(1.9rem,5vw,3.5rem)] leading-tight"
        >
          <MagneticLetters text={EMAIL} />
        </a>
      </Reveal>

      <Reveal className="mt-10 grid gap-6 border-y hairline py-6 sm:grid-cols-3">
        <div>
          <p className="label">{t("contact.phone")}</p>
          <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="link mt-1 inline-block text-sm">
            {PHONE}
          </a>
        </div>
        <div>
          <p className="label">{t("contact.availabilityTitle")}</p>
          <p className="mt-1 flex items-center gap-2 text-sm text-ink">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> {t("contact.availabilityStatus")}
          </p>
        </div>
        <div>
          <p className="label">{t("footer.location")}</p>
          <p className="mt-1 text-sm text-ink">{t("footer.opportunity")}</p>
        </div>
      </Reveal>

      <Reveal>
        <p className="label mt-14">{t("ui.orForm")}</p>
        <form onSubmit={handleSubmit} className="mt-5 grid gap-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="name" label={t("contact.name")} placeholder={t("contact.namePlaceholder")} autoComplete="name" />
            <Field id="email" type="email" label={t("contact.email")} placeholder={t("contact.emailPlaceholder")} autoComplete="email" />
          </div>
          <Field id="subject" label={t("contact.subject")} placeholder={t("contact.subjectPlaceholder")} />
          <div>
            <label htmlFor="message" className="sr-only">
              {t("contact.message")}
            </label>
            <textarea id="message" name="message" rows={6} placeholder={t("contact.messagePlaceholder")} className="field resize-y" />
          </div>
          <div>
            <button type="submit" disabled={sending} className="btn-primary group">
              <RollText accent={false}>{sending ? t("ui.sending") : t("contact.sendMessage")}</RollText>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
        </form>
      </Reveal>
    </Section>
  );
};

function Field({
  id,
  label,
  type = "text",
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input id={id} name={id} type={type} placeholder={placeholder} autoComplete={autoComplete} className="field" />
    </div>
  );
}

export default Contact;
