import { useRouteLoaderData } from 'react-router-dom'
import EventForm from '../components/EventForm'

function EditEventPage () {
  // useLoaderData looks up for closest highest loader fn data in route tree
  const { event } = useRouteLoaderData('event-detail')

  return <EventForm method="PATCH" event={event} />
}

export default EditEventPage
