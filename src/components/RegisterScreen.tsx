import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import LegalModal from './LegalModal';
import studentImage from '../assets/Image (Students beginning a collaborative technology journey).png';

const NATIONAL_ID_LENGTH = 14;

export default function RegisterScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    nationalId: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', content: '' });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\d{10,11}$/.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Enter a valid phone number.';
    }
    const nationalId = formData.nationalId.trim();
    if (!nationalId) {
      newErrors.nationalId = 'National ID is required.';
    } else if (!/^\d+$/.test(nationalId)) {
      newErrors.nationalId = 'National ID must contain digits only.';
    } else if (nationalId.length !== NATIONAL_ID_LENGTH) {
      newErrors.nationalId = 'National ID must be exactly 14 digits.';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms and Conditions.';
    }
    return newErrors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setSubmissionError(null);
      navigate(ROUTES.onboarding);
    }
  };

  const togglePrototypeError = () => {
    if (submissionError) {
      setSubmissionError(null);
    } else {
      setSubmissionError('An account with this National ID or Email already exists. Please sign in instead.');
    }
  };

  const openModal = (type: 'terms' | 'privacy') => {
    if (type === 'terms') {
      setModalConfig({
        isOpen: true,
        title: 'Terms of Service',
        content: 'Welcome to InternsHub. By registering, you agree to comply with and be bound by our platform training rules, mentorship guidelines, and code of conduct.'
      });
    } else {
      setModalConfig({
        isOpen: true,
        title: 'Privacy Policy',
        content: 'InternsHub protects your data. We utilize your National ID, email, and contact details strictly for onboarding verification and certification.'
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#FEFEFE] font-sans antialiased text-[#111827]">
      <div className="w-full min-h-screen flex flex-col lg:flex-row">
        
        {/* Left Dark Purple Branding Section */}
        <div 
          className="w-full lg:w-[45%] p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden shrink-0"
          style={{
            background: 'radial-gradient(circle at 100% 100%, rgba(139, 93, 176, 0.45) 0%, transparent 60%), linear-gradient(165deg, #240338 0%, #3B0454 45%, #4F0870 75%, #5D0B84 100%)'
          }}
        >
          {/* Top Brand Header: EDTECH directly next to InternsHub */}
          <div className="flex items-center space-x-3 relative z-10">
            <div className="w-9 h-9 rounded-xl bg-white text-[#3B0454] flex items-center justify-center font-extrabold text-base shadow-sm">
              ih
            </div>
            <span className="text-xl font-bold tracking-tight text-white">InternsHub</span>
            <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/10 text-white/90 border border-white/10 ml-2">
              EDTECH
            </span>
          </div>

          {/* Central Hero Image Card with Asymmetric Top-Left Arch Curve and Step Pill */}
          <div className="relative z-10 my-6 flex flex-col items-center">
            {/* Image Container with Custom Asymmetric Top-Left Arch Curve matching Figma */}
            <div 
              className="w-full h-64 lg:h-72 overflow-hidden shadow-2xl relative"
              style={{
                borderRadius: '96px 28px 28px 28px'
              }}
            >
              <img 
                src={studentImage} 
                alt="Students beginning a collaborative technology journey" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Overlapping White Progress Pill */}
            <div className="w-[90%] -mt-7 bg-white rounded-2xl py-3 px-4 shadow-xl text-gray-900 relative z-20 border border-gray-100">
              <div className="flex items-center justify-between text-xs">
                {/* Step 1: Active/Completed */}
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-[6px] bg-[#0F973D] text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                    ✓
                  </div>
                  <span className="font-semibold text-gray-900 text-[11px] whitespace-nowrap">Create your account</span>
                </div>

                <div className="h-[1px] bg-gray-200 flex-1 mx-2 sm:mx-3"></div>

                {/* Step 2 */}
                <div className="flex items-center space-x-1.5 text-gray-400">
                  <div className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-[10px] font-medium">
                    2
                  </div>
                  <span className="text-gray-400 text-[11px] font-normal hidden sm:inline whitespace-nowrap">Build your profile</span>
                </div>

                <div className="h-[1px] bg-gray-200 flex-1 mx-2 sm:mx-3"></div>

                {/* Step 3 */}
                <div className="flex items-center space-x-1.5 text-gray-400">
                  <div className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-[10px] font-medium">
                    3
                  </div>
                  <span className="text-gray-400 text-[11px] font-normal hidden sm:inline whitespace-nowrap">Choose your path</span>
                </div>
              </div>
            </div>
          </div>

          {/* Value Headline & Description */}
          <div className="relative z-10 space-y-2.5 mt-2">
            <p className="text-[11px] font-bold tracking-widest text-[#DD6F0D] uppercase">
              START YOUR INTERNSHUB JOURNEY
            </p>
            <h1 className="text-3xl lg:text-[40px] font-extrabold tracking-tight leading-[1.15] text-white">
              Turn your potential<br className="hidden sm:inline" /> into a tech career.
            </h1>
            <p className="text-white/80 text-xs sm:text-[13px] leading-relaxed max-w-lg">
              Create one account to begin a structured journey through learning, practical<br className="hidden sm:inline" /> experience, and mentorship.
            </p>
          </div>

          {/* Bottom Footer Tags */}
          <div className="relative z-10 pt-6 flex items-center space-x-6 text-xs text-white/60 font-medium">
            <span>Learn</span>
            <div className="h-[1px] w-8 bg-white/20"></div>
            <span>Practice</span>
            <div className="h-[1px] w-8 bg-white/20"></div>
            <span>Grow</span>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="w-full lg:w-[55%] bg-[#FEFEFE] px-6 py-8 sm:px-10 lg:px-14 flex flex-col justify-between overflow-y-auto">
          {/* Strictly constrained container matching Figma width */}
          <div 
            className="w-full mx-auto my-auto flex flex-col justify-between min-h-full py-4"
            style={{ maxWidth: '470px' }}
          >
            {/* Top Form Header */}
            <div>
              <div className="mb-6">
                <span className="text-[10px] font-bold tracking-wider text-[#DD6F0D] uppercase bg-[#FFF4EC] px-2.5 py-1 rounded-md inline-block">
                  JOIN INTERNSHUB
                </span>
                <h2 className="text-2xl sm:text-[32px] font-extrabold text-[#111827] tracking-tight mt-2.5">
                  Create your account
                </h2>
                <p className="text-xs text-[#5C5C5C] mt-1">
                  Start your journey from student to tech professional.
                </p>
              </div>

              {submissionError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start space-x-2">
                  <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                  </svg>
                  <span>{submissionError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                
                {/* Full Name & Email Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-[#111827] mb-1.5">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-xs transition-all outline-none bg-[#FAFAFA] text-[#111827] placeholder:text-[#6B7280]/70 ${
                        errors.fullName 
                          ? 'border-[#B42318] bg-[#FFF8F7]' 
                          : 'border-gray-200 focus:border-[#3B0454] focus:bg-white'
                      }`}
                    />
                    {errors.fullName && <p className="mt-1 text-[11px] text-[#B42318] font-medium">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#111827] mb-1.5">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-xs transition-all outline-none bg-[#FAFAFA] text-[#111827] placeholder:text-[#6B7280]/70 ${
                        errors.email 
                          ? 'border-[#B42318] bg-[#FFF8F7]' 
                          : 'border-gray-200 focus:border-[#3B0454] focus:bg-white'
                      }`}
                    />
                    {errors.email && <p className="mt-1 text-[11px] text-[#B42318] font-medium">{errors.email}</p>}
                  </div>
                </div>

                {/* Phone Number with integrated selector */}
                <div>
                  <label className="block text-xs font-medium text-[#111827] mb-1.5">Phone Number</label>
                  <div className={`flex items-center rounded-xl border transition-all bg-[#FAFAFA] ${
                    errors.phone 
                      ? 'border-[#B42318] bg-[#FFF8F7]' 
                      : 'border-gray-200 focus-within:border-[#3B0454] focus-within:bg-white'
                  }`}>
                    <div className="flex items-center pl-3.5 pr-2.5 py-2.5 text-xs text-[#111827] font-normal whitespace-nowrap select-none">
                      <span>Egypt (+20)</span>
                      <svg className="w-3.5 h-3.5 text-gray-400 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <div className="h-4 w-[1px] bg-gray-200"></div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10 1234 5678"
                      className="w-full px-3 py-2.5 text-xs outline-none bg-transparent placeholder:text-[#6B7280]/70 text-[#111827]"
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-[11px] text-[#B42318] font-medium">{errors.phone}</p>}
                </div>

                {/* National ID */}
                <div>
                  <label htmlFor="register-national-id" className="block text-xs font-medium text-[#111827] mb-1.5">National ID</label>
                  <input
                    id="register-national-id"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={NATIONAL_ID_LENGTH}
                    aria-invalid={Boolean(errors.nationalId)}
                    aria-describedby={errors.nationalId ? 'register-national-id-error' : undefined}
                    name="nationalId"
                    value={formData.nationalId}
                    onChange={handleChange}
                    placeholder="Enter your 14-digit national ID"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs transition-all outline-none bg-[#FAFAFA] text-[#111827] placeholder:text-[#6B7280]/70 ${
                      errors.nationalId 
                        ? 'border-[#B42318] bg-[#FFF8F7]' 
                        : 'border-gray-200 focus:border-[#3B0454] focus:bg-white'
                    }`}
                  />
                  {errors.nationalId && <p id="register-national-id-error" className="mt-1 text-[11px] text-[#B42318] font-medium">{errors.nationalId}</p>}
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-[#111827] mb-1.5">Password</label>
                    <div className={`flex items-center rounded-xl border bg-[#FAFAFA] pr-3 transition-all ${
                      errors.password 
                        ? 'border-[#B42318] bg-[#FFF8F7]' 
                        : 'border-gray-200 focus-within:border-[#3B0454] focus-within:bg-white'
                    }`}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        className="w-full pl-3.5 pr-2 py-2.5 text-xs outline-none bg-transparent placeholder:text-[#6B7280]/70 text-[#111827]"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="text-gray-400 hover:text-gray-600 focus:outline-none p-0.5"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-[11px] text-[#B42318] font-medium">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#111827] mb-1.5">Confirm Password</label>
                    <div className={`flex items-center rounded-xl border bg-[#FAFAFA] pr-3 transition-all ${
                      errors.confirmPassword 
                        ? 'border-[#B42318] bg-[#FFF8F7]' 
                        : 'border-gray-200 focus-within:border-[#3B0454] focus-within:bg-white'
                    }`}>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter your password"
                        className="w-full pl-3.5 pr-2 py-2.5 text-xs outline-none bg-transparent placeholder:text-[#6B7280]/70 text-[#111827]"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                        className="text-gray-400 hover:text-gray-600 focus:outline-none p-0.5"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-[11px] text-[#B42318] font-medium">{errors.confirmPassword}</p>}
                  </div>
                </div>

                {/* Terms of Service Box (Figma design container) */}
                <div>
                  <div className={`flex items-center px-3.5 py-3 rounded-xl border transition-all ${
                    errors.agreeTerms 
                      ? 'border-[#B42318] bg-[#FFF8F7]' 
                      : 'border-gray-200 bg-[#FAFAFA]'
                  }`}>
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-gray-300 text-[#3B0454] focus:ring-[#3B0454] cursor-pointer accent-[#3B0454]"
                    />
                    <label htmlFor="agreeTerms" className="ml-2.5 text-xs text-[#5C5C5C] cursor-pointer select-none">
                      I agree to the <button type="button" onClick={() => openModal('terms')} className="text-[#3B0454] font-semibold underline">Terms of Service</button> and <button type="button" onClick={() => openModal('privacy')} className="text-[#3B0454] font-semibold underline">Privacy Policy</button>.
                    </label>
                  </div>
                  {errors.agreeTerms && <p className="mt-1 text-[11px] text-[#B42318] font-medium">{errors.agreeTerms}</p>}
                </div>

                {/* Submit Button (Primary Purple 900 - #3B0454) */}
                <button
                  type="submit"
                  className="w-full mt-2 rounded-xl bg-[#3B0454] hover:bg-[#2A033C] active:scale-[0.99] py-3.5 px-4 text-xs font-bold text-white shadow-sm transition duration-150 flex items-center justify-center space-x-2"
                >
                  <span>Create Account</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>

              {/* Login link & Prototype error preview */}
              <div className="text-center mt-3 text-xs text-[#5C5C5C]">
                Already have an account? <Link to={ROUTES.login} className="font-semibold text-[#3B0454] hover:underline">Log in</Link>
              </div>
              <div className="text-center mt-1">
                <button
                  type="button"
                  onClick={togglePrototypeError}
                  className="text-[10px] text-gray-400 hover:text-gray-600 underline cursor-pointer"
                >
                  Prototype: preview registration submission error
                </button>
              </div>
            </div>

            {/* Bottom Help Footer */}
            <div className="w-full pt-6 border-t border-gray-200 mt-12 flex items-center justify-between text-xs text-gray-400">
              <span>Need help creating your account?</span>
              <a href="#" className="font-semibold text-[#3B0454] hover:underline">Visit Help Center</a>
            </div>

          </div>
        </div>
      </div>

      <LegalModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        content={modalConfig.content}
        onClose={() => setModalConfig({ isOpen: false, title: '', content: '' })}
      />
    </div>
  );
}
