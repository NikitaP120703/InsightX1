'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import SignInPage from '../components/SignIn';
import SignUpPage from '../components/SignUp';
import ForgotPasswordPage from '../components/ForgotPassword';
import Backtesting from '../components/Backtesting';
import Dashboard from '../components/Dashboard';
import PaperTrading from '../components/PaperTrading';
import Strategy from '../components/Strategy';
import News from '../components/News';
import Footer from '@/components/Footer';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'signin':
        return <SignInPage setCurrentPage={setCurrentPage} />;
      case 'signup':
        return <SignUpPage setCurrentPage={setCurrentPage} />;
      case 'forgotpassword':
        return <ForgotPasswordPage setCurrentPage={setCurrentPage} />;
      default:
        return (
          <div className="space-y-16">
            <h1 className="text-3xl font-bold mb-6">Welcome to InsightX</h1>
            
            <div id="dashboard" className="pt-16">
              <Dashboard />
            </div>
            
            <div id="strategy" className="pt-16">
              <Strategy />
            </div>

            <div id="backtesting" className="pt-16">
              <Backtesting />
            </div>
            
            <div id="papertrading" className="pt-16">
              <PaperTrading />
            </div>
            
            <div id="news" className="pt-16">
              <News />
            </div>

            <div id="footer" className="pt-16">
              <Footer />
            </div>

          </div>
        );
    }
  };

  return (
    <div>
      <Navbar setCurrentPage={setCurrentPage} />
      {renderPage()}
    </div>
  );
}