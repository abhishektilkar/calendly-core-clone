import React from 'react'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CalendarPlus, CalendarRange } from 'lucide-react';
import { db } from '@/drizzle/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatEventDescription } from '@/lib/formatters';
import CopyEventsButton from '@/components/CopyEventsButton';
import { cn } from '@/lib/utils';
const EventsPage = async () => {

  const { userId } = auth();
  if(userId == null) redirect('/');
  
  const events = await db.query.EventsTable.findMany({
    where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
    orderBy: ({ createdAt }, { desc }) => desc(createdAt),
  });

  console.log('events123@', events)

  return (
    <>
      <div className='flex gap-4 items-baseline'>
          <h1 className='text-3xl lg:text-4xl xl:text-5xl font-semibold mb-6'>Events</h1>
          {/* <UserButton /> */}
          <Button asChild>
            <Link href='events/new'><CalendarPlus className='mr-4 size-6' />New Event</Link>
          </Button>
      </div>
      {
        events.length > 0 ?
        (<>
          <div className='grid gap-4 grid-cols-[repeat(auto-fill,minmax(400px,1fr))]'>
            {/* <h1>Events</h1> */}
            {events.map((eventers) => (
              <>
                <EventCard key={eventers.id} {...eventers} />
              </>
            ))}
          </div>
        </>) :
        (<div className='flex flex-col items-center gap-4'>
          <CalendarRange className='size-16' />
          You don&apos;t have any events yet. Create your first event to get started!
          <Button size="lg" className='text-lg' asChild>
            <Link href='events/new'><CalendarPlus className='mr-4 size-6' />New Event</Link>
          </Button>
        </div>)
      }
    </>
  )
}

export default EventsPage

type EventsCardProps = {
  id: string
  isActive: boolean
  name: string
  description: string | null
  durationInMinutes: number //string
  clerkUserId: string
}

export function EventCard({
  id,
  isActive,
  name,
  description,
  durationInMinutes,
  clerkUserId
}: EventsCardProps) {
  return <Card className={cn('flex flex-col', !isActive && 'border-secondary/50')}>
    <CardHeader className={cn(!isActive && 'opacity-50')}>
      <CardTitle>{name}</CardTitle>
      <CardDescription>{formatEventDescription(durationInMinutes)}</CardDescription>
    </CardHeader>
    {
      description && 
        <CardContent className={cn(!isActive && 'opacity-50')}>
          {description.slice(0,54)}
        </CardContent>
    }
    <CardFooter className='flex justify-end gap-2 mt-auto'>
      {
        isActive &&
        <CopyEventsButton variant='outline' eventId={id} clerkUserId={clerkUserId}/>
      }
      <Button asChild className=''>
        <Link href={`/events/${id}/edit`}>Edit</Link>
      </Button>
    </CardFooter>
  </Card>
}