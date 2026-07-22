// app/login/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import { sendOTPAction } from "@/app/actions/auth";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaSpinner, FaArrowRight, FaGoogle, FaGithub } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1); // ۱: وارد کردن ایمیل، ۲: وارد کردن کد تایید
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(5).fill("")); // مدیریت مجزای ۵ رقم کد
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);

  // مرجع فیلدهای ورودی برای مدیریت هوشمند فوکوس روی فیلدهای کد ۵ رقمی
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // تایمر معکوس جهت ارسال مجدد کد
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // درخواست ارسال کد به ایمیل
  const handleSendOTP = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    
    // پاک کردن مقادیر قبلی کد تایید جهت آماده‌سازی برای ورود رمز جدید
    setOtp(Array(5).fill(""));

    const res = await sendOTPAction(email);
    setLoading(false);

    if (res.success) {
      setStep(2);
      setTimer(120); // تایمر ۲ دقیقه‌ای برای ارسال مجدد
      setMessage("کد تایید با موفقیت به ایمیل شما ارسال شد.");
      // فوکوس اتوماتیک روی اولین خانه کد بعد از رندر فیلدها یا ریست شدن آن‌ها
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } else {
      setError(res.error || "مشکلی پیش آمد.");
    }
  };

  // مدیریت ورود حروف و پرش اتوماتیک فوکوس در فیلدهای کد تایید
  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return; // فقط پذیرش اعداد

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // فقط آخرین کاراکتر وارد شده را ذخیره کن
    setOtp(newOtp);

    // انتقال اتوماتیک فوکوس به فیلد بعدی
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // دکمه Backspace برای بازگشت به فیلد قبلی
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // تایید نهایی کد ۵ رقمی و ورود کاربر از طریق NextAuth
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const enteredCode = otp.join("");
    if (enteredCode.length !== 5) {
      setError("لطفاً کد تایید ۵ رقمی را به صورت کامل وارد کنید.");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      code: enteredCode,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("کد تایید اشتباه یا منقضی شده است.");
    } else {
      router.push("/"); // هدایت به صفحه اصلی پس از ورود موفقیت‌آمیز
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 transition-colors duration-300 relative overflow-hidden">
      
      {/* دایره‌های تزیینی متحرک پس‌زمینه */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-violet-400/20 dark:bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <section className="w-full max-w-md bg-white/70 dark:bg-gray-950 backdrop-blur-md rounded-3xl border border-slate-200/50 dark:border-zinc-800/50 p-8 shadow-2xl relative z-10">
        
        {/* هدر صفحه ورود */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-zinc-50 mb-2">
            خوش آمدید
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            {step === 1 ? "ایمیل خود را جهت دریافت کد ورود موقت وارد کنید" : "کد ۵ رقمی فرستاده شده را وارد کنید"}
          </p>
        </div>

        {/* بخش پیام‌های سیستم با ویژگی‌های منحصر‌به‌فرد key */}
        <div className="min-h-[48px]">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error-alert"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/40 text-xs text-red-600 dark:text-red-400 rounded-xl text-center font-semibold"
              >
                {error}
              </motion.div>
            )}

            {message && (
              <motion.div
                key="success-alert"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40 text-xs text-emerald-600 dark:text-emerald-400 rounded-xl text-center font-semibold"
              >
                {message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* فرم ثبت نام / ورود دو مرحله‌ای */}
        <AnimatePresence mode="wait">
          {step === 1 ? (
            // مرحله اول: دریافت ایمیل
            <motion.form
              key="step-email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSendOTP}
              className="space-y-4"
            >
              <div className="relative">
                <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 text-sm" />
                <input
                  type="email"
                  required
                  placeholder="ایمیل شما (مثال: user@example.com)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-4 pr-11 py-3 text-sm bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-slate-800 dark:text-zinc-100 transition-all duration-200 text-left placeholder:text-right placeholder:text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-sm font-bold text-white rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200"
              >
                {loading ? (
                  <FaSpinner className="animate-spin text-base" />
                ) : (
                  <>
                    <span>دریافت کد تایید</span>
                    <FaArrowRight className="text-xs rotate-180" />
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            // مرحله دوم: دریافت کد ۵ رقمی و دکمه بازگشت به عقب
            <motion.form
              key="step-otp"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleVerifyOTP}
              className="space-y-6"
            >
              <div className="flex justify-between gap-2 max-w-[280px] mx-auto" dir="ltr">
                {otp.map((digit, idx) => (
                  <input
                    key={`otp-input-${idx}`}
                    id={`otp-${idx}`}
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                    className="w-11 h-12 text-center text-lg font-bold bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-slate-800 dark:text-zinc-100 transition-all duration-200"
                  />
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-sm font-bold text-white rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-200"
                >
                  {loading ? (
                    <FaSpinner className="animate-spin text-base" />
                  ) : (
                    <span>تایید و ورود</span>
                  )}
                </button>

                <div className="flex items-center justify-between mt-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-slate-500 dark:text-zinc-400 hover:text-blue-500 transition-colors duration-200 flex items-center gap-1"
                  >
                    <FaArrowRight className="text-[10px]" />
                    <span>ویرایش ایمیل</span>
                  </button>

                  <div>
                    {timer > 0 ? (
                      <span className="text-slate-400 dark:text-zinc-500">
                        ارسال مجدد کد تا {timer} ثانیه دیگر
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        className="text-blue-600 hover:text-blue-700 font-bold hover:underline"
                      >
                        ارسال مجدد کد تایید
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* دکمه‌های ورود با اکانت‌های اجتماعی */}
        <div className="mt-8">
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-slate-200/80 dark:border-zinc-800" />
            <span className="flex-shrink mx-4 text-xs text-slate-400 dark:text-zinc-500">یا ورود با شبکه‌های اجتماعی</span>
            <div className="flex-grow border-t border-slate-200/80 dark:border-zinc-800" />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-slate-700 dark:text-zinc-200 bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800/50 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-2xl transition-all duration-200 active:scale-95"
            >
              <FaGoogle className="text-red-500 text-sm" />
              <span>گوگل</span>
            </button>

            <button
              onClick={() => signIn("github", { callbackUrl: "/" })}
              className="flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-slate-700 dark:text-zinc-200 bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800/50 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-2xl transition-all duration-200 active:scale-95"
            >
              <FaGithub className="text-slate-900 dark:text-white text-sm" />
              <span>گیت‌هاب</span>
            </button>
          </div>
        </div>

      </section>
    </main>
  );
}