// import { NavLink } from 'react-router-dom'
// import classes from './MainNavigation.module.css'

// const LINKS = [
//   { label: 'Home', path: '/' },
//   { label: 'Events', path: '/events' }
// ]

// function MainNavigation () {
//   return (
//     <header className={classes.header}>
//       <nav>
//         <ul className={classes.list}>
//           {LINKS.map(ev => (
//             <li key={ev.label}>
//               <NavLink
//                 to={ev.path}
//                 className={({ isActive }) =>
//                   isActive ? classes.active : undefined
//                 }
//                 end={ev.path === '/'}
//               >
//                 {ev.label}
//               </NavLink>
//             </li>
//           ))}
//         </ul>
//       </nav>
//     </header>
//   )
// }

// export default MainNavigation

import { NavLink } from 'react-router-dom'

import classes from './MainNavigation.module.css'
import NewsletterSignup from './NewsletterSignup'

function MainNavigation () {
  return (
    <header className={classes.header}>
      <nav>
        <ul className={classes.list}>
          <li>
            <NavLink
              to='/'
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/events'
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Events
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/newsletter'
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Newsletter
            </NavLink>
          </li>
        </ul>
      </nav>
      <NewsletterSignup />
    </header>
  )
}

export default MainNavigation
