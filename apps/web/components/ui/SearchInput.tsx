"use client";

import { Search } from "lucide-react";
import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type SearchInputProps = InputHTMLAttributes<HTMLInputElement>;

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, ...rest }, ref) => (
    <div className="relative w-full">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-subtle pointer-events-none"
        aria-hidden="true"
      />
      <input
        ref={ref}
        type="search"
        className={cn(
          "w-full h-12 pl-11 pr-4 rounded-lg bg-surface-raised border border-border text-text placeholder:text-text-subtle transition-all duration-150 focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold-soft",
          className
        )}
        {...rest}
      />
    </div>
  )
);
SearchInput.displayName = "SearchInput";
