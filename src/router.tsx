import type { RouteRecord } from 'vite-react-ssg'
import LandingPage from './pages/LandingPage'

export const routes: RouteRecord[] = [
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
