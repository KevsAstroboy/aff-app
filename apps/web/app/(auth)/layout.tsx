import type { Metadata } from "next";
import { FESTIVAL_YEAR } from "@/constants/festival";

export const metadata: Metadata = {
  title: `AFF ${FESTIVAL_YEAR} — Authentification`,
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-bg min-h-screen">{children}</div>;
}
