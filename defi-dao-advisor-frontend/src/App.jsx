import React from 'react'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { defineChain } from 'viem'
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import CreateProposal from './pages/CreateProposal'
import ProposalDetail from './pages/ProposalDetail'
import Dashboard from './pages/Dashboard'
import ProposalList from './pages/ProposalList'

import '@rainbow-me/rainbowkit/styles.css'
import './App.css'

// Define the correct Mantle Sepolia Testnet
const mantleSepoliaTestnet = defineChain({
  id: 5003,
  name: 'Mantle Sepolia Testnet',
  network: 'mantle-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'MNT',
    symbol: 'MNT',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.sepolia.mantle.xyz'],
    },
    public: {
      http: ['https://rpc.sepolia.mantle.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Mantle Sepolia Explorer',
      url: 'https://sepolia.mantlescan.xyz',
    },
  },
  testnet: true,
})

// Get project ID with fallback
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'demo-project-id'

// Warn if using demo project ID
if (projectId === 'demo-project-id') {
  console.warn('Using demo project ID. Please set VITE_WALLET_CONNECT_PROJECT_ID in your .env file')
}

// Configure wallet connectors using getDefaultWallets (simpler approach)
const { connectors } = getDefaultWallets({
  appName: 'DeFi DAO Advisor',
  projectId: projectId,
  chains: [mantleSepoliaTestnet],
})

// Create Wagmi config with Mantle Sepolia Testnet
const config = createConfig({
  chains: [mantleSepoliaTestnet],
  connectors,
  transports: {
    [mantleSepoliaTestnet.id]: http('https://rpc.sepolia.mantle.xyz'),
  },
})

// Configure QueryClient with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider
          chains={[mantleSepoliaTestnet]}
          initialChain={mantleSepoliaTestnet}
        >
          <Router>
            <div className="min-h-screen bg-gray-900">
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/proposals" element={<ProposalList />} />
                  <Route path="/create" element={<CreateProposal />} />
                  <Route path="/proposal/:id" element={<ProposalDetail />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
              </Layout>
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1f2937',
                    color: '#f9fafb',
                    border: '1px solid #374151',
                  },
                  success: {
                    iconTheme: {
                      primary: '#14b8a6',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </div>
          </Router>
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}

export default App
