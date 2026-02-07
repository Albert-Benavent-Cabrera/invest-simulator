import type { ReactNode } from 'react';
import '../index.css';

export default async function RootElement({ children }: { children: ReactNode }) {
    return (
        <html lang="es" suppressHydrationWarning>
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Invest Simulator</title>
            </head>
            <body suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const getConfig = async () => {
    return {
        render: 'static',
    } as const;
};
