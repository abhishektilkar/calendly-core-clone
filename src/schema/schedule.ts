import { DAYS_OF_WEEK_IN_ORDER } from "@/data/constants";
import { timeToInt } from "@/lib/utils";
import { z as zod } from "zod";

export const scheduleFormSchema = zod.object({
    timezone: zod.string().min(1, 'Required'),
    availabilities: zod.array(zod.object({
        dayOfWeek: zod.enum(DAYS_OF_WEEK_IN_ORDER),
        startTime: zod.string().regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format'),
        endTime: zod.string().regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format'),
    })).superRefine((availabilities, ctx) => {
        availabilities.forEach((availability, index) => {
            const overlaps = availabilities.some((a,i) => {
                return i !== index &&
                    a.dayOfWeek === availability.dayOfWeek &&
                    timeToInt(a.startTime) < timeToInt(availability.endTime) &&
                    timeToInt(a.endTime) > timeToInt(availability.startTime);
            })

            if(overlaps) {
                // createGzip.
                ctx.addIssue({
                    code: 'custom',
                    message: 'Availabilies overlaps with another',
                    path: [index]
                })
            }
        })
    })
})

