import {
  Navigate,
  Outlet,
  ScrollRestoration,
  createBrowserRouter,
  useLocation,
} from 'react-router-dom';

import RegisterScreen from '@/components/RegisterScreen';
import { REGISTER_HASHES, ROUTES } from '@/constants/routes';
import InternshipPage from '@/pages/InternshipPage';
import LandingPage from '@/pages/LandingPage';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import Login from '@/pages/auth/Login';
import PhoneOTP from '@/pages/auth/PhoneOTP';
import OnboardingFlow from '@/pages/onboarding/OnboardingFlow';

function RootLayout() {
  const { hash } = useLocation();

  // Older links such as "/#signup" opened the Register screen on any path.
  if (REGISTER_HASHES.includes(hash)) {
    return <Navigate to={ROUTES.register} replace />;
  }

  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: ROUTES.home, element: <LandingPage /> },
      // Sub-paths keep rendering the Internship page, as before.
      { path: `${ROUTES.internship}/*`, element: <InternshipPage /> },
      { path: ROUTES.onboarding, element: <OnboardingFlow /> },
      { path: ROUTES.register, element: <RegisterScreen /> },
      { path: ROUTES.authRegister, element: <RegisterScreen /> },
      { path: ROUTES.forgotPassword, element: <ForgotPassword /> },
      { path: ROUTES.phoneOtp, element: <PhoneOTP /> },
      // Any other /auth path shows Login, as before.
      { path: `${ROUTES.login}/*`, element: <Login /> },
      { path: '*', element: <Navigate to={ROUTES.home} replace /> },
    ],
  },
], {
  // Opt into React Router v7 behavior now; this also silences its dev warnings.
  future: {
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_relativeSplatPath: true,
    v7_skipActionErrorRevalidation: true,
  },
});
