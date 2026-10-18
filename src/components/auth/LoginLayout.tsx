import type { ReactNode } from 'react';

import AuthLayout from './AuthLayout';

type LoginLayoutProps = {
  children: ReactNode;
};

export default function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <AuthLayout
      brand={{
        eyebrow: 'FROM STUDENT TO A TECH CAREER',
        title: 'Welcome back to\nyour next chapter.',
        description:
          'Continue learning, building, and moving closer to the career you want.',
        highlights: ['Skills', 'Experience', 'Career'],
      }}
      header={{
        eyebrow: 'WELCOME BACK',
        title: 'Log in to InternsHub',
        description:
          'Sign in to continue learning and building your future with InternsHub.',
      }}
      help={{
        text: 'Need help accessing your account?',
        linkLabel: 'Visit Help Center',
        href: '/help',
      }}
    >
      {children}
    </AuthLayout>
  );
}
