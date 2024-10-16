import React from 'react'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CalendarPlus, CalendarRange } from 'lucide-react';
import { db } from '@/drizzle/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
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
        (<>events</>) :
        (<div className='flex flex-col items-center gap-4'>
          <CalendarRange className='size-16' />
          You don't have any events yet. Create your first event to get started!
          <Button size="lg" className='text-lg' asChild>
            <Link href='events/new'><CalendarPlus className='mr-4 size-6' />New Event</Link>
          </Button>
        </div>)
      }
    </>
  )
}

export default EventsPage