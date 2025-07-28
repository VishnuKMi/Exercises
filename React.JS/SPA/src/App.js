import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/Home'
import ProductsPage from './pages/Products'
import RootLayout from './pages/Root'
import ErrorPage from './pages/Error'
import ProductDetailPage from './pages/ProjectDetail'

const router = createBrowserRouter([
  {
    path: '/', // an absolute route since it starts with '/'
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> }, // index routes >> better than empty paths - path: ''
      { path: 'products', element: <ProductsPage /> }, // used relative routes instead of absolute routes
      { path: 'products/:productId', element: <ProductDetailPage /> }
    ]
  }
])

function App () {
  return <RouterProvider router={router} />
}

export default App
