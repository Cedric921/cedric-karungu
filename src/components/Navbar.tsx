"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Icons } from "../constants";
import { useTheme } from "../hooks";
import Logo from "./ui/Logo";
import RollText from "./fx/RollText";

const LOCALES = ["en", "fr", "es"] as const;

/** Minimal top bar: wordmark, section links, language and theme. */
const Navbar: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/` || pathname === "/";

  const links = [
    { id: "about", label: t("nav.about") },
    { id: "skills", label: t("nav.skills") },
    { id: "portfolio", label: t("nav.projects") },
    { id: "experience", label: t("nav.experience") },
    { id: "contact", label: t("nav.contact") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in the middle of the viewport.
  useEffect(() => {
    if (!isHome) return;
    const observers = links.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const io = new IntersectionObserver(([e]) => e.isIntersecting && setActive(id), {
        rootMargin: "-45% 0px -50% 0px",
      });
      io.observe(el);
      return io;
    });
    return () => observers.forEach((o) => o?.disconnect());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHome, pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const go = (e: React.MouseEvent, id: string) => {
    setOpen(false);
    if (!isHome) return; // plain navigation to /locale#id
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", `#${id}`);
    }
  };

  const switchLocale = (next: string) => {
    router.push(pathname.replace(/^\/[a-z]{2}(?=\/|$)/, `/${next}`) + window.location.hash);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "border-b hairline bg-canvas/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <nav className="wrap flex h-16 items-center justify-between gap-6">
        <Link href={`/${locale}`} aria-label="Cédric Karungu — home" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`/${locale}#${l.id}`}
                onClick={(e) => go(e, l.id)}
                aria-current={active === l.id ? "true" : undefined}
                className={`group relative text-sm transition-colors ${active === l.id ? "text-ink" : "text-muted"}`}
              >
                <RollText>{l.label}</RollText>
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent-500 transition-all duration-300 ${
                    active === l.id ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <label htmlFor="locale" className="sr-only">
            {t("common.language")}
          </label>
          <select
            id="locale"
            value={locale}
            onChange={(e) => switchLocale(e.target.value)}
            className="cursor-pointer appearance-none rounded-md bg-transparent px-2 py-1.5 font-mono text-xs uppercase text-muted hover:text-ink focus:outline-none"
          >
            {LOCALES.map((l) => (
              <option key={l} value={l} className="bg-canvas text-ink">
                {l.toUpperCase()}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={toggle}
            aria-label={t("ui.toggleTheme")}
            className="rounded-md p-2 text-muted transition-colors hover:text-ink [&_svg]:h-[18px] [&_svg]:w-[18px]"
          >
            {theme === "dark" ? <Icons.Sun /> : <Icons.Moon />}
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={t("ui.menu")}
            className="rounded-md p-2 text-ink md:hidden [&_svg]:h-5 [&_svg]:w-5"
          >
            {open ? <Icons.X /> : <Icons.Menu />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="h-[calc(100dvh-4rem)] border-t hairline bg-canvas md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="wrap flex flex-col pt-6">
              {links.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i }}
                  className="border-b hairline"
                >
                  <a
                    href={`/${locale}#${l.id}`}
                    onClick={(e) => go(e, l.id)}
                    className="flex items-baseline justify-between py-4"
                  >
                    <span className="h-display text-3xl">{l.label}</span>
                    <span className="label">{String(i + 1).padStart(2, "0")}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
