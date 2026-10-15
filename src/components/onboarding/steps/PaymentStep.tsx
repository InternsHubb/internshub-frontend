import React from 'react';

export default function PaymentStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="w-full">
      <div className="mb-8">
        <span className="text-xs font-bold text-amber-600 tracking-wider uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          STEP 08 · INTERNSHUB ONBOARDING
        </span>
        <h1 className="text-4xl font-extrabold text-[#1A1025] mt-3 tracking-tight">Complete Your Enrollment</h1>
        <p className="text-gray-500 mt-1">Review your selected package and securely complete enrollment.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h4 className="font-bold text-gray-900 mb-6 text-xl">Choose how you’ll pay</h4>
          <div className="p-4 border-2 border-[#581C87] bg-purple-50/20 rounded-2xl flex justify-between items-center mb-4">
            <span className="font-bold text-sm">Debit or credit card (EGP)</span>
          </div>
          <button onClick={onNext} className="w-full bg-[#2D0C57] text-white py-4 rounded-xl font-semibold">Pay & Enroll (5,500 EGP) →</button>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h4 className="font-bold text-gray-900 mb-6 text-xl">Order Summary</h4>
          <p className="text-sm text-gray-600">Total in EGP: <strong>5,500 EGP</strong></p>
        </div>
      </div>
      <div className="flex justify-between items-center pt-4">
        <button onClick={onBack} className="px-6 py-3 font-semibold text-gray-600">Back</button>
        <button onClick={onNext} className="px-8 py-3 bg-[#2D0C57] text-white rounded-xl font-semibold">Preview Waiting Stage →</button>
      </div>
    </div>
  );
}