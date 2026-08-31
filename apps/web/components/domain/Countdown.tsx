"use client";

import { useCountdown } from "@/hooks/useCountdown";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

type CountdownProps = {
  target: Date;
};

export function Countdown({ target }: CountdownProps) {
  const { days, hours, minutes, seconds, isFinished } = useCountdown(target);

  if (isFinished) {
    return (
      <div className="text-center text-h2 font-bold text-gold">Le festival a commencé 🎉</div>
    );
  }

  return (
    <div className="flex flex-wrap items-end justify-center gap-x-8 gap-y-4">
      {(
        [
          { value: pad(days), label: "JOURS" },
          { value: pad(hours), label: "HRS" },
          { value: pad(minutes), label: "MIN" },
          { value: pad(seconds), label: "SEC" },
        ] as const
      ).map((b) => (
        <div key={b.label} className="text-center">
          <div className="text-display font-extrabold text-gold tabular-nums leading-none">
            {b.value}
          </div>
          <div className="mt-3 text-eyebrow uppercase tracking-[0.2em] text-text-muted">
            {b.label}
          </div>
        </div>
      ))}
    </div>
  );
}
