import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, X, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { UserProfile } from '../types';
import { toPersianDigits } from '../utils/translations';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '']);
  const [timer, setTimer] = useState(120);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: any;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Focus first OTP input on step change
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  if (!isOpen) return null;

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = phone.trim();
    if (!clean || clean.length < 10) {
      setErrorMsg('لطفاً شماره موبایل معتبر وارد نمایید');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await api.sendOtp(clean);
      if (res.devCode) {
        setDevCode(res.devCode);
      }
      setOtpDigits(['', '', '', '', '']);
      setStep('otp');
      setTimer(120);
    } catch (err: any) {
      setErrorMsg(err.message || 'خطا در ارسال کد تایید پیامکی');
    } finally {
      setLoading(false);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    // Only take the last character typed
    const digit = value.slice(-1);
    if (digit && !/^\d+$/.test(digit)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    if (digit && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }

    // If all 5 digits are entered, automatically verify
    const fullCode = newDigits.join('');
    if (fullCode.length === 5 && !newDigits.includes('')) {
      submitVerification(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    const digits = pasted.replace(/\D/g, '').slice(0, 5).split('');
    if (digits.length === 0) return;

    const newDigits = ['', '', '', '', ''];
    digits.forEach((d, idx) => {
      if (idx < 5) newDigits[idx] = d;
    });
    setOtpDigits(newDigits);

    const nextIndex = Math.min(digits.length, 4);
    inputRefs.current[nextIndex]?.focus();

    if (digits.length === 5) {
      submitVerification(digits.join(''));
    }
  };

  const submitVerification = async (codeToVerify: string) => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await api.verifyOtp({
        phone: phone.trim(),
        code: codeToVerify,
      });

      onLoginSuccess(res.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'کد تایید وارد شده نادرست است');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpDigits.join('');
    if (fullCode.length !== 5) {
      setErrorMsg('کد تایید ۵ رقمی را کامل وارد کنید');
      return;
    }
    submitVerification(fullCode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 text-right font-vazir animate-fadeIn">
      <div className="w-full max-w-[380px] p-4 sm:p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-lg text-[#A8A49B] hover:text-[#F8F5EF] hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-400 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Phone Input */}
        {step === 'phone' ? (
          <div className="space-y-6">
            {/* Top Logo Badge */}
            <div className="text-center pt-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C9A24D] to-[#8A6A32] flex items-center justify-center text-[#020F1E] mx-auto shadow-lg shadow-[#C9A24D]/25">
                <svg
                  className="w-9 h-9"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-[#F8F5EF] mt-4 tracking-tight font-amiri">
                ورود به کاخ شایگان
              </h1>
              <p className="text-xs text-[#A8A49B] mt-1.5 font-medium">
                جهت ورود یا عضویت، شماره موبایل خود را وارد کنید:
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <input
                  type="tel"
                  dir="ltr"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="شماره موبایل (مثال: 09123457890)"
                  className="w-full h-12 bg-[#020F1E] border border-[#C9A24D]/40 focus:border-[#f0d47c] focus:ring-2 focus:ring-[#C9A24D]/20 rounded-xl px-4 text-center font-mono text-base font-bold text-[#F8F5EF] placeholder:text-[#A8A49B]/50 placeholder:font-vazir placeholder:text-xs outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#C9A24D] to-[#8A6A32] hover:brightness-110 active:scale-[0.99] text-[#020F1E] font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'در حال ارسال کد...' : 'دریافت کد تایید'}
              </button>
            </form>
          </div>
        ) : (
          /* STEP 2: OTP Verification */
          <div className="space-y-5">
            {/* Top Back Arrow */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="p-1.5 rounded-lg text-[#A8A49B] hover:text-[#F8F5EF] hover:bg-white/10 transition-colors cursor-pointer"
                title="بازگشت"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h1 className="text-xl font-black text-[#F8F5EF] font-amiri">
                تایید شماره موبایل
              </h1>
              <p className="text-xs text-[#A8A49B] leading-relaxed mt-2">
                کد تایید ۵ رقمی ارسال شده به شماره <span className="font-bold text-[#f0d47c] font-mono">{toPersianDigits(phone)}</span> را با ارقام انگلیسی وارد کنید:
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              {/* 5 OTP Digit Boxes */}
              <div className="flex items-center justify-center gap-2.5 my-3" dir="ltr">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={idx === 0 ? handlePaste : undefined}
                    className="w-12 h-14 sm:w-13 sm:h-14 rounded-xl border border-[#C9A24D]/40 bg-[#020F1E] focus:border-[#f0d47c] focus:ring-2 focus:ring-[#C9A24D]/25 text-center font-mono text-xl font-black text-[#F8F5EF] outline-none transition-all"
                  />
                ))}
              </div>

              {/* Action Button / Timer */}
              <button
                type="button"
                disabled={timer > 0 || loading}
                onClick={() => handleSendOtp()}
                className={`w-full h-12 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center cursor-pointer border ${
                  timer > 0
                    ? 'bg-white/5 border-white/10 text-[#A8A49B] cursor-not-allowed'
                    : 'bg-[#020F1E] border-[#C9A24D]/50 text-[#f0d47c] hover:bg-[#C9A24D]/15'
                }`}
              >
                {timer > 0 ? `ارسال مجدد کد (${toPersianDigits(timer)} ثانیه)` : 'ارسال مجدد کد پیامکی'}
              </button>

              <button
                type="submit"
                disabled={loading || otpDigits.includes('')}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#C9A24D] to-[#8A6A32] hover:brightness-110 active:scale-[0.99] text-[#020F1E] font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'در حال بررسی...' : 'تایید و ورود به کاخ'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
