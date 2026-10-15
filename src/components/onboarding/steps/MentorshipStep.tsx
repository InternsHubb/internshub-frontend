import React from 'react';

export default function MentorshipStep({ onBack }: { onBack: () => void }) {
  return (
    <div className="w-full">
      <div className="mb-8">
        <span className="text-xs font-bold text-amber-600 tracking-wider uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          STEP 10 · INTERNSHUB ONBOARDING
        </span>
        <h1 className="text-4xl font-extrabold text-[#1A1025] mt-3 tracking-tight">Learn from People Who’s Been There</h1>
        <p className="text-gray-500 mt-1">Book a session with a mentor who understands your track.</p>
      </div>
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-8">
        <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-4">Choose a mentor</h3>
        <div className="p-5 rounded-2xl border-2 border-[#581C87] bg-purple-50/20">
          <h4 className="font-bold text-gray-900">Amina M.</h4>
          <p className="text-xs text-gray-500">Senior Frontend Engineer</p>
        </div>
      </div>
      <div className="flex justify-between items-center pt-4">
        <button onClick={onBack} className="px-6 py-3 font-semibold text-gray-600">Back</button>
        <button onClick={() => alert('Onboarding completed successfully!')} className="px-8 py-3 bg-emerald-700 text-white rounded-xl font-semibold">Confirm Booking ✓</button>
      </div>
    </div>
  );
}