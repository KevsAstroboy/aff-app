import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

type Option = { value: string; label: string };

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  options: Option[];
  placeholder?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, placeholder, className, ...rest }, ref) => (
    <div className="relative w-full">
      <select
        ref={ref}
        className={cn(
          "w-full h-12 pl-4 pr-11 rounded-lg bg-surface-raised border border-border text-text appearance-none transition-all duration-150 focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold-soft",
          className
        )}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-surface">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-subtle pointer-events-none"
        aria-hidden="true"
      />
    </div>
  )
);
Select.displayName = "Select";
