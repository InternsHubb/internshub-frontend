import { useState } from "react";

export default function PathStep({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const [selectedPackage, setSelectedPackage] = useState(2);
  return (
    <div className="w-full">
      <div className="mb-8">
        <span className="text-xs font-bold text-amber-600 tracking-wider uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          STEP 04 · INTERNSHUB ONBOARDING
        </span>
        <h1 className="text-4xl font-extrabold text-[#1A1025] mt-3 tracking-tight">
          Choose Your Path to a Tech Career
        </h1>
        <p className="text-gray-500 mt-1">
          Choose the program duration and technology track.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          onClick={() => setSelectedPackage(1)}
          className={`p-6 rounded-3xl border cursor-pointer ${selectedPackage === 1 ? "border-[#581C87] bg-purple-50/10" : "bg-white"}`}
        >
          <h4 className="text-2xl font-extrabold text-gray-900">3 Months</h4>
          <p className="text-lg font-bold text-[#581C87] mt-1">3,000 EGP</p>
        </div>
        <div
          onClick={() => setSelectedPackage(2)}
          className={`p-6 rounded-3xl border cursor-pointer ${selectedPackage === 2 ? "border-[#581C87] bg-purple-50/10" : "bg-white"}`}
        >
          <h4 className="text-2xl font-extrabold text-gray-900">6 Months</h4>
          <p className="text-lg font-bold text-[#581C87] mt-1">5,500 EGP</p>
        </div>
        <div
          onClick={() => setSelectedPackage(3)}
          className={`p-6 rounded-3xl border cursor-pointer ${selectedPackage === 3 ? "border-[#581C87] bg-purple-50/10" : "bg-white"}`}
        >
          <h4 className="text-2xl font-extrabold text-gray-900">12 Months</h4>
          <p className="text-lg font-bold text-[#581C87] mt-1">9,500 EGP</p>
        </div>
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
          Confirm Path →
        </button>
      </div>
    </div>
  );
}
