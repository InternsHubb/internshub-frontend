import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/router';
import { AuthProvider } from '@/components/auth/AuthProvider';

export const App: React.FC = () => (
  <AuthProvider>
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
  </AuthProvider>
);

export default App;
