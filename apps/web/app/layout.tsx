import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FESTIVAL_YEAR } from "@/constants/festival";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: `Africa Future Festival ${FESTIVAL_YEAR}`,
  description: `Abidjan — 19 & 20 Août ${FESTIVAL_YEAR}. Édition ${FESTIVAL_YEAR}.`,
};

const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem("aff-ui-theme");
    var theme = "dark";
    if (stored) {
      var parsed = JSON.parse(stored);
      if (parsed && parsed.state && (parsed.state.theme === "light" || parsed.state.theme === "dark")) {
        theme = parsed.state.theme;
      }
    }
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-bg text-text min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
