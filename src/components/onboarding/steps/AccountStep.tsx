export default function AccountStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
      <div className="mb-6">
        <span className="text-xs font-bold text-amber-600 tracking-wider uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          STEP 01 · INTERNSHUB ONBOARDING
        </span>
        <h1 className="text-3xl font-extrabold text-[#1A1025] mt-3 tracking-tight">
          Create Your Account
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Get started with your technical journey at InternsHub.
        </p>
      </div>
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Email Address
          </label>
          <input
            type="email"
            placeholder="name@example.com"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#581C87]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="At least 8 characters"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#581C87]"
          />
        </div>
      </div>
      <button
        onClick={onNext}
        className="w-full bg-[#2D0C57] text-white py-3.5 rounded-xl font-semibold hover:bg-[#1a0b36] transition shadow-md"
      >
        Create Account & Continue →
      </button>
    </div>
  );
}
