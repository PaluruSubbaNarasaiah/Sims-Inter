// src/pages/ForgotPasswordPage.jsx
import React, { useState, useEffect } from 'react';
import { Mail, ArrowLeft, KeyRound, RefreshCcw, Lock, CheckCircle } from 'lucide-react';

const ForgotPasswordPage = ({ onBackToLogin, onClose }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [redirectCountdown, setRedirectCountdown] = useState(3);
  const [isResending, setIsResending] = useState(false);
  const [correctOtp, setCorrectOtp] = useState('');

  // Countdown effects
  useEffect(() => {
    let interval;
    if (countdown > 0) {
      interval = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  useEffect(() => {
    let timer;
    if (passwordResetSuccess && redirectCountdown > 0) {
      timer = setTimeout(() => setRedirectCountdown(prev => prev - 1), 1000);
    } else if (passwordResetSuccess && redirectCountdown === 0) {
      onBackToLogin();
    }
    return () => clearTimeout(timer);
  }, [passwordResetSuccess, redirectCountdown, onBackToLogin]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setOtpVerified(false);
    setPasswordResetSuccess(false);

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsResending(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a random 6-digit OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log('Generated OTP:', generatedOtp); // For debugging
      
      // Store the correct OTP in state
      setCorrectOtp(generatedOtp);
      setMessage('OTP sent to your email');
      setOtpSent(true);
      setCountdown(60); // Start 60-second countdown
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    try {
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Compare entered OTP with the correct one
      if (otp === correctOtp) {
        setMessage('OTP verified successfully!');
        setOtpVerified(true);
        setError('');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Simulate password reset delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPasswordResetSuccess(true);
      setRedirectCountdown(3);
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    }
  };

  
  return (
    <div className="flex flex-col items-center">
      {passwordResetSuccess ? (
        <div className="flex flex-col items-center justify-center text-center p-6 bg-white rounded-lg shadow-md w-full">
          <CheckCircle size={64} className="text-green-500 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Success!</h3>
          <p className="text-gray-700 mb-4">
            Your password has been reset successfully.
          </p>
          <p className="text-gray-500 text-sm">
            Redirecting in {redirectCountdown} seconds...
          </p>
        </div>
      ) : (
        <>
          <div className="p-3 bg-purple-100 rounded-full mb-4">
            {otpVerified ? (
              <Lock size={40} className="text-purple-600" />
            ) : otpSent ? (
              <KeyRound size={40} className="text-purple-600" />
            ) : (
              <Mail size={40} className="text-purple-600" />
            )}
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            {otpVerified ? 'New Password' : otpSent ? 'Verify OTP' : 'Reset Password'}
          </h3>
          
          <p className="text-gray-600 text-center mb-4 px-2">
            {otpVerified
              ? 'Enter your new password'
              : otpSent
              ? 'Enter the 6-digit code sent to your email'
              : 'Enter your email to receive an OTP'}
          </p>

          {!otpSent && !otpVerified && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 w-full">
              <p className="text-red-600 text-sm text-center">
                <strong>Note:</strong> lecturers/Students/Parents should contact school management.
              </p>
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="w-full space-y-4">
              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    id="email"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && <p className="text-red-600 text-xs">{error}</p>}
              {message && <p className="text-green-600 text-xs">{message}</p>}

              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-colors"
                disabled={isResending}
              >
                {isResending ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          ) : !otpVerified ? (
            <form onSubmit={handleVerifyOtp} className="w-full space-y-4">
              <div>
                <label htmlFor="otp" className="block text-gray-700 text-sm mb-1">
                  OTP Code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    id="otp"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength="6"
                    required
                  />
                </div>
              </div>

              {error && <p className="text-red-600 text-xs">{error}</p>}
              {message && <p className="text-green-600 text-xs">{message}</p>}

              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-colors"
              >
                Verify OTP
              </button>

              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full flex items-center justify-center py-2 text-purple-600 hover:text-purple-800 text-sm"
                disabled={countdown > 0 || isResending}
              >
                <RefreshCcw size={16} className="mr-1" />
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="w-full space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-gray-700 text-sm mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    id="newPassword"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-gray-700 text-sm mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    id="confirmPassword"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && <p className="text-red-600 text-xs">{error}</p>}
              {message && <p className="text-green-600 text-xs">{message}</p>}

              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-colors"
              >
                Reset Password
              </button>
            </form>
          )}

          {!otpVerified && (
            <button
              type="button"
              onClick={onBackToLogin}
              className="w-full flex items-center justify-center py-2 text-indigo-600 hover:text-indigo-800 text-sm mt-3"
            >
              <ArrowLeft size={16} className="mr-1" /> Back to Login
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ForgotPasswordPage;