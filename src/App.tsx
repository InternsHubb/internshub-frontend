import OnboardingFlow from "./pages/onboarding/OnboardingFlow";
import InternshipPage from "./pages/InternshipPage";

// TEMPORARY: path check until the team adds a router. Every other path keeps the onboarding view.
const INTERNSHIP_PATH = "/internship";

function App() {
  if (window.location.pathname === INTERNSHIP_PATH) {
    return <InternshipPage />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <OnboardingFlow />
    </div>
  );
}

export default App;
