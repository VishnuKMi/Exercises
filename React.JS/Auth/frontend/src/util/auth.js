// import { redirect } from 'react-router-dom'

// export function getAuthToken () {
//   const token = localStorage.getItem('token')
//   return token
// }

// export function tokenLoader () {
//   return getAuthToken()
// }

// export function checkAuthLoader () {
//   const token = getAuthToken()

//   if (!token) {
//     return redirect('/auth')
//   }

//   return null
// }

import { redirect } from 'react-router-dom'

export function getTokenDuration () {
  const storedExpirationDate = localStorage.getItem('expiration')
  const expirationDate = new Date(storedExpirationDate)
  const now = new Date()
  const duration = expirationDate.getTime() - now.getTime()
  return duration // will be negative if token expired and vice-versa
}

export function getAuthToken () {
  const token = localStorage.getItem('token')

  if (!token) {
    return null // just 'return' won't work with loader()s as it says 'undefined'. so 'return null' is used
  }

  const tokenDuration = getTokenDuration()

  if (tokenDuration < 0) {
    return 'EXPIRED'
  }

  return token
}

export function tokenLoader () {
  const token = getAuthToken()
  return token
}

export function checkAuthLoader () {
  const token = getAuthToken()

  if (!token) {
    return redirect('/auth')
  }
}
