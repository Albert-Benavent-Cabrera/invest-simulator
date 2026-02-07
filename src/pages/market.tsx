import { DashboardController } from '../components/DashboardController'

export default async function MarketPage() {
    return <DashboardController page="market" />
}

// eslint-disable-next-line react-refresh/only-export-components
export const getConfig = async () => {
    return { render: 'dynamic' } as const
}
