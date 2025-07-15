// src/pages/ProposalList.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  ClockIcon, 
  UserIcon, 
  ChartBarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { useContractRead } from 'wagmi'

const ProposalList = () => {
  const [proposals, setProposals] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data for demonstration
  const mockProposals = [
    {
      id: 1,
      title: "Increase Staking Rewards by 5%",
      description: "Proposal to increase staking rewards from 10% to 15% APY to attract more liquidity...",
      proposer: "0x1234...5678",
      type: "treasury",
      status: "active",
      yesVotes: 1250000,
      noVotes: 850000,
      totalStaked: 2100000,
      deadline: Date.now() + 5 * 24 * 60 * 60 * 1000, // 5 days from now
      riskLevel: "Medium",
      aiSummary: "This proposal aims to increase staking rewards to improve liquidity attraction."
    },
    {
      id: 2,
      title: "Implement Cross-Chain Bridge",
      description: "Deploy a secure cross-chain bridge to connect with Ethereum mainnet...",
      proposer: "0x8765...4321",
      type: "protocol",
      status: "passed",
      yesVotes: 2800000,
      noVotes: 1200000,
      totalStaked: 4000000,
      deadline: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
      riskLevel: "High",
      aiSummary: "Technical upgrade to enable cross-chain functionality with security considerations."
    },
    {
      id: 3,
      title: "Partnership with DeFi Protocol X",
      description: "Strategic partnership to integrate yield farming opportunities...",
      proposer: "0x9876...1234",
      type: "partnership",
      status: "active",
      yesVotes: 950000,
      noVotes: 650000,
      totalStaked: 1600000,
      deadline: Date.now() + 3 * 24 * 60 * 60 * 1000, // 3 days from now
      riskLevel: "Low",
      aiSummary: "Partnership proposal to expand ecosystem integration and user benefits."
    }
  ]

  useEffect(() => {
    // In a real app, fetch from contract
    setProposals(mockProposals)
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-900/30 text-blue-400 border-blue-800'
      case 'passed': return 'bg-green-900/30 text-green-400 border-green-800'
      case 'rejected': return 'bg-red-900/30 text-red-400 border-red-800'
      default: return 'bg-gray-900/30 text-gray-400 border-gray-800'
    }
  }

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high': return 'text-red-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'governance': return '🏛️'
      case 'treasury': return '💰'
      case 'protocol': return '⚙️'
      case 'partnership': return '🤝'
      default: return '📄'
    }
  }

  const getTimeRemaining = (deadline) => {
    const now = Date.now()
    const remaining = deadline - now
    
    if (remaining <= 0) return 'Voting ended'
    
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}h remaining`
    return `${hours}h remaining`
  }

  const filteredProposals = proposals.filter(proposal => {
    const matchesFilter = filter === 'all' || proposal.status === filter
    const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">DAO Proposals</h1>
          <p className="text-xl text-gray-400">
            Browse and vote on community proposals with AI-powered insights
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search proposals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mantle-500"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-4">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-mantle-500"
              >
                <option value="all">All Proposals</option>
                <option value="active">Active</option>
                <option value="passed">Passed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Create Button */}
            <Link
              to="/create"
              className="inline-flex items-center px-6 py-2 bg-mantle-600 hover:bg-mantle-700 text-white rounded-lg font-medium transition-colors"
            >
              Create Proposal
            </Link>
          </div>
        </div>

        {/* Proposals Grid */}
        <div className="grid gap-6">
          {filteredProposals.map((proposal) => (
            <div
              key={proposal.id}
              className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition-all duration-200 hover:transform hover:scale-[1.02]"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                {/* Left Content */}
                <div className="flex-1 mb-4 lg:mb-0">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">{getTypeIcon(proposal.type)}</span>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(proposal.status)}`}>
                      {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                    </div>
                    <div className="ml-3 flex items-center text-sm text-gray-400">
                      <UserIcon className="h-4 w-4 mr-1" />
                      {proposal.proposer}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2 hover:text-mantle-300 transition-colors">
                    <Link to={`/proposal/${proposal.id}`}>
                      {proposal.title}
                    </Link>
                  </h3>

                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {proposal.description}
                  </p>

                  {/* AI Summary */}
                  <div className="bg-mantle-900/30 rounded-lg p-3 border border-mantle-800 mb-4">
                    <div className="flex items-center mb-2">
                      <SparklesIcon className="h-4 w-4 text-mantle-400 mr-2" />
                      <span className="text-sm font-medium text-mantle-300">AI Summary</span>
                      <span className={`ml-2 text-xs font-medium ${getRiskColor(proposal.riskLevel)}`}>
                        {proposal.riskLevel} Risk
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{proposal.aiSummary}</p>
                  </div>
                </div>

                {/* Right Content */}
                <div className="lg:ml-8 lg:w-80">
                  {/* Voting Stats */}
                  <div className="bg-gray-900 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-400">Total Staked</span>
                      <span className="text-sm font-medium text-white">
                        {(proposal.totalStaked / 1000000).toFixed(1)}M tokens
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-400">Yes ({((proposal.yesVotes / proposal.totalStaked) * 100).toFixed(1)}%)</span>
                        <span className="text-red-400">No ({((proposal.noVotes / proposal.totalStaked) * 100).toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-l-full"
                          style={{ width: `${(proposal.yesVotes / proposal.totalStaked) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Time Remaining */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-400">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {getTimeRemaining(proposal.deadline)}
                    </div>
                    <Link
                      to={`/proposal/${proposal.id}`}
                      className="inline-flex items-center px-4 py-2 bg-mantle-600 hover:bg-mantle-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <ChartBarIcon className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProposals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <ChartBarIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">No proposals found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
            <Link
              to="/create"
              className="inline-flex items-center px-6 py-3 bg-mantle-600 hover:bg-mantle-700 text-white rounded-lg font-medium transition-colors"
            >
              Create First Proposal
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProposalList
