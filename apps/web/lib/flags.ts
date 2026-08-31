const REGIONAL_INDICATORS: Record<string, string> = {
  CI: "🇨🇮",
  NG: "🇳🇬",
  GH: "🇬🇭",
  SN: "🇸🇳",
  KE: "🇰🇪",
  ZA: "🇿🇦",
  MA: "🇲🇦",
  EG: "🇪🇬",
  ET: "🇪🇹",
  TZ: "🇹🇿",
  CM: "🇨🇲",
  CD: "🇨🇩",
  FR: "🇫🇷",
  US: "🇺🇸",
  GB: "🇬🇧",
  CA: "🇨🇦",
};

export function flag(code: string | undefined): string {
  if (!code) return "🌍";
  return REGIONAL_INDICATORS[code.toUpperCase()] ?? "🌍";
}

export function countryName(code: string | undefined): string {
  if (!code) return "International";
  const names: Record<string, string> = {
    CI: "Côte d'Ivoire",
    NG: "Nigeria",
    GH: "Ghana",
    SN: "Sénégal",
    KE: "Kenya",
    ZA: "Afrique du Sud",
    MA: "Maroc",
    EG: "Égypte",
    ET: "Éthiopie",
    TZ: "Tanzanie",
    CM: "Cameroun",
    CD: "RD Congo",
    FR: "France",
    US: "États-Unis",
    GB: "Royaume-Uni",
    CA: "Canada",
  };
  return names[code.toUpperCase()] ?? code;
}
