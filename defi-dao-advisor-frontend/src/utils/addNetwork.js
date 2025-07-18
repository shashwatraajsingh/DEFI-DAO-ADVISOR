export const addMantleSepoliaToMetaMask = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x138b', // 5003 in hex
          chainName: 'Mantle Sepolia Testnet',
          nativeCurrency: {
            name: 'MNT',
            symbol: 'MNT',
            decimals: 18,
          },
          rpcUrls: ['https://rpc.sepolia.mantle.xyz'],
          blockExplorerUrls: ['https://sepolia.mantlescan.xyz'],
        },
      ],
    })
  } catch (error) {
    console.error('Error adding network:', error)
  }
}
