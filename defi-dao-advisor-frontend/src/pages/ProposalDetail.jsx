// src/pages/ProposalDetail.jsx
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useContractRead, useAccount } from 'wagmi'
import { 
  ClockIcon, 
  UserIcon, 
  SparklesIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import VotingInterface from '@/components/VotingInterface'
import LoadingSpinner from '@/components/LoadingSpinner'

const ProposalDetail = () => {
  const { id } = useParams()
  const { isConnected } = useAccount()
  const [proposal, setProposal] = useState(null)
  const [loading, setLoading] = useState(true)

  // Mock data for demonstration
  const mockProposal = {
    id: parseInt(id),
    title: "Increase Staking Rewards by 5%",
    description: `This proposal suggests increasing the current staking rewards from 10% to 15% APY to attract more liquidity providers to our protocol.

## Rationale

The current staking rewards of 10% APY are below market standards compared to other DeFi protocols. By increasing to 15% APY, we can:

- Attract more liquidity providers
- Increase total value locked (TVL)
- Improve protocol security through higher stake participation
- Compete effectively with other DeFi platforms

## Implementation Details

1. **Reward Rate Adjustment**: Modify the staking contract to increase rewards from 10% to 15% APY
2. **Treasury Impact**: This will require an additional 5% annual allocation from the treasury
3. **Timeline**: Implementation can begin immediately upon proposal approval
4. **Monitoring**: Track TVL and participation metrics for 30 days post-implementation

## Expected Outcomes

- 25-40% increase in staking participation
- Improved protocol security
- Enhanced competitive positioning
- Sustainable growth in user base`,
    proposer: "0x1234567890abcdef1234567890abcdef12345678",
    type: "treasury",
    status: "active",
    yesVotes: 1250000,
    noVotes: 850000,
    totalStaked: 2100000,
    deadline: Date.now() + 5 * 24 * 60 * 60 * 1000,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    riskLevel: "Medium",
    aiAnalysis: {
      tldr: "This proposal aims to increase staking rewards from 10% to 15% APY to attract more liquidity and improve protocol competitiveness.",
      riskLevel: "Medium",
      riskExplanation: "While increasing rewards can attract more users, it will impact treasury sustainability and requires careful monitoring of long-term financial health.",
      keyConsiderations: [
        "Treasury sustainability must be monitored closely",
        "Market conditions may affect the effectiveness of reward increases",
        "Implementation should include mechanisms to adjust rates if needed",
        "Consider gradual implementation rather than immediate full increase"
      ]
    }
  }

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProposal(mockProposal)
      setLoading(false)
    }, 1000)
  }, [id])

  const getTimeRemaining = (deadline) => {
    const now = Date.now()
    const remaining = deadline - now
    
    if (remaining <= 0) return 'Voting ended'
    
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}h remaining`
    return `${hours}h remaining`
  }

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high': return 'text-red-400 bg-red-900/30 border-red-800'
      case 'medium': return 'text-yellow-400 bg-yellow-900/30 border-yellow-800'
      case 'low': return 'text-green-400 bg-green-900/30 border-green-800'
      default: return 'text-gray-400 bg-gray-900/30 border-gray-800'
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner className="h-12 w-12" />
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Proposal Not Found</h2>
          <p className="text-gray-400">The proposal you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">{getTypeIcon(proposal.type)}</span>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">{proposal.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-1" />
                      {proposal.proposer}
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {getTimeRemaining(proposal.deadline)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
              <div className="flex items-center mb-6">
                <SparklesIcon className="h-6 w-6 text-mantle-400 mr-3" />
                <h2 className="text-xl font-semibold text-white">AI Analysis</h2>
              </div>
              
              <div className="space-y-6">
                {/* TL;DR */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3">TL;DR Summary</h3>
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <p className="text-gray-200 leading-relaxed">{proposal.aiAnalysis.tldr}</p>
                  </div>
                </div>
                
                {/* Risk Assessment */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3">Risk Assessment</h3>
                  <div className="flex items-start space-x-4">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getRiskColor(proposal.aiAnalysis.riskLevel)}`}>
                      <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                      {proposal.aiAnalysis.riskLevel} Risk
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-300 text-sm leading-relaxed">{proposal.aiAnalysis.riskExplanation}</p>
                    </div>
                  </div>
                </div>
                
                {/* Key Considerations */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3">Key Considerations</h3>
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <ul className="space-y-3">
                      {proposal.aiAnalysis.keyConsiderations.map((consideration, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircleIcon className="h-5 w-5 text-mantle-400 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 text-sm leading-relaxed">{consideration}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Proposal Description */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Proposal Details</h2>
              <div className="prose prose-invert max-w-none">
                <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {proposal.description}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Voting Stats */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                <ChartBarIcon className="h-5 w-5 mr-2" />
                Voting Statistics
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Staked</span>
                  <span className="text-white font-medium">
                    {(proposal.totalStaked / 1000000).toFixed(1)}M tokens
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">
                      Yes ({((proposal.yesVotes / proposal.totalStaked) * 100).toFixed(1)}%)
                    </span>
                    <span className="text-green-400 font-medium">
                      {(proposal.yesVotes / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(proposal.yesVotes / proposal.totalStaked) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-red-400">
                      No ({((proposal.noVotes / proposal.totalStaked) * 100).toFixed(1)}%)
                    </span>
                    <span className="text-red-400 font-medium">
                      {(proposal.noVotes / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-red-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(proposal.noVotes / proposal.totalStaked) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Voting Interface */}
            <VotingInterface proposalId={proposal.id} proposal={proposal} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProposalDetail
