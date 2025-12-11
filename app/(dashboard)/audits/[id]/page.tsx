import { redirect } from "next/navigation"

export default async function AuditDetailsPage({ params }: { params: { id: string } }) {
  // Redirect to execution view by default
  redirect(`/audits/${params.id}/execution`)
}
