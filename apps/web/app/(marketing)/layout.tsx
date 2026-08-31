import type { Metadata } from "next";
import "./../globals.css";
import { FESTIVAL_YEAR } from "@/constants/festival";

export const metadata: Metadata = {
  title: `Africa Future Festival ${FESTIVAL_YEAR} — Édition ${FESTIVAL_YEAR}`,
  description: `Le plus grand festival des industries créatives africaines. Abidjan, 19 & 20 Août ${FESTIVAL_YEAR}.`,
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-bg text-text min-h-screen">{children}</div>
  );
}
