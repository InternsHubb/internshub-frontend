import React, { useState } from 'react';

export default function CvStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [uploaded, setUploaded] = useState(false);
  return (
    <div className="w-full">
      <div className="mb-8">
        <span className="text-xs font-bold text-amber-600 tracking-wider uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          STEP 05 · INTERNSHUB ONBOARDING
        </span>
        <h1 className="text-4xl font-extrabold text-[#1A1025] mt-3 tracking-tight">Upload Your CV</h1>
        <p className="text-gray-500 mt-1">Your CV helps us understand your background.</p>
      </div>
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-8">
        <div onClick={() => setUploaded(!uploaded)} className="border-2 border-dashed border-purple-200 rounded-3xl p-10 text-center cursor-pointer bg-purple-50/20">
          <div className="w-14 h-14 bg-[#2D0C57] text-white rounded-2xl mx-auto flex items-center justify-center text-xl mb-4">↑</div>
          <p className="font-bold text-gray-800 text-lg">{uploaded ? 'CV added successfully' : 'Drop your CV here'}</p>
        </div>
      </div>
      <div className="flex justify-between items-center pt-4">
        <button onClick={onBack} className="px-6 py-3 font-semibold text-gray-600">Back</button>
        <button onClick={onNext} className="px-8 py-3 bg-[#2D0C57] text-white rounded-xl font-semibold">Continue to Interview →</button>
      </div>
    </div>
  );
}