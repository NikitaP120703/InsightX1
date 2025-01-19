import React from 'react';
import { Github, Twitter, Mail, Shield, AlertTriangle, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900/80 border-t border-gray-800 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-gray-200 font-semibold mb-4 text-lg">About PaperTrading</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              A sophisticated paper trading platform designed for learning and practicing trading strategies
              in a risk-free environment. Perfect for both beginners and experienced traders.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-200 font-semibold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 text-sm flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Risk Disclosure
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-gray-200 font-semibold mb-4 text-lg">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="border-t border-gray-800 pt-6">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h4 className="text-yellow-500 font-semibold mb-2">Important Disclaimer</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  For educational purposes only. This platform does not provide financial advice or 
                  guarantee trading outcomes. Trading involves substantial risk of loss and is not 
                  suitable for all investors. Subject to market risk - we are not responsible for 
                  any output generated. Past performance is not indicative of future results.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} PaperTrading. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">Terms of Service</a>
              <span className="text-gray-700">•</span>
              <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">Privacy Policy</a>
              <span className="text-gray-700">•</span>
              <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;