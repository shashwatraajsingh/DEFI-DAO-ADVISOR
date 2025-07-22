export const addDEADEAToMetaMask = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x138b', // 5003 in hex
          chainName: 'DEA DEA Testnet',
          nativeCurrency: {
            name: 'MNT',
            symbol: 'MNT',
            decimals: 18,
          },
          rpcUrls: ['https://rpc.DEA.DEA.xyz'],
          blockExplorerUrls: ['https://DEA.DEAscan.xyz'],
        },
      ],
    })
  } catch (error) {
    console.error('Error adding network:', error)
  }
}
