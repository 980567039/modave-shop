import './globals.css';
import './fonts.css';
import localFont from 'next/font/local'
import SessionProvider from './components/sessionProvider';
import { AuthUserProvider } from "./contexts/authUserProvider";
import { getServerSession } from "next-auth";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider } from "next-intl";
import { cookies } from "next/headers";
import enMessages from "@/messages/en.json";
import zhMessages from "@/messages/zh.json";

const headingFontExtraBold = localFont({
  src: '../public/fonts/Syne-ExtraBold.ttf',
  variable: '--font-syne-extra-bold' // This creates a CSS variable
})

const headingFontRegular = localFont({
  src: '../public/fonts/Syne-Medium.ttf',
  variable: '--font-syne-regular' // This creates a CSS variable
})

const headingFontMedium = localFont({
  src: '../public/fonts/Syne-Medium.ttf',
  variable: '--font-syne-medium' // This creates a CSS variable
})

const useGoogleFonts = process.env.NEXT_PUBLIC_FONT_PROVIDER === "google";

const localBodyFont = localFont({
  src: '../public/fonts/Syne-Regular.ttf',
  variable: '--font-manrope',
});

export const metadata = {
  title: "Nuvie Clothing",
  description: "All Your Clothing Needs",
};

const messagesByLocale = {
  en: enMessages,
  zh: zhMessages,
};

const supportedLocales = Object.keys(messagesByLocale);
const defaultLocale = "en";

export default async function RootLayout({ children }) {
  const session = await getServerSession();
  const cookieStore = await cookies();
  const requestedLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = supportedLocales.includes(requestedLocale)
    ? requestedLocale
    : defaultLocale;
  const bodyClassName = [
    useGoogleFonts ? "" : localBodyFont.variable,
    useGoogleFonts ? "" : localBodyFont.className,
    headingFontExtraBold.variable,
    headingFontMedium.variable,
    headingFontRegular.variable,
    "subpixel-antialiased",
  ].filter(Boolean).join(" ");

  return (
    <html lang={locale}>
      {useGoogleFonts && (
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap"
            rel="stylesheet"
          />
        </head>
      )}
      <body
        className={bodyClassName}
        style={useGoogleFonts ? {
          "--font-manrope": '"Manrope", sans-serif',
          fontFamily: 'var(--font-manrope)',
        } : undefined}
      >
        <SessionProvider session={session}>
          <AuthUserProvider>
            <NextIntlClientProvider locale={locale} messages={messagesByLocale[locale]}>
              {children}
              <Toaster />
            </NextIntlClientProvider>
          </AuthUserProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
