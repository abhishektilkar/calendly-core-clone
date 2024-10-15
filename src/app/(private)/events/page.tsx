import React from 'react'
import { UserButton } from "@clerk/nextjs";
const EventsPage = () => {
  return (
    <div>
        <h1>Events</h1>
        <UserButton />
    </div>
  )
}

export default EventsPage