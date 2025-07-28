import { useQuery } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { fetchEvents } from '../../utils/http'
import LoadingIndicator from '../UI/LoadingIndicator'
import ErrorBlock from '../UI/ErrorBlock'
import EventItem from './EventItem'

export default function FindEventSection () {
  const searchElement = useRef()

  const [searchTerm, setSearchTerm] = useState() // we can't use empty string here bcuz 'input fields at first-load' & 'cleared input fields' will be = empty string which will disable fetch(when user clears an input, no events are shown). With 'undefined', input field at first load = undefined and cleared inputs = empty string (both can be differentiated this way).

  const { data, isLoading, isError, error } = useQuery({
    // using 'isPending' along with 'enabled' method is a bad practice bcuz isPending keep on waiting for 'enabled' if query is 'disabled'.
    queryKey: ['events', { searchTerm: searchTerm }],
    queryFn: ({ signal, queryKey }) => fetchEvents({ signal, ...queryKey[1] }),
    enabled: searchTerm !== undefined
  })

  function handleSubmit (event) {
    event.preventDefault()
    setSearchTerm(searchElement.current.value)
  }

  let content = <p>Please enter a search term and to find events.</p>

  if (isLoading) {
    content = <LoadingIndicator />
  }

  if (isError) {
    content = (
      <ErrorBlock
        title='An error occured'
        message={error.info?.message || 'Failed to fetch events'}
      />
    )
  }

  if (data) {
    content = (
      <ul className='events-list'>
        {data.map(ev => (
          <li key={ev.id}>
            <EventItem event={ev} />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <section className='content-section' id='all-events-section'>
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id='search-form'>
          <input
            type='search'
            placeholder='Search events'
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  )
}
