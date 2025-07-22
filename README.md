# 🏛️ DeFi DAO Advisor

**AI-Powered DAO Governance Platform for Smarter Community Decision-Making**

[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?logo=react)](https://reactjs.org/)
[![Powered by AI](https://img.shields.io/badge/Powered%20by-Gemini%20AI-4285F4?logo=google)](https://ai.google.dev/)
[![Deployed on Sepolia](https://img.shields.io/badge/Deployed%20on-Sepolia-627EEA?logo=ethereum)](https://sepolia.etherscan.io/)
[![Wagmi v2](https://img.shields.io/badge/Wagmi-v2-FF6B6B?logo=ethereum)](https://wagmi.sh/)

## 🌟 Overview

DeFi DAO Advisor revolutionizes decentralized governance by integrating **Google Gemini AI** with blockchain technology to provide intelligent proposal analysis, risk assessment, and community-driven decision making. Built for the modern DeFi ecosystem, it empowers DAOs to make informed decisions through AI-powered insights.

## ✨ Key Features

### 🤖 **AI-Powered Analysis**
- **Smart Proposal Analysis** using Google Gemini 2.0 Flash
- **Risk Assessment** with detailed explanations
- **Key Considerations** highlighting for informed voting
- **TL;DR Summaries** for quick understanding

### 🗳️ **Stake-Based Voting**
- **Token Staking** mechanism for voting weight
- **Multi-Category Proposals** (Governance, Treasury, Protocol, Partnership)
- **Real-time Vote Tracking** with transparent results
- **Reward Distribution** for aligned voters

### 🎨 **Modern UI/UX**
- **Responsive Design** for all devices
- **Dark Theme** optimized for Web3 users
- **Multi-Step Forms** with progress tracking
- **Real-time Status** indicators

### ⛓️ **Blockchain Integration**
- **Sepolia Testnet** deployment for testing
- **MetaMask Integration** with RainbowKit
- **Smart Contract** interactions via Wagmi v2
- **Transaction Monitoring** with detailed feedback

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MetaMask browser extension
- Sepolia testnet ETH ([Get from faucet](https://sepoliafaucet.com/))

### Installation

Clone the repository 
git clone https://github.com/shashwatraajsingh/DEFI-DAO-ADVISOR
cd defi-dao-advisor

Install frontend dependencies

npm install
Install backend dependencies

cd backend
npm install
cd ..



### Environment Setup

Create a `.env` file in the root directory:

Frontend Configuration

VITE_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
VITE_CONTRACT_ADDRESS=your_deployed_contract_address
VITE_STAKING_TOKEN_ADDRESS=your_staking_token_address
VITE_REWARD_TOKEN_ADDRESS=your_reward_token_address
VITE_BACKEND_URL=http://localhost:3001


Create a `backend/.env` file:

Backend Configuration

GEMINI_API_KEY=your_gemini_api_key
PORT=3001
NODE_ENV=development

Start backend server

cd backend
npm start
Start frontend (in new terminal)

cd ..
npm run dev


// Deploy in this order:

    StakingToken.sol

    RewardToken.sol

    DeFiDAOAdvisor.sol (with token addresses)



1. **Configure MetaMask**
- Network: Sepolia Testnet
- Chain ID: 11155111
- RPC: https://sepolia.infura.io/v3/...

2. **Update Environment Variables**
