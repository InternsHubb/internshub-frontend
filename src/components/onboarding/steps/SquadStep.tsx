import React from 'react';

export default function SquadStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="w-full">
      <div className="mb-8">
        <span className="text-xs font-bold text-amber-600 tracking-wider uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          STEP 09 · INTERNSHUB ONBOARDING
        </span>
        <h1 className="text-4xl font-extrabold text-[#1A1025] mt-3 tracking-tight">Your Journey Is About to Begin</h1>
        <p className="text-gray-500 mt-1">Your enrollment is confirmed. Preparing the next stage.</p>
      </div>
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-8">
        <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-4">JOURNEY STATUS</h3>
        <p className="text-sm font-bold text-gray-900">Waiting for squad assignment</p>
      </div>
      <div className="flex justify-between items-center pt-4">
        <button onClick={onBack} className="px-6 py-3 font-semibold text-gray-600">Back</button>
        <button onClick={onNext} className="px-8 py-3 bg-[#2D0C57] text-white rounded-xl font-semibold">Explore Mentorship →</button>
      </div>
    </div>
  );
}