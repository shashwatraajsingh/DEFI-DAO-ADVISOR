// src/components/Footer.jsx
import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-mantle-gradient rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full opacity-90"></div>
              </div>
              <span className="text-xl font-bold text-white">DeFi DAO Advisor</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              AI-powered DAO governance platform enabling smarter decision-making 
              through stake-based voting and intelligent proposal analysis.
            </p>
            <p className="text-sm text-gray-500">
              Built for Mantle Network Cookathon 2025
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
              Platform
            </h3>
            <ul className="space-y-2">
              <li><Link to="/proposals" className="text-gray-400 hover:text-white transition-colors">Browse Proposals</Link></li>
              <li><Link to="/create" className="text-gray-400 hover:text-white transition-colors">Create Proposal</Link></li>
              <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">GitHub</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Discord</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 DeFi DAO Advisor. Built with ❤️ for the Mantle Network ecosystem by Shashwat Raj Singh.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
