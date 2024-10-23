import ScheduleForm from '@/components/forms/ScheduleForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/drizzle/db';
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'

const SachedulePage = async () => {

    const { userId } = auth();
    if (!userId) redirect('/');
    const schedule = await db.query.SchedulesTable.findFirst({
        where: (({ clerkUserId }, { eq }) => eq(clerkUserId, userId)),
        with: { avaliabilities: true }
    });

    console.log('schedule', schedule);

  return (
    <div>
        {/* SachedulePage */}
        
    </div>
  )
}

export default SachedulePage