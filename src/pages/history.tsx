import { DashboardController } from '../components/DashboardController'

export default async function HistoryPage() {
    return <DashboardController page="history" />
}

// eslint-disable-next-line react-refresh/only-export-components
export const getConfig = async () => {
    return { render: 'dynamic' } as const
}
