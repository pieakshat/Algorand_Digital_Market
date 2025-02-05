import { FaWallet } from 'react-icons/fa'
// import { WalletContext } from '../context/walletContext'
import { FC } from 'react'

interface ConnectWalletButtonProps {
  onConnect: () => void
  isConnected: boolean
}

const ConnectWalletButton: FC<ConnectWalletButtonProps> = () => {
  // const { connectWallet, connected, disconnectWallet } = useContext(WalletContext)

  async function handleConnect() {
    // if (connected) {
    //   disconnectWallet()
    // } else {
    //   connectWallet()
    // }
  }
  return (
    <button
      onClick={handleConnect}
      className={`px-6 py-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 flex items-center justify-center ${
        connected ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
      }`}
    >
      <FaWallet className="mr-2" />
      {connected ? 'Wallet Connected' : 'Connect Wallet'}
    </button>
  )
}

export default ConnectWalletButton
