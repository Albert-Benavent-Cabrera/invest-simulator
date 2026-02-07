import React from 'react';

interface IHistoryPoint {
    date: string;
    price: number;
}

interface SparklineProps {
    data: IHistoryPoint[];
    color: string;
    height?: number | string;
    strokeWidth?: number;
}

export function Sparkline({ data, color, height = '100%', strokeWidth = 2.5 }: SparklineProps) {
    if (!data || data.length < 2) {
        return <div style={{ height }} />;
    }

    const prices = data.map(d => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;

    // Add small padding to top/bottom
    const padding = range * 0.15;
    const viewMin = min - padding;
    const viewMax = max + padding;
    const viewRange = viewMax - viewMin;

    const width = 200;
    const sparkHeight = 80;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = sparkHeight - ((d.price - viewMin) / viewRange) * sparkHeight;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div style={{ width: '100%', height, position: 'relative' }} data-testid="chart-sparkline">
            <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${width} ${sparkHeight}`}
                preserveAspectRatio="none"
                style={{ display: 'block', overflow: 'visible' }}
            >
                <defs>
                    <filter id="sparkGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="1.5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
                <polyline
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                    filter="url(#sparkGlow)"
                    style={{ opacity: 0.9 }}
                />
            </svg>
        </div>
    );
}
