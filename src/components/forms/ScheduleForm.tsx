import React from 'react'
import { z as zod } from 'zod'

// type = sche{}

// type Schedule = zod.infer<typeof ScheduleFormSchema>
const ScheduleForm = ({ schedule }: { schedule: any }) => {
  return (
    <div>ScheduleForm
        {schedule.clerkUserId}
    </div>
  )
}

export default ScheduleForm;