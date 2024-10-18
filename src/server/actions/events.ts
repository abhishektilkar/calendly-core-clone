"use server"

import { db } from '@/drizzle/db';
import { EventsTable } from '@/drizzle/schema';
import { eventsFormsSchema } from '@/schema/events'
import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import 'use-server'
import { string, z as zod } from 'zod'

export async function createEvent(unsafeData: zod.infer<typeof eventsFormsSchema>): Promise<{ error: boolean } | undefined>{
    const { userId } = auth();
    const { success, data } = eventsFormsSchema.safeParse(unsafeData);
    if(!success || !userId) return { error: true };
    
    await db.insert(EventsTable).values({ ...data, clerkUserId: userId });
    console.log('redirecting');
    redirect('/events');
}

export async function updateEvent(id: string ,unsafeData: zod.infer<typeof eventsFormsSchema>): Promise<{ error: boolean } | undefined> {
    const { userId } = auth();
    const { success, data } = eventsFormsSchema.safeParse(unsafeData);
    if(!success || !userId) return { error: true };

    const { rowCount } = await db.update(EventsTable)
        .set({...data})
        .where(and(eq(EventsTable.id, id), eq(EventsTable.clerkUserId, userId)));
    
    if(rowCount === 0) return { error: true };

    redirect('/events');

}

export async function deleteEvent(id: string): Promise<{ error: boolean} | undefined> {
    const { userId } = auth();
    if (!userId) return { error: true };

    const { rowCount } = await db.delete(EventsTable)
        .where(and(eq(EventsTable.id, id), eq(EventsTable.clerkUserId, userId)));

    if(rowCount === 0) return { error: true };

    redirect('/events');

}