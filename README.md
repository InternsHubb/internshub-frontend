# InternsHub Frontend UI Architecture & Task Assignments

The platform focuses purely on standalone Frontend UI screens, built using React, TypeScript (strict), Vite, and Tailwind CSS (no backend integration, relying on local state and mock data).

## General Rules for All Developers:
1. No direct pushes to main: Every developer must work inside an independent feature branch.
2. Styling & RTL: Use Tailwind CSS exclusively with logical properties (ms-, me-, ps-, pe-, start-, end-) to support Arabic and English layouts without rewrites.
3. Form Validation & UI Components: Use React Hook Form with Zod for local validation schemas, and shadcn/ui or Radix UI for accessible components.
4. UI Focus: Build clean, responsive, and pixel-perfect UI screens as assigned below.

## Detailed UI Screen Assignments:

### 1. Amr Elawadly
* Assigned UI Module: Landing Page UI
* Target Files:
  * `src/pages/LandingPage.tsx`
  * `src/components/landing/` (Navbar, Hero, Footer, Features)
* Detailed Tasks:
  * Build the complete landing page UI layout (Navbar, Hero section, and footer).
  * Apply Tailwind CSS logical RTL utilities for bilingual Arabic/English layout support.

### 2. Abdallah Ashraf
* Assigned UI Module: Internship Page UI
* Target Files:
  * `src/pages/InternshipPage.tsx`
  * `src/components/internship/` (TrackCard, FilterBar, FAQ)
* Detailed Tasks:
  * Build the complete internship overview interface and features section UI.
  * Develop the interactive "Choose Your Track" filtering UI component using local state.

### 3. Ali Hatem
* Assigned UI Module: Authentication - General Layout UI
* Target Files:
  * `src/pages/auth/AuthMain.tsx`
  * `src/components/auth/AuthLayout.tsx`
* Detailed Tasks:
  * Build the main authentication wrapper views, shared form layouts, and navigation UI containers.
  * Ensure accessible components and proper focus behavior using Radix UI primitives.

### 4. Youssef Ahmed
* Assigned UI Module: Auth - Login UI
* Target Files:
  * `src/pages/auth/Login.tsx`
  * `src/components/auth/LoginForm.tsx`
* Detailed Tasks:
  * Build the complete email and password login interface UI alongside Google button mockup.
  * Implement local error handling UI states (e.g., empty fields, invalid credentials view).

### 5. Renad Mansour
* Assigned UI Module: Auth - Forgot Password UI
* Target Files:
  * `src/pages/auth/ForgotPassword.tsx`
* Detailed Tasks:
  * Build the password recovery flow UI, including email input and validation error states.
  * Design the success state screen UI (Check your email confirmation view).

### 6. Nora Abdelnabi
* Assigned UI Module: Auth - Phone OTP Login UI
* Target Files:
  * `src/pages/auth/PhoneOTP.tsx`
* Detailed Tasks:
  * Build the phone number entry screen UI with country code selector components.
  * Implement the 6-digit OTP verification input layout UI with a simulated countdown timer.

### 7. Gamal Wessam
* Assigned UI Module: All Onboarding Steps UI (01 to 10)
* Target Files:
  * `src/pages/onboarding/OnboardingFlow.tsx`
  * `src/components/onboarding/steps/`
* Detailed Tasks:
  * Steps 01-04: Registration form UI, Terms & Privacy modals, dual verification views, and track selection UI.
  * Steps 05-06: CV upload dropzone UI mockup, Smart Review snapshot UI, and desktop-only interview media readiness UI check.
  * Steps 07-10: Assessment results screen UI, payment gateway checkout UI mockup (EGP currency format), and journey status timeline UI.
  
## How to Work & Create Your Branch:

To prevent code conflicts and keep our work organized, never push directly to the main branch. Follow these steps on your local machine:

1. Pull the latest changes from main:
   ```bash
   git checkout main
   git pull origin main
   ```

2. Create and switch to your assigned feature branch (choose the command matching your name below):

   - Amr (Landing Page):
     `git checkout -b feature/landing-page`

   - Abdallah (Internship Page):
     `git checkout -b feature/internship-page`

   - Ali (Auth General Flow):
     `git checkout -b feature/auth-main`

   - Youssef (Auth Login):
     `git checkout -b feature/auth-login`

   - Renad (Forgot Password):
     `git checkout -b feature/auth-forgot-password`

   - Nora (Phone OTP):
     `git checkout -b feature/auth-phone-otp`

   - Gamal (Onboarding Flow):
     `git checkout -b feature/onboarding-flow`

3. Commit and push your work when done:
   ```bash
   git add .
   git commit -m "feat: complete UI for my assigned module"
   git push origin feature/your-branch-name
   ```

4. Open a Pull Request (PR):
   Go to GitHub, open a Pull Request from your feature branch into dev, and wait for review and merge.
