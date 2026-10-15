# InternsHub Frontend Architecture & Role Specifications

The platform is built using React, TypeScript (strict), Vite, and Tailwind CSS (Frontend UI Standalone, no backend integration, utilizing mock data and local state).

## General Rules for All Developers:
1. No direct pushes to main: Every developer must work inside an independent feature branch.
2. Styling & RTL: Use Tailwind CSS exclusively with logical properties (ms-, me-, ps-, pe-, start-, end-) to support Arabic and English layouts without rewrites.
3. Form Validation: Use React Hook Form integrated with Zod schemas for structural validation.
4. Localization & Utilities: Use i18next for strings, date-fns for dates, and the built-in Intl API for currency formatting (EGP).

## Detailed File Structure & Task Assignments:

### 1. Amr Elawadly
* Assigned Module: Landing Page
* Target Files:
  * `src/pages/LandingPage.tsx`
  * `src/components/landing/` (Navbar, Hero, Footer, Features)
* Detailed Tasks:
  * Build the complete landing page layout (Navbar, Hero section, and footer).
  * Implement static prerendering (vite-react-ssg) for optimized public page SEO.
  * Apply Tailwind CSS logical RTL utilities and i18next for bilingual text rendering.

### 2. Abdallah Ashraf
* Assigned Module: Internship Page
* Target Files:
  * `src/pages/InternshipPage.tsx`
  * `src/components/internship/` (TrackCard, FilterBar, FAQ)
* Detailed Tasks:
  * Build the complete internship overview interface and features section.
  * Develop the interactive "Choose Your Track" filtering component with local state handling.
  * Integrate localized typography and responsive grids using shadcn/ui and Radix UI accessibility primitives.

### 3. Ali Hatem
* Assigned Module: Authentication - General/Main Flow
* Target Files:
  * `src/pages/auth/AuthMain.tsx`
  * `src/components/auth/AuthLayout.tsx`
* Detailed Tasks:
  * Build the main authentication wrapper views, shared form layouts, and initial routing views.
  * Implement forms using React Hook Form and Zod schemas for client-side structural validation.
  * Ensure accessible components and proper focus behavior using Radix UI primitives.

### 4. Youssef Ahmed
* Assigned Module: Auth - Login
* Target Files:
  * `src/pages/auth/Login.tsx`
* Detailed Tasks:
  * Build the complete email and password login interface alongside Google Identity Services button integration.
  * Implement error handling UI states (e.g., empty fields, invalid credentials).
  * Style using Tailwind CSS and shadcn/ui input components with strict RTL alignment.

### 5. Renad Mansour
* Assigned Module: Auth - Forgot Password
* Target Files:
  * `src/pages/auth/ForgotPassword.tsx`
* Detailed Tasks:
  * Build the complete password recovery flow, including email input and validation errors.
  * Design the success state screen (Check your email) and server error handling UI.
  * Use React Hook Form and Zod for local email format validation.

### 6. Nora Abdelnabi
* Assigned Module: Auth - Phone OTP Login
* Target Files:
  * `src/pages/auth/PhoneOTP.tsx`
* Detailed Tasks:
  * Build the phone number entry screen with country code selectors.
  * Implement the 6-digit OTP verification input layout with local countdown timer simulation.
  * Design verification error states (Incorrect code) and success confirmations (Phone verified).

### 7. Gamal Wessam
* Assigned Module: All Onboarding Steps (01 to 10)
* Target Files:
  * `src/pages/onboarding/OnboardingFlow.tsx`
  * `src/components/onboarding/steps/`
* Detailed Tasks:
  * Steps 01-04: Registration form using React Hook Form and Zod, Terms & Privacy modals, dual verification, age validation, and package/track selection.
  * Steps 05-06: CV upload dropzone (react-dropzone verifying size limits), Smart Review snapshot, and desktop-only interview media readiness checks (getUserMedia) displaying a mobile fallback screen.
  * Steps 07-10: Assessment results screens, payment gateway checkout interface (EGP formatting via built-in Intl API), journey status timeline, and mentorship slot booking using date-fns for timezone management.
  ## How to Work & Create Your Branch:

To prevent code conflicts and keep our work organized, never push directly to the main branch. Follow these steps on your local machine:

1. Pull the latest changes from main:
   ```*in terminal*
   
   git checkout main
   git pull origin main
Create and switch to your assigned feature branch (choose the command matching your name below): #USE TERMINAL#

#Amr (Landing Page):

git checkout -b feature/landing-page

#Abdallah (Internship Page):

git checkout -b feature/internship-page

#Ali (Auth General Flow):

git checkout -b feature/auth-main

#Youssef (Auth Login):

git checkout -b feature/auth-login

#Renad (Forgot Password):

git checkout -b feature/auth-forgot-password

#Nora (Phone OTP):

git checkout -b feature/auth-phone-otp

#Gamal (Onboarding Flow):

git checkout -b feature/onboarding-flow

Commit and push your work when done:


git add .

git commit -m "feat: complete UI for my assigned module"

git push origin feature/your-branch-name

Open a Pull Request (PR):

Go to GitHub, open a Pull Request from your feature branch into main, and wait for review and merge.
