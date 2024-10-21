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
        with: {
            avaliabilities: true
            // {
            //     orderBy: (({ startTime }, { desc }) => desc(startTime))
            // }
        }
    });

  return (
    <div>
        {/* SachedulePage */}
        <Card className='max-w-md mx-auto'>
            <CardHeader>
                <CardTitle>
                    {/* New Event */}
                    Schedule
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScheduleForm schedule={schedule} />
            </CardContent>
        </Card>
    </div>
  )
}

export default SachedulePage