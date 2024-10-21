import { DAYS_OF_WEEK_IN_ORDER } from '@/data/constants'
import { timeToInt } from '@/lib/utils'
import { scheduleFormSchema } from '@/schema/schedule'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z as zod } from 'zod'

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
  })

  return (
    <div>ScheduleForm
        {/* {schedule.clerkUserId} */}
    </div>
  )
}

export default ScheduleForm;
