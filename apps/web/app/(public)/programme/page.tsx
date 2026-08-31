import { ProgrammeClient } from "./ProgrammeClient";
import { getProgramme } from "@/services/programme";

export const dynamic = 'force-dynamic';

export default async function ProgrammePage() {
  const events = await getProgramme();
  return <ProgrammeClient events={events} />;
}
