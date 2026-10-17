# InternsHub Frontend UI Architecture & Task Assignments

The platform focuses purely on standalone Frontend UI screens, built using React, TypeScript (strict), Vite, and Tailwind CSS (no backend integration, relying on local state and mock data).

## General Rules for All Developers:
1. No direct pushes to main: Every developer must work inside an independent feature branch.
2. Styling & RTL: Use Tailwind CSS exclusively with logical properties (ms-, me-, ps-, pe-, start-, end-) to support Arabic and English layouts without rewrites.
3. Form Validation & UI Components: Use React Hook Form with Zod for local validation schemas, and shadcn/ui or Radix UI for accessible components.
4. UI Focus: Build clean, responsive, and pixel-perfect UI screens as assigned below using React.

## Detailed UI Screen Assignments:

### 1. Amr Elawadly
* Assigned UI Module: Landing Page UI
* Target Files: `src/pages/LandingPage.tsx`, `src/components/landing/`
* Task: Build the complete landing page UI layout (Navbar, Hero section, and footer) using React with bilingual support.

### 2. Abdallah Ashraf
* Assigned UI Module: Internship Page UI
* Target Files: `src/pages/InternshipPage.tsx`, `src/components/internship/`
* Task: Build the complete internship overview interface and features section UI, including the interactive track filter.

### 3. Ali Hatem
* Assigned UI Module: Authentication - General Layout UI
* Target Files: `src/pages/auth/AuthMain.tsx`, `src/components/auth/AuthLayout.tsx`
* Task: Build the main authentication wrapper views, shared form layouts, and navigation UI containers.

### 4. Youssef Ahmed
* Assigned UI Module: Auth - Login UI
* Target Files: `src/pages/auth/Login.tsx`, `src/components/auth/LoginForm.tsx`
* Task: Build the complete email and password login interface UI alongside Google button mockup using React.

### 5. Renad Mansour
* Assigned UI Module: Auth - Forgot Password UI
* Target Files: `src/pages/auth/ForgotPassword.tsx`
* Task: Build the password recovery flow UI, including email input and validation error states.

### 6. Nora Abdelnabi
* Assigned UI Module: Auth - Phone OTP Login UI
* Target Files: `src/pages/auth/PhoneOTP.tsx`
* Task: Build the phone number entry screen UI with country code selector components and 6-digit OTP layout.

### 7. Gamal Wessam
* Assigned UI Module: All Onboarding Steps UI (01 to 10)
* Target Files: `src/pages/onboarding/OnboardingFlow.tsx`, `src/components/onboarding/steps/`
* Task: Build all 10 onboarding steps (registration, CV dropzone, interview check, payment mockup, timeline).

## How to Work & Create Your Branch:

1. Pull the latest changes from dev:
   ```bash
   git checkout dev
   git pull origin dev
   ```

2. Create and switch to your assigned feature branch:
   - Amr: `git checkout -b feature/landing-page`
   - Abdallah: `git checkout -b feature/internship-page`
   - Ali: `git checkout -b feature/auth-main`
   - Youssef: `git checkout -b feature/auth-login`
   - Renad: `git checkout -b feature/auth-forgot-password`
   - Nora: `git checkout -b feature/auth-phone-otp`
   - Gamal: `git checkout -b feature/onboarding-flow`
