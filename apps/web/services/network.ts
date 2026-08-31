import { apiClient } from "@/lib/api-client";
import { NETWORK_CONTACTS } from "@/mock/network";
import { latency, sleep } from "@/lib/sleep";
import { commIdToKey, unwrap, type BackendCommunaute } from "@/lib/adapters";
import type { CountryCode } from "@/types";
import type { NetworkContact } from "@/mock/network";

function adapt(c: BackendCommunaute, idx: number): NetworkContact {
  const code = (c.code ?? "").toUpperCase();
  const country: CountryCode =
    (code === "ART" ? "NG" : code === "MUSIQUE" ? "NG" : code === "CINEMA" ? "CI" : code === "MODE" ? "MA" : code === "DANSE" ? "SN" : code === "LITTERATURE" ? "FR" : "FR");
  const prenom = c.libelle?.split(" ")[0] ?? `Communauté ${idx + 1}`;
  return {
    id: String(c.id),
    initials: (prenom[0] ?? "C").toUpperCase() + ((prenom[1] ?? c.code?.[1] ?? "C") as string).toUpperCase(),
    name: c.libelle ?? `Communauté #${c.id}`,
    role: "Créateur",
    community: commIdToKey(c.id) as NetworkContact["community"],
    country,
    isFollowing: c.is_active ?? true,
  };
}

export async function getNetwork(): Promise<NetworkContact[]> {
  try {
    const data = await apiClient.get<BackendCommunaute[]>(
      "/communaute?subscribed_by_user_id=me"
    );
    return unwrap(data).map(adapt);
  } catch {
    await sleep(latency());
    return NETWORK_CONTACTS;
  }
}

export async function toggleFollow(id: string): Promise<void> {
  try {
    await apiClient.post(`/communaute/${id}/subscribe`);
  } catch {
    await sleep(latency());
    const c = NETWORK_CONTACTS.find((x) => x.id === id);
    if (c) c.isFollowing = !c.isFollowing;
  }
}