import { DeflyWalletConnect } from '@blockshake/defly-connect'
import { DaffiWalletConnect } from '@daffiwallet/connect'
import { PeraWalletConnect } from '@perawallet/connect'
import { PROVIDER_ID, ProvidersArray, WalletProvider, useInitializeProviders } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import { SnackbarProvider } from 'notistack'
import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { getAlgodConfigFromViteEnvironment, getKmdConfigFromViteEnvironment } from './utils/network/getAlgoClientConfigs'

// Lazy-loaded components
const LazyHomePage = lazy(() => import('./pages/Home'))
const LazyRoleSelection = lazy(() => import('./pages/RoleSelection'))
const LazyRecyclePlant = lazy(() => import('./pages/RecyclePlant'))
const LazySignInPage = lazy(() => import('./pages/FundProvider'))
const LazyFundProviderDashBoard = lazy(() => import('./pages/FundProviderDashBoard'))
const LazyPlantDashboard = lazy(() => import('./pages/PlantsDashBoard'))
const LazyCompanyList = lazy(() => import('./components/CompanyList'))

let providersArray: ProvidersArray
if (import.meta.env.VITE_ALGOD_NETWORK === '') {
  const kmdConfig = getKmdConfigFromViteEnvironment()
  providersArray = [
    {
      id: PROVIDER_ID.KMD,
      clientOptions: {
        wallet: kmdConfig.wallet,
        password: kmdConfig.password,
        host: kmdConfig.server,
        token: String(kmdConfig.token),
        port: String(kmdConfig.port),
      },
    },
  ]
} else {
  providersArray = [
    { id: PROVIDER_ID.DEFLY, clientStatic: DeflyWalletConnect },
    { id: PROVIDER_ID.PERA, clientStatic: PeraWalletConnect },
    { id: PROVIDER_ID.DAFFI, clientStatic: DaffiWalletConnect },
    { id: PROVIDER_ID.EXODUS },
  ]
}

export default function App() {
  const algodConfig = getAlgodConfigFromViteEnvironment()

  const walletProviders = useInitializeProviders({
    providers: providersArray,
    nodeConfig: {
      network: algodConfig.network,
      nodeServer: algodConfig.server,
      nodePort: String(algodConfig.port),
      nodeToken: String(algodConfig.token),
    },
    algosdkStatic: algosdk,
  })

  return (
    <SnackbarProvider maxSnack={3}>
      <WalletProvider value={walletProviders}>
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<LazyHomePage />} />
              <Route path="/join" element={<LazyRoleSelection />} />
              <Route path="/RecyclePlant" element={<LazyRecyclePlant />} />
              <Route path="/FundProvider" element={<LazySignInPage />} />
              <Route path="/FundProviderDashBoard" element={<LazyFundProviderDashBoard />} />
              <Route path="/PlantDashboard" element={<LazyPlantDashboard />} />
              <Route path="/CompanyList" element={<LazyCompanyList />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </WalletProvider>
    </SnackbarProvider>
  )
}
