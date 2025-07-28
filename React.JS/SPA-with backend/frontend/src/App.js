// // Challenge / Exercise

// // 1. Add five new (dummy) page components (content can be simple <h1> elements)
// //    - HomePage
// //    - EventsPage
// //    - EventDetailPage
// //    - NewEventPage
// //    - EditEventPage
// // 2. Add routing & route definitions for these five pages
// //    - / => HomePage
// //    - /events => EventsPage
// //    - /events/<some-id> => EventDetailPage
// //    - /events/new => NewEventPage
// //    - /events/<some-id>/edit => EditEventPage
// // 3. Add a root layout that adds the <MainNavigation> component above all page components
// // 4. Add properly working links to the MainNavigation
// // 5. Ensure that the links in MainNavigation receive an "active" class when active
// // 6. Output a list of dummy events to the EventsPage
// //    Every list item should include a link to the respective EventDetailPage
// // 7. Output the ID of the selected event on the EventDetailPage
// // BONUS: Add another (nested) layout route that adds the <EventNavigation> component above all /events... page components

// import { RouterProvider, createBrowserRouter } from 'react-router-dom'
// import RootLayout from './pages/Root'
// import EventsPage, { loader as eventsLoader } from './pages/Events'
// import HomePage from './pages/Home'
// import EventDetailPage, {
//   loader as eventDetailLoader,
//   action as deleteEventAction
// } from './pages/EventDetail'
// import EditEventPage from './pages/EditEvent'
// import NewEventPage from './pages/NewEvent'
// import ErrorPage from './pages/Error'
// import EventsRootLayout from './pages/EventsRoot'
// import { action as manipulateEventAction } from './components/EventForm'

// function App () {
//   const router = createBrowserRouter([
//     {
//       path: '/',
//       element: <RootLayout />,
//       // shows error if wrong url is accessed OR loader fn fails in nearest route group
//       errorElement: <ErrorPage />,
//       children: [
//         { index: true, element: <HomePage /> },
//         {
//           path: 'events',
//           element: <EventsRootLayout />,
//           children: [
//             // child routes are relative to parent path
//             {
//               index: true,
//               element: <EventsPage />,
//               // when loader is used, fetching data happens before page is rendered
//               loader: eventsLoader
//             },
//             {
//               path: ':eventId',
//               id: 'event-detail', // used so that we can access loader data from other/higher routes using useRouteLoaderData
//               loader: eventDetailLoader, // shared loader
//               children: [
//                 {
//                   index: true,
//                   element: <EventDetailPage />,
//                   action: deleteEventAction
//                 },
//                 {
//                   path: 'edit',
//                   element: <EditEventPage />,
//                   action: manipulateEventAction
//                 }
//               ]
//             },
//             {
//               path: 'new',
//               element: <NewEventPage />,
//               action: manipulateEventAction
//             }
//           ]
//         }
//       ]
//     }
//   ])

//   return <RouterProvider router={router} />
// }

// export default App

import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import EditEventPage from './pages/EditEvent'
import ErrorPage from './pages/Error'
import EventDetailPage, {
  loader as eventDetailLoader,
  action as deleteEventAction
} from './pages/EventDetail'
import EventsPage, { loader as eventsLoader } from './pages/Events'
import EventsRootLayout from './pages/EventsRoot'
import HomePage from './pages/Home'
import NewEventPage from './pages/NewEvent'
import RootLayout from './pages/Root'
import { action as manipulateEventAction } from './components/EventForm'
import NewsletterPage, { action as newsletterAction } from './pages/Newsletter'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'events',
        element: <EventsRootLayout />,
        children: [
          {
            index: true,
            element: <EventsPage />,
            loader: eventsLoader
          },
          {
            path: ':eventId',
            id: 'event-detail',
            loader: eventDetailLoader,
            children: [
              {
                index: true,
                element: <EventDetailPage />,
                action: deleteEventAction
              },
              {
                path: 'edit',
                element: <EditEventPage />,
                action: manipulateEventAction
              }
            ]
          },
          {
            path: 'new',
            element: <NewEventPage />,
            action: manipulateEventAction
          }
        ]
      },
      {
        path: 'newsletter',
        element: <NewsletterPage />,
        action: newsletterAction
      }
    ]
  }
])

function App () {
  return <RouterProvider router={router} />
}

export default App
