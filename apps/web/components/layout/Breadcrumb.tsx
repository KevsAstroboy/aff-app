import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Fragment } from "react";

export type Crumb = {
  label: string;
  href?: string;
};

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Fil d'Ariane">
      <ol className="flex flex-wrap items-center gap-1.5 text-small text-text-muted">
        {items.map((c, i) => (
          <Fragment key={`${c.label}-${i}`}>
            {i > 0 && <ChevronRight className="h-3 w-3 text-text-subtle" aria-hidden="true" />}
            <li>
              {c.href ? (
                <Link href={c.href} className="hover:text-text transition-colors">
                  {c.label}
                </Link>
              ) : (
                <span className="text-text">{c.label}</span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
