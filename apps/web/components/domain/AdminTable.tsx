import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { EmptyState } from "./EmptyState";

export type AdminColumn<T> = {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  width?: string;
  align?: "left" | "right" | "center";
  className?: string;
};

type AdminTableProps<T> = {
  columns: AdminColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  actions?: (row: T) => ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
};

export function AdminTable<T>({
  columns,
  rows,
  rowKey,
  actions,
  emptyTitle = "Aucun élément",
  emptyDescription,
  className,
}: AdminTableProps<T>) {
  if (rows.length === 0) {
    return (
      <EmptyState title={emptyTitle} description={emptyDescription} className={className} />
    );
  }

  return (
    <div className={cn("rounded-2xl border border-border bg-surface overflow-hidden", className)}>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-body">
          <thead>
            <tr className="border-b border-border">
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={cn(
                    "px-5 py-4 text-left text-eyebrow uppercase tracking-[0.18em] text-text-muted font-semibold whitespace-nowrap",
                    c.align === "right" && "text-right",
                    c.align === "center" && "text-center",
                    c.width
                  )}
                >
                  {c.header}
                </th>
              ))}
              {actions && (
                <th
                  scope="col"
                  className="px-5 py-4 text-right text-eyebrow uppercase tracking-[0.18em] text-text-muted font-semibold whitespace-nowrap"
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={rowKey(row)}
                className="border-b border-border last:border-b-0 hover:bg-overlay transition-colors"
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={cn(
                      "px-5 py-4 align-middle",
                      c.align === "right" && "text-right",
                      c.align === "center" && "text-center",
                      c.className
                    )}
                  >
                    {c.cell(row)}
                  </td>
                ))}
                {actions && (
                  <td className="px-5 py-4 align-middle">
                    <div className="flex items-center justify-end gap-2">{actions(row)}</div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
