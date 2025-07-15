// src/pages/ProposalDetail.jsx
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { 
  ClockIcon, 
  UserIcon, 
  SparklesIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

const ProposalDetail = () => {
  const { id } = useParams()
  
  // Mock data for demonstration
  const proposal = {
    id: parseInt(id),
    title: "Increase Staking Rewards by 5%",
    description: "This proposal suggests increasing the current staking rewards from 10% to 15% APY to attract more liquidity providers.",
    proposer: "0x1234567890abcdef1234567890abcdef12345678",
    status: "active",
    yesVotes: 1250000,
    noVotes: 850000,
    totalStaked: 2100000,
    deadline: Date.now() + 5 * 24 * 60 * 60 * 1000,
    riskLevel: "Medium",
    aiAnalysis: {
      tldr: "This proposal aims to increase staking rewards from 10% to 15% APY to attract more liquidity.",
      riskLevel: "Medium",
      riskExplanation: "While increasing rewards can attract more users, it will impact treasury sustainability.",
      keyConsiderations: [
        "Treasury sustainability must be monitored closely",
        "Market conditions may affect the effectiveness",
        "Consider gradual implementation"
      ]
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

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">{proposal.title}</h1>
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

        {/* AI Analysis */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
          <div className="flex items-center mb-6">
            <SparklesIcon className="h-6 w-6 text-mantle-400 mr-3" />
            <h2 className="text-xl font-semibold text-white">AI Analysis</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-3">TL;DR Summary</h3>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-200">{proposal.aiAnalysis.tldr}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-3">Risk Assessment</h3>
              <div className="flex items-start space-x-4">
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border bg-yellow-900/30 text-yellow-400 border-yellow-800">
                  <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                  {proposal.aiAnalysis.riskLevel} Risk
                </div>
                <div className="flex-1">
                  <p className="text-gray-300 text-sm">{proposal.aiAnalysis.riskExplanation}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-3">Key Considerations</h3>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <ul className="space-y-3">
                  {proposal.aiAnalysis.keyConsiderations.map((consideration, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-mantle-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{consideration}</span>
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
          <div className="text-gray-300 leading-relaxed">
            {proposal.description}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProposalDetail
