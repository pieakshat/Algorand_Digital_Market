import { Provider, useWallet } from '@txnlab/use-wallet'
import Account from './Account'

interface ConnectWalletInterface {
  openModal: boolean
  closeModal: () => void
}

const ConnectWallet = ({ openModal, closeModal }: ConnectWalletInterface) => {
  const { providers, activeAddress } = useWallet()

  const isKmd = (provider: Provider) => provider.metadata.name.toLowerCase() === 'kmd'

  return (
    <dialog id="connect_wallet_modal" className={`modal ${openModal ? 'modal-open' : ''}`}>
      <form method="dialog" className="modal-box bg-gradient-to-br from-green-50 to-teal-100 p-6 rounded-lg shadow-xl">
        <h3 className="font-bold text-2xl text-teal-700 text-center">Select Wallet Provider</h3>

        <div className="grid m-2 pt-5">
          {activeAddress && (
            <>
              <Account />
              <div className="divider my-4 border-teal-300" />
            </>
          )}

          {!activeAddress &&
            providers?.map((provider) => (
              <button
                data-test-id={`${provider.metadata.id}-connect`}
                className="flex items-center justify-start bg-white border border-teal-500 text-teal-800 rounded-lg px-4 py-2 m-2 shadow-md hover:bg-teal-100 transition-all duration-300"
                key={`provider-${provider.metadata.id}`}
                onClick={() => {
                  return provider.connect()
                }}
              >
                {!isKmd(provider) && (
                  <img alt={`wallet_icon_${provider.metadata.id}`} src={provider.metadata.icon} className="w-8 h-8 mr-3" />
                )}
                <span className="font-medium">{isKmd(provider) ? 'LocalNet Wallet' : provider.metadata.name}</span>
              </button>
            ))}
        </div>

        <div className="modal-action flex justify-between">
          <button
            data-test-id="close-wallet-modal"
            className="btn bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
            onClick={() => {
              closeModal()
            }}
          >
            Close
          </button>

          {activeAddress && (
            <button
              className="btn bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all duration-300"
              data-test-id="logout"
              onClick={() => {
                if (providers) {
                  const activeProvider = providers.find((p) => p.isActive)
                  if (activeProvider) {
                    activeProvider.disconnect()
                  } else {
                    // Required for logout/cleanup of inactive providers
                    localStorage.removeItem('txnlab-use-wallet')
                    window.location.reload()
                  }
                }
              }}
            >
              Logout
            </button>
          )}
        </div>
      </form>
    </dialog>
  )
}

export default ConnectWallet
