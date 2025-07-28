import { Suspense } from 'react'
import { Await, redirect, useRouteLoaderData } from 'react-router-dom'

import EventItem from '../components/EventItem'
import EventsList from '../components/EventsList'

function EventDetailPage () {
  const { event, events } = useRouteLoaderData('event-detail')

  return (
    <>
    {/* Since we await 'loader', we won't see 'Loading' message for 'EventItem'. Data will be fetched before the page is even loaded. */}
      <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
        <Await resolve={event}>
          {loadedEvent => <EventItem event={loadedEvent} />}
        </Await>
      </Suspense>

      <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
        <Await resolve={events}>
          {loadedEvents => <EventsList events={loadedEvents} />}
        </Await>
      </Suspense>
    </>
  )
}

export default EventDetailPage

async function loadEvent (id) {
  const response = await fetch('http://localhost:8080/events/' + id)

  if (!response.ok) {
    throw new Response(
      JSON.stringify({
        message: 'Could not fetch details for selected event.'
      }),
      { status: 500 }
    )
  } else {
    const resData = await response.json()
    return resData.event
  }
}

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

export async function loader ({ request, params }) {
  const id = params.eventId

  return {
    event: await loadEvent(id), // adding 'await' will wait for data fetched before navigating to page
    events: loadEvents() // data is fetched once page is loaded
  }
}

export async function action ({ params, request }) {
  const eventId = params.eventId
  const response = await fetch('http://localhost:8080/events/' + eventId, {
    method: request.method
  })

  if (!response.ok) {
    throw new Response(
      JSON.stringify({
        message: 'Could not delete event.'
      }),
      { status: 500 }
    )
  }

  return redirect('/events')
}
