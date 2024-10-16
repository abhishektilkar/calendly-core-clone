import { DAYS_OF_WEEK_IN_ORDER } from '@/data/constants';
import { relations } from 'drizzle-orm';
import { boolean, index, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

const createdAt = timestamp('createdAt').notNull().defaultNow();
const updatedAt = timestamp('updatedAt').notNull().defaultNow().$onUpdate(() => new Date());

export const EventsTable = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'), //.notNull(),
  durationInMinutes: integer("durationInMinutes").notNull(),
  clerkUserId: text('clerkUserId').notNull(),
  isActive: boolean('isActive').notNull().default(true),
  createdAt,
  updatedAt,
}, table => ({
    clerkUserIdIndex: index("clerkUserIdIndex").on(table.clerkUserId)
}) );

export const SchedulesTable = pgTable('schedules', {
    id: uuid('id').primaryKey().defaultRandom(),
    timezone: text("timezone").notNull(),
    clerkUserId: text("clerkUserId").notNull().unique(),
    createdAt,
    updatedAt,
})

export const scheduleRelations = relations(SchedulesTable, ({ many }) => ({
    avaliabilities: many(ScheduleAvailabilitiesTable)
}))

export const scheduleDayOfWeekEnum = pgEnum("day", DAYS_OF_WEEK_IN_ORDER);

export const ScheduleAvailabilitiesTable = pgTable("scheduleAvailibilities", {
    id: uuid('id').primaryKey(),
    scheduleId: uuid("scheduleId")
    .notNull()
    .references(() => SchedulesTable.id, { onDelete: "cascade" }),
    startTime: text("startTime").notNull(),
    endTime: text("endTime").notNull(),
    dayOfWeek: scheduleDayOfWeekEnum("dayOfWeek").notNull(),
}, table =>  ({
    scheduleIdIndex: index("scheduleIdIndex").on(table.scheduleId),
}))

export const ScheduleAvailabilitiesRelations = relations(ScheduleAvailabilitiesTable, ({ one }) => ({
    schedule: one(SchedulesTable, {
        fields: [ScheduleAvailabilitiesTable.scheduleId],
        references: [SchedulesTable.id],
    })
}))
