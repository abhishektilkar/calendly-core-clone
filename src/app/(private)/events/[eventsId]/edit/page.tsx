import EventsForm from "@/components/forms/EventsForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/drizzle/db";
import { auth } from "@clerk/nextjs/server"
import { notFound, redirect } from "next/navigation";

export const revalidate = 0;

export default async function EditEventsPage({ params } : { params: { eventsId: string}} ) {
    const { eventsId } = params;
    const { userId } = auth();
    if (userId == null) redirect('/');

    const event = await db.query.EventsTable.findFirst({
        where: ({id, clerkUserId}, { and, eq }) => 
            and(eq(clerkUserId, userId), eq(id, eventsId))
    })
    console.log('events123@', event)

    if (!event) notFound()

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>New Event</CardTitle>
      </CardHeader>
      <CardContent>
        <EventsForm event={event}/>
      </CardContent>
    </Card>
  )
}