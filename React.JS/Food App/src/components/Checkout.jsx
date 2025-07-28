// import { use } from 'react'
// import CartContext from '../store/CartContext'
// import { currencyFormatter } from '../util/formatting'
// import Input from './ui/Input'
// import Button from './ui/Button'
// import UserProgressContext from '../store/UserProgressContext'
// import Modal from './ui/Modal'
// import useHttp from '../hooks/useHttp'
// import Error from './Error'

// const requestConfig = {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json'
//   }
// }

// export default function Checkout () {
//   const cartCtx = use(CartContext)
//   const userProgressCtx = use(UserProgressContext)

//   const {
//     data,
//     isLoading: isSending,
//     error,
//     sendRequest,
//     clearData
//   } = useHttp('http://localhost:3000/orders', requestConfig)

//   const cartTotal = cartCtx.items.reduce(
//     (totalPrice, item) => totalPrice + item.quantity * item.price,
//     0
//   )

//   function handleClose () {
//     userProgressCtx.hideCheckout()
//   }

//   function handleFinish () {
//     userProgressCtx.hideCheckout()
//     cartCtx.clearCart()
//     clearData()
//   }

//   function handleSubmit (e) {
//     e.preventDefault()

//     const fd = new FormData(e.target)
//     const customerData = Object.fromEntries(fd.entries())

//     sendRequest(
//       JSON.stringify({
//         order: {
//           items: cartCtx.items,
//           customer: customerData
//         }
//       })
//     )
//   }

//   let actions = (
//     <>
//       <Button type='button' textOnly onClick={handleClose}>
//         Close
//       </Button>
//       <Button textOnly>Submit Order</Button>
//     </>
//   )

//   if (isSending) {
//     actions = <span>Sending order data...</span>
//   }

//   if (data && !error) {
//     return (
//       <Modal
//         open={userProgressCtx.progress === 'checkout'}
//         onClose={handleFinish}
//       >
//         <h2>Success!</h2>
//         <p>Your order was submitted successfully</p>
//         <p>
//           We will get back to you with more details via email within the next
//           few minutes.
//         </p>
//         <p className='modal-actions'>
//           <Button onClick={handleFinish}>Okay</Button>
//         </p>
//       </Modal>
//     )
//   }

//   return (
//     <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
//       <form onSubmit={handleSubmit}>
//         <h2>Checkout</h2>
//         <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>

//         <Input label='Full Name' type='text' id='name' />
//         <Input label='E-Mail Address' type='email' id='email' />
//         <Input label='Street' type='text' id='street' />
//         <div className='control-row'>
//           <Input label='Postal Code' type='text' id='postal-code' />
//           <Input label='City' type='text' id='city' />
//         </div>

//         {error && <Error title='Failed to submit order' message={error} />}
//         <p className='modal-actions'>{actions}</p>
//       </form>
//     </Modal>
//   )
// }

// ------USING FORM ACTIONS------

import { use } from 'react'
import CartContext from '../store/CartContext'
import { currencyFormatter } from '../util/formatting'
import Input from './ui/Input'
import Button from './ui/Button'
import UserProgressContext from '../store/UserProgressContext'
import Modal from './ui/Modal'
import useHttp from '../hooks/useHttp'
import Error from './Error'
import { useActionState } from 'react'

const requestConfig = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}

export default function Checkout () {
  const cartCtx = use(CartContext)
  const userProgressCtx = use(UserProgressContext)

  const { data, error, sendRequest, clearData } = useHttp(
    'http://localhost:3000/orders',
    requestConfig
  )

  const cartTotal = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0
  )

  function handleClose () {
    userProgressCtx.hideCheckout()
  }

  function handleFinish () {
    userProgressCtx.hideCheckout()
    cartCtx.clearCart()
    clearData()
  }

  async function checkoutAction (prevState, fd) {
    const customerData = Object.fromEntries(fd.entries())

    // Add separate form input validation here if needed

    // since we are waiting for a promise inside form, we can use 'useActionState'(or 'formStatus' hook) instead of 'isLoading'
    await sendRequest(
      JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData
        }
      })
    )
  }

  const [formState, formAction, pending] = useActionState(checkoutAction, null)

  let actions = (
    <>
      <Button type='button' textOnly onClick={handleClose}>
        Close
      </Button>
      <Button textOnly>Submit Order</Button>
    </>
  )

  if (pending) {
    actions = <span>Sending order data...</span>
  }

  if (data && !error) {
    return (
      <Modal
        open={userProgressCtx.progress === 'checkout'}
        onClose={handleFinish}
      >
        <h2>Success!</h2>
        <p>Your order was submitted successfully</p>
        <p>
          We will get back to you with more details via email within the next
          few minutes.
        </p>
        <p className='modal-actions'>
          <Button onClick={handleFinish}>Okay</Button>
        </p>
      </Modal>
    )
  }

  return (
    <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
      <form action={formAction}>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>

        <Input label='Full Name' type='text' id='name' />
        <Input label='E-Mail Address' type='email' id='email' />
        <Input label='Street' type='text' id='street' />
        <div className='control-row'>
          <Input label='Postal Code' type='text' id='postal-code' />
          <Input label='City' type='text' id='city' />
        </div>

        {error && <Error title='Failed to submit order' message={error} />}
        <p className='modal-actions'>{actions}</p>
      </form>
    </Modal>
  )
}
