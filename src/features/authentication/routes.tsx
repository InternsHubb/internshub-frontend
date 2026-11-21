import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import { PublicOnlyRoute } from '@/shared/routing';

const RegisterPage = lazy(() => import('@/features/authentication/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/features/authentication/pages/ForgotPasswordPage'));
const LoginPage = lazy(() => import('@/features/authentication/pages/LoginPage'));
const PhoneOtpPage = lazy(() => import('@/features/authentication/pages/PhoneOtpPage'));
const OAuthCallbackPage = lazy(() => import('@/features/authentication/pages/OAuthCallbackPage'));

export const authenticationRoutes: RouteObject[] = [
  {
    path: ROUTES.register,
    element: (
      <PublicOnlyRoute>
        <RegisterPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: ROUTES.authRegister,
    element: (
      <PublicOnlyRoute>
        <RegisterPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: ROUTES.forgotPassword,
    element: (
      <PublicOnlyRoute>
        <ForgotPasswordPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: ROUTES.phoneOtp,
    element: (
      <PublicOnlyRoute>
        <PhoneOtpPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: ROUTES.microsoftCallback,
    element: <OAuthCallbackPage />,
  },
  {
    path: `${ROUTES.login}/*`,
    element: (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    ),
  },
];
