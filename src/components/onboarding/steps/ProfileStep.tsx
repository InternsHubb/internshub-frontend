import React from 'react';

export default function ProfileStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="w-full">
      <div className="mb-8">
        <span className="text-xs font-bold text-amber-600 tracking-wider uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          STEP 03 · INTERNSHUB ONBOARDING
        </span>
        <h1 className="text-4xl font-extrabold text-[#1A1025] mt-3 tracking-tight">Let’s Get to Know You</h1>
        <p className="text-gray-500 mt-1">Add the essential details needed to set up your account.</p>
      </div>
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-8">
        <h4 className="font-bold text-gray-900 mb-6 text-xl">Your basic information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Full name</label>
            <input type="text" placeholder="Enter your full name" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Date of birth</label>
            <input type="date" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm" />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center pt-4">
        <button onClick={onBack} className="px-6 py-3 font-semibold text-gray-600">Back</button>
        <button onClick={onNext} className="px-8 py-3 bg-[#2D0C57] text-white rounded-xl font-semibold">Save & Continue →</button>
      </div>
    </div>
  );
}