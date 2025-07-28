import { useLoaderData, Await } from 'react-router-dom'

import EventsList from '../components/EventsList'
import { Suspense } from 'react'

function EventsPage () {
  // useLoaderData can parses data response by default
  const { events, isError, message } = useLoaderData()

  // if (isError) {
  //   return <p>{message}</p>
  // }

  return (
    <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
      <Await resolve={events}>
        {loadedEvents => <EventsList events={loadedEvents} />}
      </Await>
    </Suspense>
  )
}

export default EventsPage

async function loadEvents () {
  const response = await fetch('http://localhost:8080/events')

  if (!response.ok) {
    // return { isError: true, message: 'Could not fetch events.' }
    // throw { message: 'Could not fetch events. ' }
    // http-like error handling 👇
    throw new Response(JSON.stringify({ message: 'Could not fetch events' }), {
      status: 500
    })
  } else {
    // return response // works no more since we defer in between
    const resData = await response.json()
    return resData.events
  }
}

export async function loader () {
  return {
    events: loadEvents()
  }
}
