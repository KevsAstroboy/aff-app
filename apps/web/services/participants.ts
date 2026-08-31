import { PARTICIPANTS_BY_MASTERCLASS, type Participant } from "@/mock/participants";
import { latency, sleep } from "@/lib/sleep";

export async function getParticipants(masterclassId: string): Promise<Participant[]> {
  await sleep(latency());
  return PARTICIPANTS_BY_MASTERCLASS[masterclassId] ?? [];
}
