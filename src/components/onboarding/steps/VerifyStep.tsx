import React from 'react';

export default function VerifyStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="w-full">
      <div className="mb-8">
        <span className="text-xs font-bold text-amber-600 tracking-wider uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          STEP 02 · INTERNSHUB ONBOARDING
        </span>
        <h1 className="text-4xl font-extrabold text-[#1A1025] mt-3 tracking-tight">Verify Your Account</h1>
        <p className="text-gray-500 mt-1">Confirm your email, phone number and National ID to secure your account.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-2">Email verification</h3>
          <p className="text-xs text-gray-600 mb-4">Enter the 6-digit code sent to your email.</p>
          <button onClick={onNext} className="w-full bg-[#581C87] text-white py-3 rounded-xl font-semibold hover:bg-[#47146e]">Verify Email</button>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm opacity-60">
          <h3 className="font-bold text-gray-900 mb-2">Phone verification</h3>
          <p className="text-xs text-gray-600 mb-4">Code sent via SMS.</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm opacity-60">
          <h3 className="font-bold text-gray-900 mb-2">National ID</h3>
          <p className="text-xs text-gray-600 mb-4">14 digits verification.</p>
        </div>
      </div>
      <div className="flex justify-between items-center pt-4">
        <button onClick={onBack} className="px-6 py-3 font-semibold text-gray-600">Back</button>
        <button onClick={onNext} className="px-8 py-3 bg-gray-900 text-white rounded-xl font-semibold">Continue →</button>
      </div>
    </div>
  );
}