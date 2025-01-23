import { EventForm } from "@/components/forms/EventForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@clerk/nextjs/server"
import { notFound, redirect } from "next/navigation";
import { db } from "@/Drizzle/db"


export const revalidate = 0;

export default async function EditEventPage({params: {eventId},} : {params : {eventId: string}}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in"); // Use `redirect` from `next/navigation` for server-side redirects
    // return null;
  }
  
  const event = await db.query.EventTable.findFirst({
    where: ({ id, clerkUserId }, { and, eq }) =>
      and(eq(clerkUserId, userId), eq(id, eventId)),
  })
 
  if (event ==  null) {
    return notFound();
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Edit Event</CardTitle>
      </CardHeader>
      <CardContent>
        <EventForm event={{...event, description: event.description || undefined}}/>
      </CardContent>
    </Card>
  )
}