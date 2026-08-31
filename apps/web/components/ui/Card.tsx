import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  featured?: boolean;
  children: ReactNode;
};

export function Card({ featured, className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-surface border p-6",
        featured ? "border-gold/40" : "border-border",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
