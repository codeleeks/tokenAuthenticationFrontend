import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import ItemsPage, { loader as itemsLoader } from '../pages/ItemsPage'
import SignInPage from '../pages/SignInPage'
import RootPage from '../pages/RootPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'items',
        element: <ItemsPage />,
        loader: itemsLoader,
      },
      {
        path: 'signin',
        element: <SignInPage />,
      },
    ],
  },
])

export function BrowserRouterProvider() {
  return <RouterProvider router={router} />
}
