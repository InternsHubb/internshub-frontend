import type { RouteObject } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import RegisterScreen from './components/RegisterScreen'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/register',
    element: <RegisterScreen />,
  },
  {
    path: '/auth/register',
    element: <RegisterScreen />,
  },
  {
    path: '*',
    element: <LandingPage />,
  },
]

export default routes
