import React from 'react'
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { eventsFormsSchema } from '@/schema/events'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'


const EventsForm = () => {
    const form = useForm<zod.infer<typeof eventsFormsSchema>>({
        resolver: zodResolver(eventsFormsSchema),
        defaultValues: {
          isActive: true,
          durationInMinutes: 30,
        },
      })


    function onSubmit(values: zod.infer<typeof eventsFormsSchema>) {
        console.log(values)
    }


  return (
    <div>EventsForm</div>
    // <Form { ...form }>
    //     <form onSubmit={form.handleSubmit(onSubmit)}>
    //         <FormField 
    //             control={form.control}
    //             name='name'
    //             render={({ field }) => (
    //                 <FormItem>
    //                     <FormLabel>
    //                         Event Name
    //                     </FormLabel>
    //                     <FormControl>
    //                         <Input {...field}/>
    //                     </FormControl>
    //                     <FormDescription>
    //                         The name users will see when booking
    //                     </FormDescription>
    //                     <FormMessage />
    //                 </FormItem>
    //             )}
    //         />
    //     </form>
    // </Form>
  )
}

export default EventsForm