import OnboardingFlow from "./pages/onboarding/OnboardingFlow";
import InternshipPage from "./pages/InternshipPage";
import PhoneOTP from "./pages/auth/PhoneOTP";

const INTERNSHIP_PATH = "/internship";
const PHONE_OTP_PATH = "/auth/phone-otp";

function App() {
  if (window.location.pathname === INTERNSHIP_PATH) {
    return <InternshipPage />;
  }

  if (window.location.pathname === PHONE_OTP_PATH) {
    return <PhoneOTP />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <OnboardingFlow />
    </div>
  );
}

export default App;