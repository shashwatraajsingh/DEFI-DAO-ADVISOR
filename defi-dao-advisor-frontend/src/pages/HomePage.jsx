// src/pages/HomePage.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowRightIcon, 
  SparklesIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  UsersIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline'
import { useAccount } from 'wagmi'

const HomePage = () => {
  const { isConnected } = useAccount()

  const features = [
    {
      icon: SparklesIcon,
      title: 'AI-Powered Analysis',
      description: 'Get instant TL;DR summaries, risk assessments, and key considerations for every proposal using advanced AI.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Stake-Based Voting',
      description: 'Vote with your tokens at stake. Aligned voters get rewarded, creating incentives for thoughtful participation.',
      color: 'from-mantle-500 to-emerald-500'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Reward System',
      description: 'Earn rewards for making aligned decisions. The more you stake, the more you can earn.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: ChartBarIcon,
      title: 'Transparent Governance',
      description: 'All votes and decisions are recorded on-chain for complete transparency and accountability.',
      color: 'from-blue-500 to-indigo-500'
    }
  ]

  const stats = [
    { label: 'AI-Powered', value: 'Analysis', description: 'Instant proposal insights' },
    { label: 'Stake-Based', value: 'Voting', description: 'Aligned incentives' },
    { label: 'Reward', value: 'System', description: 'Earn for participation' },
  ]

  return (
    <div className="bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-mantle-900/20 via-gray-900 to-primary-900/20"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-mantle-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center animate-fade-in">
            <div className="mb-8">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-mantle-900/50 text-mantle-300 border border-mantle-800">
                <SparklesIcon className="h-4 w-4 mr-2" />
                Powered by AI & Blockchain
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Mass adoption of{' '}
              <span className="bg-gradient-to-r from-mantle-400 via-mantle-300 to-emerald-400 bg-clip-text text-transparent">
                AI-powered governance
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              With DeFi DAO Advisor, get AI-powered proposal analysis, stake-based voting, 
              and token holder governed decision making for the future of DeFi.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/create"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-gray-900 bg-mantle-400 hover:bg-mantle-300 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-mantle-500/25"
              >
                Create Proposal
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              
              <Link
                to="/proposals"
                className="inline-flex items-center px-8 py-4 border border-gray-600 text-lg font-medium rounded-xl text-white hover:bg-gray-800 hover:border-gray-500 transition-all duration-200"
              >
                Explore Proposals
              </Link>
              
              {isConnected && (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-8 py-4 border border-mantle-600 text-lg font-medium rounded-xl text-mantle-400 hover:bg-mantle-900/50 hover:border-mantle-500 transition-all duration-200"
                >
                  Dashboard
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Revolutionary DAO Governance Features
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the next generation of decentralized decision making with AI-powered insights and aligned incentives
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="group bg-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-mantle-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-4xl lg:text-5xl font-bold text-mantle-400 mb-2">
                  {stat.label}
                </div>
                <div className="text-2xl lg:text-3xl font-semibold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-mantle-600 via-mantle-500 to-emerald-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to shape the future of governance?
          </h2>
          <p className="text-xl text-mantle-100 mb-10 leading-relaxed">
            Join thousands of token holders making informed decisions with AI-powered insights. 
            Connect your wallet and start participating today.
          </p>
          <Link
            to="/create"
            className="inline-flex items-center px-10 py-5 border border-transparent text-xl font-medium rounded-xl text-mantle-900 bg-white hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-2xl"
          >
            Get Started Now
            <ArrowRightIcon className="ml-3 h-6 w-6" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage
