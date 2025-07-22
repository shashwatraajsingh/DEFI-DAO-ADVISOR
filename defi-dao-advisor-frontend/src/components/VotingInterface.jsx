
import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { toast } from 'react-hot-toast'
import { 
  HandThumbUpIcon, 
  HandThumbDownIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline'

const VotingInterface = ({ proposalId, proposal }) => {
  const [stakeAmount, setStakeAmount] = useState('100')
  const [showVoteModal, setShowVoteModal] = useState(false)
  const [selectedVote, setSelectedVote] = useState(null)
  const { address, isConnected } = useAccount()

  const handleVote = (support) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!stakeAmount || parseFloat(stakeAmount) < 100) {
      toast.error('Minimum stake is 100 tokens')
      return
    }

    setSelectedVote(support)
    setShowVoteModal(true)
  }

  const confirmVote = () => {
    toast.success('Vote cast successfully!')
    setShowVoteModal(false)
    setSelectedVote(null)
  }

  const getTimeRemaining = () => {
    const now = Date.now()
    const deadline = proposal.deadline
    const remaining = deadline - now
    
    if (remaining <= 0) return 'Voting ended'
    
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    return `${days}d ${hours}h remaining`
  }

  // Show results if proposal is finalized
  if (proposal.status === 'passed' || proposal.status === 'rejected') {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-white mb-6 text-center">
          Voting Results
        </h3>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="text-center">
            <div className="bg-green-900/30 rounded-lg p-4 border border-green-800">
              <HandThumbUpIcon className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400">
                {proposal.yesVotes ? (proposal.yesVotes / 1000000).toFixed(1) : '0'}M
              </div>
              <div className="text-sm text-green-300">Yes Votes</div>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-red-900/30 rounded-lg p-4 border border-red-800">
              <HandThumbDownIcon className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-400">
                {proposal.noVotes ? (proposal.noVotes / 1000000).toFixed(1) : '0'}M
              </div>
              <div className="text-sm text-red-300">No Votes</div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold ${
            proposal.status === 'passed'
              ? 'bg-green-900/30 text-green-400 border border-green-800' 
              : 'bg-red-900/30 text-red-400 border border-red-800'
          }`}>
            {proposal.status === 'passed' ? 'PROPOSAL PASSED' : 'PROPOSAL REJECTED'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Cast Your Vote</h3>
        <div className="flex items-center text-sm text-gray-400">
          <ClockIcon className="h-4 w-4 mr-1" />
          {getTimeRemaining()}
        </div>
      </div>

      {/* Connection Warning */}
      {!isConnected && (
        <div className="bg-yellow-900/30 border border-yellow-800 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2" />
            <p className="text-yellow-300 text-sm">
              Please connect your wallet to vote on this proposal
            </p>
          </div>
        </div>
      )}

      {/* Stake Amount Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Stake Amount (minimum 100 tokens)
        </label>
        <div className="relative">
          <input
            type="number"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            min="100"
            step="1"
            disabled={!isConnected}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-DEA-500 focus:border-transparent disabled:opacity-50"
            placeholder="Enter stake amount..."
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Higher stakes have more voting power. Aligned voters get rewards.
        </p>
      </div>

      {/* Vote Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleVote(true)}
          disabled={!isConnected}
          className="flex items-center justify-center px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <HandThumbUpIcon className="h-5 w-5 mr-2" />
          Vote Yes
        </button>
        <button
          onClick={() => handleVote(false)}
          disabled={!isConnected}
          className="flex items-center justify-center px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <HandThumbDownIcon className="h-5 w-5 mr-2" />
          Vote No
        </button>
      </div>

      {/* Vote Confirmation Modal */}
      {showVoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Confirm Your Vote
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-300">Vote:</span>
                <span className={`font-medium ${selectedVote ? 'text-green-400' : 'text-red-400'}`}>
                  {selectedVote ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Stake Amount:</span>
                <span className="text-white font-medium">{stakeAmount} tokens</span>
              </div>
              <div className="bg-yellow-900/30 border border-yellow-800 rounded-lg p-3">
                <p className="text-yellow-300 text-sm">
                  Your tokens will be locked until voting ends. 
                  Aligned voters receive rewards!
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowVoteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmVote}
                className="flex-1 px-4 py-2 bg-DEA-600 hover:bg-DEA-700 text-white rounded-lg font-medium transition-colors"
              >
                Confirm Vote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VotingInterface
