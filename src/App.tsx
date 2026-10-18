import React, { useEffect, useState } from 'react';
import LandingPage from './pages/LandingPage';
import InternshipPage from './pages/InternshipPage';
import PhoneOTP from './pages/auth/PhoneOTP';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import OnboardingFlow from './pages/onboarding/OnboardingFlow';
import RegisterScreen from './components/RegisterScreen';

const INTERNSHIP_PATH = '/internship';
const ONBOARDING_PATH = '/onboarding';
const PHONE_OTP_PATH = '/auth/phone-otp';
const FORGOT_PASSWORD_PATH = '/auth/forgot-password';
const REGISTER_PATH = '/register';
const AUTH_REGISTER_PATH = '/auth/register';
const AUTH_PATH = '/auth';

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (currentPath === REGISTER_PATH || currentPath === AUTH_REGISTER_PATH || window.location.hash === '#signup' || window.location.hash === '#register') {
    return <RegisterScreen />;
  }

  if (currentPath === INTERNSHIP_PATH || currentPath.startsWith('/internship')) {
    return <InternshipPage />;
  }

  if (currentPath === ONBOARDING_PATH) {
    return <OnboardingFlow />;
  }

  if (currentPath === PHONE_OTP_PATH) {
    return <PhoneOTP />;
  }

  if (currentPath === FORGOT_PASSWORD_PATH) {
    return <ForgotPassword />;
  }

  if (currentPath === AUTH_PATH || currentPath.startsWith('/auth')) {
    return <Login />;
  }

  return <LandingPage />;
};

export default App;
