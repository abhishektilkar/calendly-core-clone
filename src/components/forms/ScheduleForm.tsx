import { DAYS_OF_WEEK_IN_ORDER } from '@/data/constants'
import { timeToInt } from '@/lib/utils'
import { scheduleFormSchema } from '@/schema/schedule'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Form, useForm } from 'react-hook-form'
import { z as zod } from 'zod'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { SelectTrigger, Select, SelectValue, SelectContent, SelectItem } from '../ui/select'
import { formatTimezoneOffset } from '@/lib/formatters'

// type = sche{}

// type Schedule = zod.infer<typeof ScheduleFormSchema>
type Availability = {
  startTime: string
  endTime: string
  dayOfWeek: (typeof DAYS_OF_WEEK_IN_ORDER)[number]
}
const ScheduleForm = ({ schedule }: { schedule?: {
  timezone: string
  availabilities: Availability[]
} }) => {

  const form = useForm<zod.infer<typeof scheduleFormSchema>>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      timezone: schedule?.timezone ?? 
                Intl.DateTimeFormat().resolvedOptions().timeZone,
      availabilities: schedule?.availabilities.toSorted((a, b) => {
        return timeToInt(a.startTime) - timeToInt(b.startTime)
      }),
    }
  });

  async function onSubmit(values: zod.infer<typeof scheduleFormSchema>) {

  }

  return (
    <div>
      {/* ScheduleForm */}
      {/* {schedule.clerkUserId} */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex gap-6 flex-col'
        >
          {
            form.formState.errors.root && (
              <div className='text-destructive text-sm'>
                {form.formState.errors.root.message}
              </div>
            )
          }
          <FormField
            control={form.control}
            name='timezone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timezone</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Intl.supportedValuesOf('timeZone').map(timezone => (
                        <SelectItem key={timezone} value={timezone}>
                          {timezone}
                          {`(${formatTimezoneOffset(timezone)})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                <FormDescription>
                  The name user will see when booking
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

        </form>
      </Form>
    </div>
  )
}

export default ScheduleForm;
