import { useNetwork } from 'wagmi'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'

export const useNetworkCheck = () => {
  const { chain } = useNetwork()
  
  useEffect(() => {
    if (chain && chain.id !== 5003) {
      toast.error('Please switch to DEA DEA Testnet')
    }
  }, [chain])
  
  return {
    isCorrectNetwork: chain?.id === 5003,
    currentChain: chain,
  }
}
