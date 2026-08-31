"use client";

import { useRef, type FormEvent } from "react";
import { cn } from "@/lib/cn";

type OTPInputProps = {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
};

export function OTPInput({ value, onChange, disabled }: OTPInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handle = (e: FormEvent<HTMLInputElement>, i: number) => {
    const input = e.currentTarget;
    const digit = input.value.replace(/[^0-9]/g, "");
    if (digit === "") {
      input.value = "";
      return;
    }
    input.value = digit;
    const newValue = value.split("");
    newValue[i] = digit;
    while (newValue.length < 6) newValue.push("");
    onChange(newValue.join(""));
    if (i < 5 && digit) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    i: number
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    onChange(pasted.padEnd(6, ""));
    const focusIdx = Math.min(pasted.length, 5);
    refs.current[focusIdx]?.focus();
  };

  return (
    <div className="flex items-center justify-center gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={value[i] ?? ""}
          onInput={(e) => handle(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={i === 0 ? handlePaste : undefined}
          aria-label={`Digit ${i + 1}`}
          className={cn(
            "h-14 w-12 rounded-lg bg-surface-raised border border-border text-center text-h2 font-bold text-text transition-all",
            "focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold-soft",
            "disabled:opacity-50"
          )}
        />
      ))}
    </div>
  );
}
