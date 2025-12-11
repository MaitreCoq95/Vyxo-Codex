import { getCodirMembers } from "@/lib/codir-data";
import CodirClientView from "@/components/codir/CodirClientView";

export const dynamic = 'force-dynamic';

export default async function VyxoCodirPage() {
  const members = await getCodirMembers();

  return <CodirClientView members={members} />;
}
