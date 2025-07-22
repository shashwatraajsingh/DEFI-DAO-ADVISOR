import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useAccount, useChainId } from 'wagmi' // ✅ Remove useNetwork, add useChainId

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [backendStatus, setBackendStatus] = useState('checking')
  const location = useLocation()
  const { isConnected } = useAccount()
  const chainId = useChainId() // ✅ Use useChainId instead of useNetwork

  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'Proposals', href: '/proposals', current: location.pathname === '/proposals' },
    { name: 'Create', href: '/create', current: location.pathname === '/create' },
    ...(isConnected ? [{ name: 'Dashboard', href: '/dashboard', current: location.pathname === '/dashboard' }] : []),
  ]

  // Check backend health
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/health`)
        setBackendStatus(response.ok ? 'connected' : 'disconnected')
      } catch (error) {
        setBackendStatus('disconnected')
      }
    }
    
    checkBackendHealth()
    const interval = setInterval(checkBackendHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-8 h-8 bg-DEA-gradient rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
                  <div className="w-3 h-3 bg-white rounded-full opacity-90"></div>
                </div>
                <div className="absolute -inset-1 bg-DEA-gradient rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              </div>
              <span className="text-xl font-bold text-white group-hover:text-DEA-300 transition-colors">
                DeFi DAO Advisor
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-baseline space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    item.current
                      ? 'bg-DEA-700 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Network Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                chainId === 11155111 ? 'bg-green-500' : 'bg-yellow-500' // ✅ Use chainId directly
              }`}></div>
              <span className="text-xs text-gray-400">
                {chainId === 11155111 ? 'DEA' : 'Wrong Network'} {/* ✅ Use chainId directly */}
              </span>
            </div>

            {/* Backend Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                backendStatus === 'connected' ? 'bg-green-500' : 
                backendStatus === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500'
              }`}></div>
              <span className="text-xs text-gray-400">
                {backendStatus === 'connected' ? 'AI Online' : 
                 backendStatus === 'disconnected' ? 'AI Offline' : 'Checking...'}
              </span>
            </div>

            <ConnectButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden animate-slide-up">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-800">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    item.current
                      ? 'bg-DEA-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Status Indicators */}
              <div className="pt-2 pb-2 border-t border-gray-800">
                <div className="px-3 py-2 text-xs text-gray-400 space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      chainId === 11155111 ? 'bg-green-500' : 'bg-yellow-500' // ✅ Use chainId directly
                    }`}></div>
                    <span>Network: {chainId === 11155111 ? 'DEA' : 'Wrong Network'}</span> {/* ✅ Use chainId directly */}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      backendStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span>AI: {backendStatus === 'connected' ? 'Online' : 'Offline'}</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 pb-3 border-t border-gray-800">
                <ConnectButton />
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
