import type { RouteObject } from 'react-router-dom'
import LandingPage from './pages/LandingPage'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '*',
    element: <LandingPage />,
  },
]

export default routes
