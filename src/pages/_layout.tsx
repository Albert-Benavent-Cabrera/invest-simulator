// RootLayout (simplificado)

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}

// eslint-disable-next-line react-refresh/only-export-components
export const getConfig = async () => {
    return {
        render: 'dynamic',
    } as const
}
