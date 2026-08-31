import { cn } from "@/lib/cn";
import { flag } from "@/lib/flags";
import { getBaseUrl } from "@/lib/api-client";

type AvatarProps = {
  initials: string;
  size?: "sm" | "md" | "lg" | "xl";
  country?: string;
  color?: string;
  src?: string | null;
  className?: string;
};

const SIZE: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "h-8 w-8 text-small",
  md: "h-10 w-10 text-small",
  lg: "h-16 w-16 text-body",
  xl: "h-32 w-32 text-h1",
};

const PALETTE = [
  "bg-domain-art",
  "bg-domain-musique",
  "bg-domain-cinema",
  "bg-domain-mode",
  "bg-domain-danse",
  "bg-domain-litterature",
  "bg-warn",
  "bg-purple",
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function mediaFileUrl(filePath?: string | null): string | null {
  if (!filePath) return null;
  const m = filePath.match(/:\d+\/(.+)$/);
  const objPath = m && m[1];
  if (!objPath) return null;
  return `${getBaseUrl()}/api/media/file?path=${encodeURIComponent(objPath)}`;
}

export function Avatar({ initials, size = "md", country, color, src, className }: AvatarProps) {
  const bg = color ?? PALETTE[hash(initials) % PALETTE.length];
  const url = mediaFileUrl(src);

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-full font-semibold text-bg shrink-0",
        SIZE[size],
        !url && bg,
        className
      )}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        initials
      )}
      {country && (
        <span
          className="absolute -bottom-0.5 -right-0.5 rounded-full text-[0.6em] leading-none ring-2 ring-bg"
          aria-hidden="true"
        >
          {flag(country)}
        </span>
      )}
    </div>
  );
}
