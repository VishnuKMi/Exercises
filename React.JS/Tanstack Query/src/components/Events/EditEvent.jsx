// import { Link, useNavigate, useParams } from 'react-router-dom'
// import { useMutation, useQuery } from '@tanstack/react-query'

// import Modal from '../UI/Modal.jsx'
// import EventForm from './EventForm.jsx'
// import { fetchEvent, queryClient, updateEvent } from '../../utils/http.js'
// import LoadingIndicator from '../UI/LoadingIndicator.jsx'
// import ErrorBlock from '../UI/ErrorBlock.jsx'

// export default function EditEvent () {
//   const navigate = useNavigate()

//   const { id } = useParams()

//   const { data, isPending, isError, error } = useQuery({
//     queryKey: ['events', id],
//     queryFn: ({ signal }) => fetchEvent({ signal, id })
//   })

//   const { mutate } = useMutation({
//     mutationFn: updateEvent,
//     //NOTE: STEPS TO OPTIMISTICALLY UPDATE UI ->
//     onMutate: async data => {
//       // 1. Get data used to mutate.
//       const newEvent = data.event
//       // for optimistic ui updates(we don have to wait until mutation is done unlike in 'onSucess').
//       // updates the data previously cached by react query.

//       // 2. Cancel all other bg queries happening for the query we're mutating data from.
//       await queryClient.cancelQueries({ queryKey: ['events', id] }) // to ignore response clashes for query(doesn't cancel mutations in bg).

//       // 3. for rollback purposes if mutation fails, keep a copy of old query data.
//       const prevEvent = queryClient.getQueryData(['events', id])

//       // 4. Add the new data to query cache so that ui can update instantly
//       queryClient.setQueryData(['events', id], newEvent) // ui optimistically manipulates data in ui without waiting actual mutated response.

//       return { prevEvent } // when returned, we can fetch this data from 'context' in onError.
//     },
//     // 5. rollback
//     onError: (error, data, context) => {
//       queryClient.setQueryData(['events', id], context.prevEvent)
//     },
//     // 6. will be called even if mutation succeed/failed. Done to make sure data in ui is same as to backend.
//     onSettled: () => {
//       queryClient.invalidateQueries(['events'], id)
//     }
//   })

//   function handleSubmit (formData) {
//     mutate({ id, event: formData })
//     navigate('../')
//   }

//   function handleClose () {
//     navigate('../')
//   }

//   let content

//   if (isPending) {
//     content = (
//       <div className='center'>
//         <LoadingIndicator />
//       </div>
//     )
//   }

//   if (isError) {
//     content = (
//       <>
//         <ErrorBlock
//           title='Failed to load event'
//           message={
//             error.info?.message ||
//             'Failed to load event. Please check your inputs and try again later.'
//           }
//         />
//         <div className='form-actions'>
//           <Link to='../' className='button'>
//             Okay
//           </Link>
//         </div>
//       </>
//     )
//   }

//   if (data) {
//     content = (
//       <EventForm inputData={data} onSubmit={handleSubmit}>
//         <Link to='../' className='button-text'>
//           Cancel
//         </Link>
//         <button type='submit' className='button'>
//           Update
//         </button>
//       </EventForm>
//     )
//   }

//   return <Modal onClose={handleClose}>{content}</Modal>
// }

// USING REACT-ROUTER's loader/actions combined with Tanstack Query

import {
  Link,
  redirect,
  useNavigate,
  useParams,
  useSubmit,
  useNavigation
} from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import Modal from '../UI/Modal.jsx'
import EventForm from './EventForm.jsx'
import { fetchEvent, queryClient, updateEvent } from '../../utils/http.js'
import ErrorBlock from '../UI/ErrorBlock.jsx'

export default function EditEvent () {
  const navigate = useNavigate()
  // useNavigation can be used to provide user feedback while form submissions are involved.
  const { state } = useNavigation()
  const submit = useSubmit()
  const { id } = useParams()

  // We can rely on 'useLoaderData()' to fetch same data but it's not a good practice. Instead with this useQuery hook in component,
  // it will fetch the cache from the previous loader() fn and display it. So better to keep it both.
  const { data, isError, error } = useQuery({
    queryKey: ['events', id],
    queryFn: ({ signal }) => fetchEvent({ signal, id }),
    // here it's a good place to add staleTime bcuz we just loaded this page with 'loader()' and we don't want another quick refetch from 'useQuery' again.
    staleTime: 10000 // 10s
  })

  // const { mutate } = useMutation({
  //   mutationFn: updateEvent,
  //   //NOTE: STEPS TO OPTIMISTICALLY UPDATE UI ->
  //   onMutate: async data => {
  //     // 1. Get data used to mutate.
  //     const newEvent = data.event
  //     // for optimistic ui updates(we don have to wait until mutation is done unlike in 'onSucess').
  //     // updates the data previously cached by react query.

  //     // 2. Cancel all other bg queries happening for the query we're mutating data from.
  //     await queryClient.cancelQueries({ queryKey: ['events', id] }) // to ignore response clashes for query(doesn't cancel mutations in bg).

  //     // 3. for rollback purposes if mutation fails, keep a copy of old query data.
  //     const prevEvent = queryClient.getQueryData(['events', id])

  //     // 4. Add the new data to query cache so that ui can update instantly
  //     queryClient.setQueryData(['events', id], newEvent) // ui optimistically manipulates data in ui without waiting actual mutated response.

  //     return { prevEvent } // when returned, we can fetch this data from 'context' in onError.
  //   },
  //   // 5. rollback
  //   onError: context => {
  //     queryClient.setQueryData(['events', id], context.prevEvent)
  //   },
  //   // 6. will be called even if mutation succeed/failed. Done to make sure data in ui is same as to backend.
  //   onSettled: () => {
  //     queryClient.invalidateQueries(['events'], id)
  //   }
  // })

  // function handleSubmit (formData) {
  //   mutate({ id, event: formData })
  //   navigate('../')
  // }
  function handleSubmit (formData) {
    submit(formData, { method: 'PUT' }) // TIP: Only for non-'GET' methods, an 'action' fn is triggered by react-router.
  }

  function handleClose () {
    navigate('../')
  }

  let content

  // We dont need pending checks anymore since we fetch data from cache and not from server response.

  // if (isPending) {
  //   content = (
  //     <div className='center'>
  //       <LoadingIndicator />
  //     </div>
  //   )
  // }

  if (isError) {
    content = (
      <>
        <ErrorBlock
          title='Failed to load event'
          message={
            error.info?.message ||
            'Failed to load event. Please check your inputs and try again later.'
          }
        />
        <div className='form-actions'>
          <Link to='../' className='button'>
            Okay
          </Link>
        </div>
      </>
    )
  }

  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        {state === 'submitting' ? (
          <p>Sending data...</p>
        ) : (
          <>
            <Link to='../' className='button-text'>
              Cancel
            </Link>
            <button type='submit' className='button'>
              Update
            </button>
          </>
        )}
      </EventForm>
    )
  }

  return <Modal onClose={handleClose}>{content}</Modal>
}

export function loader ({ params }) {
  return queryClient.fetchQuery({
    queryKey: ['events', params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id })
  })
}

export async function action ({ request, params }) {
  // Will be triggered when a 'form' in page is submitted
  const formData = await request.formData()
  const updatedEvent = Object.fromEntries(formData)
  await updateEvent({ id: params.id, event: updatedEvent })

  // invalidated to make sure updated data is fetched again. but we've a tradeoff(optimistic ui updated wont work anymore).
  await queryClient.invalidateQueries(['events', params.id])
  return redirect('../')
}
