import React, { useEffect, useState } from 'react';
import LandingPage from './pages/LandingPage';
import InternshipPage from './pages/InternshipPage';
import PhoneOTP from './pages/auth/PhoneOTP';
import AuthMain from './pages/auth/AuthMain';

const INTERNSHIP_PATH = '/internship';
const PHONE_OTP_PATH = '/auth/phone-otp';
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

  if (currentPath === INTERNSHIP_PATH || currentPath.startsWith('/internship')) {
    return <InternshipPage />;
  }

  if (currentPath === PHONE_OTP_PATH) {
    return <PhoneOTP />;
  }

  if (currentPath === AUTH_PATH || currentPath.startsWith('/auth')) {
    return <AuthMain />;
  }

  return <LandingPage />;
};

export default App;
