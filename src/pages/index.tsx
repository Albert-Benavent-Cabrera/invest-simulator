import { DashboardController } from '../components/DashboardController'

export default async function HomePage() {
    return <DashboardController page="home" />
}

// eslint-disable-next-line react-refresh/only-export-components
export const getConfig = async () => {
    return {
        render: 'dynamic',
    } as const
}
