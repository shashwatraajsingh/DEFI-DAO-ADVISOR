
import React from 'react'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { mantleTestnet } from 'wagmi/chains'
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

const { connectors } = getDefaultWallets({
  appName: 'DeFi DAO Advisor',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
  chains: [mantleTestnet],
})

const config = createConfig({
  chains: [mantleTestnet],
  connectors,
  transports: {
    [mantleTestnet.id]: http(),
  },
})

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider>
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
              <Toaster position="top-right" />
            </div>
          </Router>
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}

export default App
