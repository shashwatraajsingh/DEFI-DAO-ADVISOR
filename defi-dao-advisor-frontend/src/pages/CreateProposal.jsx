// src/pages/CreateProposal.jsx
import React, { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { toast } from 'react-hot-toast'
import { 
  SparklesIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  DocumentTextIcon,
  ClockIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline'
import LoadingSpinner from '../components/LoadingSpinner'

const CreateProposal = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    proposalType: 'governance'
  })
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [step, setStep] = useState(1)
  const [networkError, setNetworkError] = useState(null)

  const { isConnected } = useAccount()
  const { data: hash, writeContract, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Watch for transaction success
  React.useEffect(() => {
    if (isConfirmed) {
      toast.success('Proposal created successfully!')
      setFormData({ title: '', description: '', proposalType: 'governance' })
      setAiAnalysis(null)
      setStep(1)
    }
  }, [isConfirmed])

  const proposalTypes = [
    { 
      value: 'governance', 
      label: 'Governance Change', 
      description: 'Modify governance parameters or voting processes',
      icon: '🏛️',
      examples: ['Change voting period', 'Modify quorum requirements']
    },
    { 
      value: 'treasury', 
      label: 'Treasury Management', 
      description: 'Allocate or manage treasury funds and resources',
      icon: '💰',
      examples: ['Fund development', 'Strategic investments']
    },
    { 
      value: 'protocol', 
      label: 'Protocol Upgrade', 
      description: 'Technical improvements or new feature implementations',
      icon: '⚙️',
      examples: ['Smart contract upgrades', 'New features']
    },
    { 
      value: 'partnership', 
      label: 'Partnership Proposal', 
      description: 'Strategic partnerships or ecosystem collaborations',
      icon: '🤝',
      examples: ['Integration proposals', 'Cross-chain bridges']
    },
  ]

const analyzeProposal = async () => {
  if (!formData.title || !formData.description) {
    toast.error('Please fill in title and description first')
    return
  }

  setIsAnalyzing(true)
  setNetworkError(null)
  
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'
    const endpoint = `${backendUrl}/api/summarize`
    
    console.log('🔄 Attempting to connect to:', endpoint)
    console.log('📝 Request data:', formData)
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      controller.abort()
      console.log('⏰ Request timed out after 30 seconds')
    }, 30000)
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData),
      signal: controller.signal
    })

    clearTimeout(timeoutId)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('✅ Backend response:', result)
    
    if (result.success && result.analysis) {
      // ✅ Use the actual AI analysis from backend
      console.log('🎯 Using real AI analysis:', result.analysis)
      setAiAnalysis(result.analysis)
      setStep(3)
      toast.success('AI analysis completed!')
    } else {
      throw new Error(result.error || 'Invalid response format')
    }
    
  } catch (error) {
    console.error('❌ Analysis error:', error)
    
    // Only use fallback if there's a real network error
    if (error.name === 'AbortError') {
      setNetworkError('Backend connection timeout')
      toast.error('Request timeout. Using fallback analysis.')
    } else if (error.message.includes('Failed to fetch')) {
      setNetworkError('Cannot reach backend server')
      toast.error('Backend unreachable. Using fallback analysis.')
    } else {
      // For other errors, still try to use any available backend response
      setNetworkError(`Error: ${error.message}`)
      toast.error('Error occurred. Using fallback analysis.')
    }
    
    // Fallback analysis only when backend is truly unavailable
    const fallbackAnalysis = {
      tldr: `This ${formData.proposalType} proposal "${formData.title}" requires careful community evaluation and risk assessment.`,
      riskLevel: "Medium",
      riskExplanation: `As a ${formData.proposalType} proposal, this involves changes that could affect protocol operations and requires thorough evaluation.`,
      keyConsiderations: [
        'Community consensus and stakeholder alignment are crucial',
        'Technical feasibility and impact assessment required',
        'Risk mitigation strategies should be carefully planned',
        'Implementation timeline should be realistic and well-tested'
      ]
    }
    
    setAiAnalysis(fallbackAnalysis)
    setStep(3)
    toast.success('Fallback analysis completed!')
    
  } finally {
    setIsAnalyzing(false)
  }
}



  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!aiAnalysis) {
      toast.error('Please analyze the proposal first')
      return
    }

    // In a real implementation, you'd upload to IPFS first
    const ipfsHash = `QmExample${Date.now()}` // Mock IPFS hash with timestamp
    
    try {
      writeContract({
        address: import.meta.env.VITE_CONTRACT_ADDRESS,
        abi: [
          {
            "inputs": [
              {"internalType": "string", "name": "_title", "type": "string"},
              {"internalType": "string", "name": "_description", "type": "string"},
              {"internalType": "string", "name": "_ipfsHash", "type": "string"}
            ],
            "name": "createProposal",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ],
        functionName: 'createProposal',
        args: [formData.title, formData.description, ipfsHash],
      })
    } catch (error) {
      console.error('Contract write error:', error)
      toast.error('Failed to create proposal')
    }
  }

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high': return 'text-red-400 bg-red-900/30 border-red-800'
      case 'medium': return 'text-yellow-400 bg-yellow-900/30 border-yellow-800'
      case 'low': return 'text-green-400 bg-green-900/30 border-green-800'
      default: return 'text-gray-400 bg-gray-900/30 border-gray-800'
    }
  }

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high': return '🚨'
      case 'medium': return '⚠️'
      case 'low': return '✅'
      default: return '❓'
    }
  }

  const isLoading = isPending || isConfirming

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Create New Proposal</h1>
          <p className="text-xl text-gray-400">
            Submit your proposal for AI analysis and community voting
          </p>
        </div>

        {/* Network Error Alert */}
        {networkError && (
          <div className="mb-8 bg-red-900/30 border border-red-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
                <span className="text-red-300 text-sm">
                  Network Error: {networkError}
                </span>
              </div>
              <button
                onClick={() => setNetworkError(null)}
                className="text-red-400 hover:text-red-300"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-8">
            {[
              { number: 1, title: 'Type & Details', active: step >= 1 },
              { number: 2, title: 'AI Analysis', active: step >= 2 },
              { number: 3, title: 'Review & Submit', active: step >= 3 }
            ].map((stepItem, index) => (
              <div key={stepItem.number} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all ${
                  stepItem.active 
                    ? 'bg-mantle-500 border-mantle-500 text-white' 
                    : 'border-gray-600 text-gray-400'
                }`}>
                  {stepItem.number}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  stepItem.active ? 'text-white' : 'text-gray-400'
                }`}>
                  {stepItem.title}
                </span>
                {index < 2 && (
                  <div className={`w-16 h-0.5 ml-4 transition-all ${
                    step > stepItem.number ? 'bg-mantle-500' : 'bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Proposal Type */}
            <div className={step === 1 ? 'block' : 'hidden'}>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-2">Choose Proposal Type</h2>
                <p className="text-gray-400">Select the category that best describes your proposal</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {proposalTypes.map((type) => (
                  <div
                    key={type.value}
                    className={`relative rounded-xl border p-6 cursor-pointer transition-all duration-200 hover:scale-105 ${
                      formData.proposalType === type.value
                        ? 'border-mantle-500 bg-mantle-900/30 shadow-lg shadow-mantle-500/20'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => setFormData({ ...formData, proposalType: type.value })}
                  >
                    <div className="flex items-start">
                      <div className="text-2xl mr-4">{type.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <input
                            type="radio"
                            name="proposalType"
                            value={type.value}
                            checked={formData.proposalType === type.value}
                            onChange={(e) => setFormData({ ...formData, proposalType: e.target.value })}
                            className="h-4 w-4 text-mantle-500 border-gray-600 bg-gray-700 mr-3"
                          />
                          <h3 className="text-lg font-medium text-white">{type.label}</h3>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">{type.description}</p>
                        <div className="text-xs text-gray-500">
                          Examples: {type.examples.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Proposal Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mantle-500 focus:border-transparent"
                    placeholder="Enter a clear, descriptive title..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Detailed Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={8}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mantle-500 focus:border-transparent"
                    placeholder="Provide detailed information about your proposal, including rationale, implementation details, and expected outcomes..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Be specific and include all relevant details. This will help the AI provide better analysis.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!formData.title || !formData.description}
                  className="px-8 py-3 bg-mantle-600 hover:bg-mantle-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Analysis
                </button>
              </div>
            </div>

            {/* Step 2: AI Analysis */}
            <div className={step === 2 ? 'block' : 'hidden'}>
              <div className="text-center py-12">
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-white mb-4">AI Analysis</h2>
                  <p className="text-gray-400">
                    Our AI will analyze your proposal for clarity, risks, and key considerations
                  </p>
                </div>

                <button
                  type="button"
                  onClick={analyzeProposal}
                  disabled={isAnalyzing}
                  className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-mantle-600 hover:bg-mantle-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  {isAnalyzing ? (
                    <>
                      <LoadingSpinner className="mr-3 h-6 w-6" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="mr-3 h-6 w-6" />
                      Analyze Proposal
                    </>
                  )}
                </button>

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3: Review & Submit */}
            <div className={step === 3 ? 'block' : 'hidden'}>
              {aiAnalysis && (
                <div className="space-y-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-white mb-2">Review & Submit</h2>
                    <p className="text-gray-400">Review the AI analysis and submit your proposal</p>
                  </div>

                  {/* AI Analysis Results */}
                  <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">
                    <div className="flex items-center mb-6">
                      <SparklesIcon className="h-6 w-6 text-mantle-400 mr-3" />
                      <h3 className="text-xl font-semibold text-white">AI Analysis Results</h3>
                      {networkError && (
                        <span className="ml-2 text-xs text-yellow-400 bg-yellow-900/30 px-2 py-1 rounded">
                          Fallback Analysis
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-6">
                      {/* TL;DR */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                          <DocumentTextIcon className="h-4 w-4 mr-2" />
                          TL;DR Summary
                        </h4>
                        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                          <p className="text-gray-200 leading-relaxed">{aiAnalysis.tldr}</p>
                        </div>
                      </div>
                      
                      {/* Risk Assessment */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                          <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                          Risk Assessment
                        </h4>
                        <div className="flex items-start space-x-4">
                          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getRiskColor(aiAnalysis.riskLevel)}`}>
                            <span className="mr-2">{getRiskIcon(aiAnalysis.riskLevel)}</span>
                            {aiAnalysis.riskLevel} Risk
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-300 text-sm leading-relaxed">{aiAnalysis.riskExplanation}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Key Considerations */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                          <CheckCircleIcon className="h-4 w-4 mr-2" />
                          Key Considerations
                        </h4>
                        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                          <ul className="space-y-3">
                            {aiAnalysis.keyConsiderations?.map((consideration, index) => (
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

                  {/* Submit Section */}
                  <div className="bg-mantle-900/30 rounded-xl border border-mantle-800 p-6">
                    <div className="flex items-center mb-4">
                      <ClockIcon className="h-5 w-5 text-mantle-400 mr-2" />
                      <h4 className="text-lg font-medium text-white">Ready to Submit</h4>
                    </div>
                    <p className="text-gray-300 mb-6">
                      Your proposal will be submitted to the blockchain and open for voting for 7 days. 
                      Make sure all details are correct before submitting.
                    </p>
                    
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Back to Analysis
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex items-center px-8 py-3 bg-mantle-600 hover:bg-mantle-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                      >
                        {isLoading ? (
                          <>
                            <LoadingSpinner className="mr-2 h-5 w-5" />
                            {isPending ? 'Confirming...' : 'Creating Proposal...'}
                          </>
                        ) : (
                          'Submit Proposal'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateProposal
