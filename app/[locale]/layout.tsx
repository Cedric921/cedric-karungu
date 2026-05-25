import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "sonner";
import en from "@/public/locales/en.json";
import fr from "@/public/locales/fr.json";
import es from "@/public/locales/es.json";

type Messages = typeof en;

const messages: Record<string, Messages> = {
  en,
  fr,
  es,
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fr" }, { locale: "es" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messagesForLocale = messages[locale];

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messagesForLocale}>
          {children}
          <Toaster
            position="bottom-right"
            theme="system"
            richColors
            closeButton
            toastOptions={{
              classNames: {
                toast:
                  "group toast group-[.toaster]:bg-white/90 dark:group-[.toaster]:bg-zinc-900/90 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-zinc-900 dark:group-[.toaster]:text-zinc-100 group-[.toaster]:border group-[.toaster]:border-zinc-200/60 dark:group-[.toaster]:border-white/10 group-[.toaster]:shadow-2xl",
                title: "font-medium",
                description:
                  "group-[.toast]:text-zinc-600 dark:group-[.toast]:text-zinc-400",
              },
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
