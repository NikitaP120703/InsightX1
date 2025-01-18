'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function SignUpPage({ setCurrentPage }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate a sign-up API call
    setTimeout(() => {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
      } else {
        alert('Sign up successful!');
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

      {/* Sign Up Form */}
      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl shadow-emerald-400/10 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Create an Account
          </h1>
          <p className="mt-2 text-gray-400">Join InsightX to get started</p>
        </div>

        {/* Social Login Buttons */}
        <div className="flex flex-col space-y-4 mb-6">
          <button
            type="button"
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800/70 hover:border-emerald-400/50 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>
          <button
            type="button"
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800/70 hover:border-emerald-400/50 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" className="w-5 h-5" />
            <span>Continue with GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="mx-4 text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=" "
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 peer"
              required
            />
            <label
              htmlFor="name"
              className="absolute left-4 top-2 text-sm text-gray-400 transition-all duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-emerald-400 bg-gray-900/80 px-1"
            >
              Full Name
            </label>
          </div>

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

          {/* Password Field */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 peer"
              required
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-2 text-sm text-gray-400 transition-all duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-emerald-400 bg-gray-900/80 px-1"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3 text-gray-400 hover:text-emerald-400 transition-colors duration-300"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder=" "
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 peer"
              required
            />
            <label
              htmlFor="confirmPassword"
              className="absolute left-4 top-2 text-sm text-gray-400 transition-all duration-300 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-emerald-400 bg-gray-900/80 px-1"
            >
              Confirm Password
            </label>
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-3 text-gray-400 hover:text-emerald-400 transition-colors duration-300"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Terms and Conditions */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 bg-gray-800/50 border border-gray-700 rounded focus:ring-emerald-400"
              required
            />
            <span className="text-sm text-gray-400">
              I agree to the{' '}
              <Link href="#terms" className="text-emerald-400 hover:text-emerald-300 transition-colors duration-300">
                Terms and Conditions
              </Link>
            </span>
          </label>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-gradient-to-r from-emerald-400 to-blue-500 text-black font-semibold rounded-lg hover:from-emerald-500 hover:to-blue-600 hover:shadow-lg hover:shadow-emerald-400/20 transition-all duration-300 flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign Up'}
          </button>
        </form>

        {/* Log In Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
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