'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function ForgotPasswordPage({ setCurrentPage }) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Simulate a password reset API call
    setTimeout(() => {
      if (email === 'test@example.com') {
        setSuccess('Password reset link sent to your email.');
      } else {
        setError('Email not found. Please try again.');
      }
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/95 p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float animation-delay-2000"></div>
      </div>

      {/* Forgot Password Form */}
      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl shadow-emerald-400/10 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Forgot Password
          </h1>
          <p className="mt-2 text-gray-400">Enter your email to reset your password</p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 peer"
              required
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-2 text-sm text-gray-400 transition-all duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-emerald-400 bg-gray-900/80 px-1"
            >
              Email
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="text-sm text-emerald-400 text-center">
              {success}
            </div>
          )}

          {/* Reset Password Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-gradient-to-r from-emerald-400 to-blue-500 text-black font-semibold rounded-lg hover:from-emerald-500 hover:to-blue-600 hover:shadow-lg hover:shadow-emerald-400/20 transition-all duration-300 flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Remember your password?{' '}
            <Link
              href="#login"
              onClick={() => setCurrentPage('signin')}
              className="text-emerald-400 hover:text-emerald-300 transition-colors duration-300"
            >
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}