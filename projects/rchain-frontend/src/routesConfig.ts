import { ComponentType, lazy } from 'react'

interface RouteConfig {
  path: string
  Component: ComponentType
  label: string
}

const routes: RouteConfig[] = [
  {
    path: '/',
    Component: lazy(() => import('./pages/Home')),
    label: 'Home',
  },
  {
    path: '/join',
    Component: lazy(() => import('./pages/RoleSelection')),
    label: 'Role Selection',
  },
  {
    path: '/RecyclePlant',
    Component: lazy(() => import('./pages/RecyclePlant')),
    label: 'Recycle Plant',
  },
  {
    path: '/FundProvider',
    Component: lazy(() => import('./pages/FundProvider')),
    label: 'Fund Provider',
  },
  {
    path: '/FundProviderDashBoard',
    Component: lazy(() => import('./pages/FundProviderDashBoard')),
    label: 'Fund Provider Dashboard',
  },
  {
    path: '/PlantDashboard',
    Component: lazy(() => import('./pages/PlantsDashBoard')),
    label: 'Plant Dashboard',
  },
  {
    path: '/CompanyList',
    Component: lazy(() => import('./components/CompanyList')),
    label: 'Company List',
  },
]

export default routes
