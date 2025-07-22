export const addWeb3Web3ToMetaMask = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x138b', // 5003 in hex
          chainName: 'Web3 Web3 Testnet',
          nativeCurrency: {
            name: 'MNT',
            symbol: 'MNT',
            decimals: 18,
          },
          rpcUrls: ['https://rpc.Web3.Web3.xyz'],
          blockExplorerUrls: ['https://Web3.Web3scan.xyz'],
        },
      ],
    })
  } catch (error) {
    console.error('Error adding network:', error)
  }
}
