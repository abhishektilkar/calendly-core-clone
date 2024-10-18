"use client"
import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { eventsFormsSchema } from '@/schema/events'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button';
import Link from 'next/link';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { createEvent, deleteEvent, updateEvent } from '@/server/actions/events';
import { redirect } from 'next/navigation';
import { AlertDialog, AlertDialogHeader, AlertDialogTrigger, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '../ui/alert-dialog';


const EventsForm = ({ event }: { event?: {
    id: string
    name: string
    description?: string | null 
    durationInMinutes: number //string
    isActive: boolean
}}) => {

    const [isDeletePending, startDeleteTransition] = useTransition()
    const form = useForm<zod.infer<typeof eventsFormsSchema>>({
        resolver: zodResolver(eventsFormsSchema),
        defaultValues: event ?? {
          isActive: true,
          durationInMinutes: 30,
        },
      })


    async function onSubmit(values: zod.infer<typeof eventsFormsSchema> ){
        const action = event ? updateEvent.bind(null, event.id) : createEvent;
        const data = await action(values);
        if(data?.error) form.setError('root', {
            message: "Error saving your event"
        })
    }


  return (
    // <div>EventsForm</div>
    <Form { ...form }>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex gap-6 flex-col'>
            {form.formState.errors.root && (
                <div className='text-destructive text-sm'>
                    {form.formState.errors.root.message}
                </div>
            )}
            <FormField 
                control={form.control}
                name='name'
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Event Name
                        </FormLabel>
                        <FormControl>
                            <Input {...field}/>
                        </FormControl>
                        <FormDescription>
                            The name users will see when booking
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField 
                control={form.control}
                name='durationInMinutes'
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Event Duration
                        </FormLabel>
                        <FormControl>
                            <Input type='number'{...field}/>
                        </FormControl>
                        <FormDescription>
                            In minutes
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField 
                control={form.control}
                name='description'
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Event Description
                        </FormLabel>
                        <FormControl>
                            <Textarea className='resize-none h-32' { ...field } />
                        </FormControl>
                        <FormDescription>
                            Optional description for the event
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField 
                control={form.control}
                name='isActive'
                render={({ field }) => (
                    <FormItem>
                        <div className='flex items-center gap-2'>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormLabel>Active</FormLabel>
                        </div>
                        <FormDescription>
                            Inactive events will not be visible to users to book
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className='flex gap-2 justify-end'>
                {
                    event && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button asChild1 variant='destructiveGhost' disabled={isDeletePending || form.formState.isSubmitting}>
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete your event.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                        disabled={isDeletePending || form.formState.isSubmitting}
                                        variant='destructive'
                                        onClick={() => (
                                            startDeleteTransition(async() => {
                                                const data = await deleteEvent(event.id);

                                                if (data?.error) {
                                                    form.setError('root', {
                                                        message: 'There was an error deleting your event'
                                                    })
                                                }

                                            })
                                        )}
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )
                }
                <Button type='button' asChild variant='outline'>
                    <Link href='/events'>Cancel</Link>
                </Button>
                <Button type='submit'>Save</Button>
            </div>
        </form>
    </Form>
  )
}

export default EventsForm