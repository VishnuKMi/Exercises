import { useFetcher } from 'react-router-dom'
import classes from './NewsletterSignup.module.css'
import { useEffect } from 'react'

function NewsletterSignup () {
  const { Form, data, state } = useFetcher() // triggers action/loader but doesn't initialize route transition in where they belong

  useEffect(() => {
    if (state === 'idle' && data && data.message) {
      window.alert(data.message)
    }
  }, [data, state])

  return (
    <Form method='post' action='/newsletter' className={classes.newsletter}>
      <input
        type='email'
        placeholder='Sign up for newsletter...'
        aria-label='Sign up for newsletter'
      />
      <button>Sign up</button>
    </Form>
  )
}

export default NewsletterSignup
