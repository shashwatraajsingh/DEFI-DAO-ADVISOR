// src/pages/ProposalDetail.jsx
import React, { useState } from 'react'
import { useWriteContract, useAccount, useChainId } from 'wagmi'
import { toast } from 'react-hot-toast'

const ProposalDetail = () => {
  const [voteSupport, setVoteSupport] = useState(true) // true = Yes, false = No
  const [stakeAmount, setStakeAmount] = useState('100')
  
  const { isConnected, address } = useAccount()
  const chainId = useChainId()
  const { writeContract, isPending } = useWriteContract()

  const handleVote = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (chainId !== 11155111) {
      toast.error('Please switch to Sepolia Testnet')
      return
    }

    try {
      await writeContract({
        address: import.meta.env.VITE_CONTRACT_ADDRESS,
        abi: [
          {
            "inputs": [
              {"internalType": "uint256", "name": "_proposalId", "type": "uint256"},
              {"internalType": "bool", "name": "_support", "type": "bool"},
              {"internalType": "uint256", "name": "_stakeAmount", "type": "uint256"}
            ],
            "name": "voteProposal",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ],
        functionName: 'voteProposal',
        args: [0, voteSupport, BigInt(stakeAmount + '000000000000000000')], // Convert to wei
      })
      
      toast.success('Vote submitted successfully!')
    } catch (error) {
      console.error('Voting error:', error)
      toast.error('Failed to submit vote')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Vote on Proposal</h1>
        
        {/* Voting Interface */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Cast Your Vote</h3>
          
          {/* Vote Choice */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Your Vote
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => setVoteSupport(true)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  voteSupport 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                ✅ Yes (Support)
              </button>
              <button
                onClick={() => setVoteSupport(false)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  !voteSupport 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                ❌ No (Against)
              </button>
            </div>
          </div>

          {/* Stake Amount */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Stake Amount (DST tokens)
            </label>
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              min="100"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              placeholder="Minimum 100 tokens"
            />
          </div>

          {/* Submit Vote */}
          <button
            onClick={handleVote}
            disabled={isPending || !isConnected}
            className="w-full px-6 py-3 bg-mantle-600 hover:bg-mantle-700 text-white rounded-lg font-medium disabled:opacity-50"
          >
            {isPending ? 'Submitting Vote...' : 'Submit Vote'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProposalDetail
