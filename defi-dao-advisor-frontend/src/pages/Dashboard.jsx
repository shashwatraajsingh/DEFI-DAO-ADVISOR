// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  TrophyIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const { address, isConnected } = useAccount()
  
  const userStats = {
    totalStaked: 5000,
    totalRewards: 1250,
    votingPower: 0.05,
    successRate: 75,
    proposalsCreated: 3,
    votescast: 12
  }

  const userVotes = [
    {
      id: 1,
      title: "Increase Staking Rewards by 5%",
      vote: true,
      stake: 1000,
      status: "active",
      outcome: null,
      reward: 0
    },
    {
      id: 2,
      title: "Implement Cross-Chain Bridge",
      vote: true,
      stake: 2000,
      status: "passed",
      outcome: true,
      reward: 150
    }
  ]

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400">Please connect your wallet to view your dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Dashboard</h1>
          <p className="text-xl text-gray-400">Track your voting activity and rewards</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-mantle-400 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Total Staked</p>
                <p className="text-2xl font-bold text-white">{userStats.totalStaked.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center">
              <TrophyIcon className="h-8 w-8 text-yellow-400 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Total Rewards</p>
                <p className="text-2xl font-bold text-white">{userStats.totalRewards.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-blue-400 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-white">{userStats.successRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-green-400 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Votes Cast</p>
                <p className="text-2xl font-bold text-white">{userStats.votescast}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Votes */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Your Recent Votes</h2>
          
          <div className="space-y-4">
            {userVotes.map((vote) => (
              <div key={vote.id} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Link 
                      to={`/proposal/${vote.id}`}
                      className="text-lg font-medium text-white hover:text-mantle-300 transition-colors"
                    >
                      {vote.title}
                    </Link>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                      <span>Staked: {vote.stake.toLocaleString()} tokens</span>
                      <span className={`flex items-center ${vote.vote ? 'text-green-400' : 'text-red-400'}`}>
                        {vote.vote ? <CheckCircleIcon className="h-4 w-4 mr-1" /> : <XCircleIcon className="h-4 w-4 mr-1" />}
                        Voted {vote.vote ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      vote.status === 'active' ? 'bg-blue-900/30 text-blue-400' :
                      vote.status === 'passed' ? 'bg-green-900/30 text-green-400' :
                      'bg-red-900/30 text-red-400'
                    }`}>
                      {vote.status.charAt(0).toUpperCase() + vote.status.slice(1)}
                    </div>
                    {vote.reward > 0 && (
                      <div className="text-yellow-400 text-sm mt-1">
                        +{vote.reward} reward
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
