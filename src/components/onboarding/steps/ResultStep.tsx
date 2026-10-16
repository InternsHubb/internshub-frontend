export default function ResultStep({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="w-full">
      <div className="mb-8">
        <span className="text-xs font-bold text-amber-600 tracking-wider uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          STEP 07 · INTERNSHUB ONBOARDING
        </span>
        <h1 className="text-4xl font-extrabold text-[#1A1025] mt-3 tracking-tight">
          Your Assessment Results
        </h1>
        <p className="text-gray-500 mt-1">
          A clear, supportive view of your interview outcome.
        </p>
      </div>
      <div className="bg-gradient-to-br from-[#2D0C57] to-[#1A0B2E] p-10 rounded-3xl text-white mb-8 shadow-xl">
        <h2 className="text-3xl font-extrabold">
          Recommended level: [Assessment output]
        </h2>
      </div>
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={onBack}
          className="px-6 py-3 font-semibold text-gray-600"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-8 py-3 bg-[#2D0C57] text-white rounded-xl font-semibold"
        >
          Continue to Payment →
        </button>
      </div>
    </div>
  );
}
