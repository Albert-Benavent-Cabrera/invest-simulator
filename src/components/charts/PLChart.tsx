import { formatCurrency } from '../../utils/format';

interface PLPoint {
    date: string;
    pl: number;
    fullDate: string;
}

interface PLChartProps {
    data: PLPoint[];
    height?: number | string;
}

export function PLChart({ data, height = '100%' }: PLChartProps) {
    if (data.length <= 1) {
        return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Sin datos suficientes</div>;
    }

    const plValues = data.map(d => d.pl);
    const minPL = Math.min(...plValues);
    const maxPL = Math.max(...plValues);

    // Normalize range to include 0 for the baseline and add breathing room
    const absoluteMax = Math.max(Math.abs(minPL), Math.abs(maxPL));
    const padding = absoluteMax * 0.2 || 20;
    const viewMin = Math.min(minPL, 0) - padding;
    const viewMax = Math.max(maxPL, 0) + padding;
    const viewRange = viewMax - viewMin;

    const width = 300;
    const chartHeight = 150;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = chartHeight - ((d.pl - viewMin) / viewRange) * chartHeight;
        return { x, y };
    });

    const pathData = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
    const areaData = `${pathData} L ${width},${chartHeight} L 0,${chartHeight} Z`;
    const zeroY = chartHeight - ((0 - viewMin) / viewRange) * chartHeight;

    const lastPL = data[data.length - 1]?.pl || 0;
    const isProfit = lastPL >= 0;
    const color = isProfit ? '#2ea043' : '#f85149';

    return (
        <div style={{ width: '100%', height, position: 'relative', overflow: 'hidden' }} data-testid="chart-pl">
            <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${width} ${chartHeight}`}
                preserveAspectRatio="none"
                style={{ display: 'block', overflow: 'visible' }}
            >
                <defs>
                    <linearGradient id="plGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                        <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Horizontal Baseline (Zero) */}
                <line
                    x1="0" y1={zeroY}
                    x2={width} y2={zeroY}
                    stroke="rgba(139, 148, 158, 0.3)"
                    strokeDasharray="4 4"
                />

                {/* Sub-grid lines */}
                <line x1="0" y1={chartHeight * 0.25} x2={width} y2={chartHeight * 0.25} stroke="rgba(255,255,255,0.03)" />
                <line x1="0" y1={chartHeight * 0.5} x2={width} y2={chartHeight * 0.5} stroke="rgba(255,255,255,0.03)" />
                <line x1="0" y1={chartHeight * 0.75} x2={width} y2={chartHeight * 0.75} stroke="rgba(255,255,255,0.03)" />

                {/* Area under the curve */}
                <path
                    d={areaData}
                    fill="url(#plGradient)"
                />

                {/* The Line */}
                <path
                    d={pathData}
                    fill="none"
                    stroke={color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                />
            </svg>

            {/* Custom Labeling Overlay */}
            <div style={{
                position: 'absolute',
                top: '4px',
                right: '8px',
                fontSize: '10px',
                color: color,
                fontWeight: 'bold',
                backgroundColor: 'rgba(0,0,0,0.3)',
                padding: '2px 6px',
                borderRadius: '4px',
                backdropFilter: 'blur(4px)',
                pointerEvents: 'none'
            }}>
                {lastPL > 0 ? '+' : ''}{formatCurrency(lastPL)}
            </div>
        </div>
    );
}
