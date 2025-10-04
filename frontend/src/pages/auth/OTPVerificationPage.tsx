import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Mail, RefreshCw, CheckCircle, Timer, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface LocationState {
  email?: string;
  fromRegistration?: boolean;
}

const OTPVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [canResend, setCanResend] = useState(false);
  const [email] = useState(state?.email || '');
  const [isVerified, setIsVerified] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0 && !isVerified) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft, isVerified]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      toast.error('Email tidak ditemukan. Silakan registrasi ulang.');
      navigate('/register');
    }
  }, [email, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedCode = value.slice(0, 6);
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedCode[i] || '';
      }
      setOtp(newOtp);
      
      // Focus last filled input or next empty input
      const lastFilledIndex = Math.min(pastedCode.length - 1, 5);
      if (inputRefs.current[lastFilledIndex]) {
        inputRefs.current[lastFilledIndex].focus();
      }
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      toast.error('Silakan masukkan kode OTP 6 digit');
      return;
    }

    setIsVerifying(true);

    try {
      const response = await axios.post(`${API_URL}/auth/otp/verify`, {
        email,
        otpCode
      });

      if (response.data.success) {
        setIsVerified(true);
        toast.success('Email berhasil diverifikasi!');
        
        setTimeout(() => {
          if (state?.fromRegistration) {
            navigate('/login', { 
              state: { 
                message: 'Registrasi berhasil! Silakan login dengan akun Anda.',
                email: email
              }
            });
          } else {
            navigate('/profile');
          }
        }, 2000);
      } else {
        toast.error(response.data.message || 'Kode OTP tidak valid');
        // Clear OTP inputs on error
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Terjadi kesalahan. Silakan coba lagi.');
      }
      // Clear OTP inputs on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);

    try {
      const response = await axios.post(`${API_URL}/auth/otp/resend`, {
        email
      });

      if (response.data.success) {
        toast.success('Kode OTP baru telah dikirim ke email Anda');
        setTimeLeft(600); // Reset timer to 10 minutes
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        toast.error(response.data.message || 'Gagal mengirim ulang kode OTP');
      }
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleBack = () => {
    if (state?.fromRegistration) {
      navigate('/register');
    } else {
      navigate(-1);
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Verifikasi Berhasil! 🎉
          </h1>
          <p className="text-gray-600 mb-6">
            Email Anda telah berhasil diverifikasi. Akun Anda sekarang sudah aktif dan siap digunakan.
          </p>
          <div className="animate-pulse text-orange-600 font-medium">
            Mengarahkan ke halaman login...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-orange-100 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-all duration-300 hover:scale-105 group"
            >
              <div className="p-2 rounded-lg bg-orange-50 group-hover:bg-orange-100 transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </div>
              <span className="font-medium">Kembali</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-8 text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Verifikasi Email</h1>
            <p className="text-orange-100">
              Masukkan kode OTP yang telah dikirim ke email Anda
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            {/* Email Info */}
            <div className="text-center mb-8">
              <p className="text-gray-600 mb-2">Kode verifikasi telah dikirim ke:</p>
              <p className="font-semibold text-gray-900 bg-gray-50 py-2 px-4 rounded-lg">
                {email}
              </p>
            </div>

            {/* OTP Input */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
                Masukkan Kode OTP (6 Digit)
              </label>
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all"
                    disabled={isVerifying}
                  />
                ))}
              </div>
            </div>

            {/* Timer */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <Timer className="h-4 w-4" />
                <span className="text-sm">
                  Kode berlaku selama: <span className="font-mono font-bold text-orange-600">{formatTime(timeLeft)}</span>
                </span>
              </div>
              {timeLeft <= 60 && timeLeft > 0 && (
                <div className="flex items-center justify-center space-x-2 text-red-600 mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Kode akan segera kedaluwarsa!</span>
                </div>
              )}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerifyOTP}
              disabled={isVerifying || otp.join('').length !== 6}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 mb-4"
            >
              {isVerifying ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                  <span>Memverifikasi...</span>
                </div>
              ) : (
                'Verifikasi OTP'
              )}
            </button>

            {/* Resend Button */}
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-3">
                Tidak menerima kode?
              </p>
              <button
                onClick={handleResendOTP}
                disabled={!canResend || isResending}
                className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 ${isResending ? 'animate-spin' : ''}`} />
                <span>
                  {isResending ? 'Mengirim...' : canResend ? 'Kirim Ulang Kode' : 'Tunggu untuk kirim ulang'}
                </span>
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Tips:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Periksa folder spam/junk email Anda</li>
                <li>• Pastikan email address sudah benar</li>
                <li>• Tunggu beberapa menit jika email belum masuk</li>
                <li>• Hubungi support jika masih bermasalah</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
