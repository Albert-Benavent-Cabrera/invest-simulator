'use client';

import React, { useState } from 'react';
import { formatCurrency } from '../../utils/format';

interface AllocationData {
    symbol: string;
    name: string;
    currentValue: number;
}

interface PortfolioDistributionChartProps {
    data: AllocationData[];
    height?: number | string;
    showLegend?: boolean;
}

const COLORS = ['#2f81f7', '#238636', '#a371f7', '#f85149', '#db61a2', '#f1e05a'];

export function PortfolioDistributionChart({ data, height = '100%', showLegend = true }: PortfolioDistributionChartProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    if (data.length === 0) {
        return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>No hay activos</div>;
    }

    const totalValue = data.reduce((sum, a) => sum + a.currentValue, 0);

    // Circle parameters
    const size = 100;
    const center = size / 2;
    const radius = 38;
    const strokeWidth = 14;
    const circumference = 2 * Math.PI * radius;

    let currentOffset = 0;

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    return (
        <div
            style={{ width: '100%', height, display: 'flex', minHeight: 0, position: 'relative' }}
            data-testid="chart-portfolio-distribution"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredIndex(null)}
        >
            <div style={{ width: showLegend ? "55%" : "100%", height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <svg
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${size} ${size}`}
                    style={{ transform: 'rotate(-90deg)', maxWidth: '180px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))', overflow: 'visible' }}
                >
                    <defs>
                        {data.map((asset, index) => (
                            <linearGradient key={`grad-${index}`} id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor={COLORS[index % COLORS.length]} />
                                <stop offset="100%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.8} />
                            </linearGradient>
                        ))}
                    </defs>

                    {/* Background track / Hit area for "nothing" */}
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="transparent"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth={strokeWidth}
                        onMouseEnter={() => setHoveredIndex(null)}
                    />

                    {data.map((asset, index) => {
                        const percentage = totalValue > 0 ? asset.currentValue / totalValue : 0;
                        if (percentage === 0) return null;

                        const strokeDasharray = `${percentage * circumference} ${circumference}`;
                        const strokeDashoffset = -currentOffset;
                        currentOffset += percentage * circumference;

                        const isHovered = hoveredIndex === index;

                        return (
                            <circle
                                key={asset.symbol}
                                cx={center}
                                cy={center}
                                r={radius}
                                fill="transparent"
                                stroke={`url(#grad-${index})`}
                                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                style={{
                                    transition: 'all 0.2s ease-out',
                                    cursor: 'pointer',
                                    opacity: hoveredIndex !== null && !isHovered ? 0.3 : 1
                                }}
                                onMouseEnter={(e) => {
                                    e.stopPropagation();
                                    setHoveredIndex(index);
                                }}
                            />
                        );
                    })}
                </svg>
            </div>

            {showLegend && (
                <div style={{ width: '45%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px', overflowY: 'auto', paddingLeft: '12px' }}>
                    {data.map((asset, index) => (
                        <div
                            key={asset.symbol}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '0.75rem',
                                opacity: hoveredIndex !== null && hoveredIndex !== index ? 0.4 : 1,
                                transition: 'opacity 0.2s',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <div style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: COLORS[index % COLORS.length],
                                flexShrink: 0,
                                boxShadow: `0 0 8px ${COLORS[index % COLORS.length]}66`
                            }} />
                            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                                <span style={{
                                    color: '#c9d1d9',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    fontWeight: 600,
                                    fontSize: '0.7rem'
                                }}>
                                    {asset.name}
                                </span>
                                <span style={{
                                    color: '#8b949e',
                                    fontSize: '0.65rem'
                                }}>
                                    {asset.symbol}
                                </span>
                            </div>
                            <span style={{ color: '#c9d1d9', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
                                {totalValue > 0 ? ((asset.currentValue / totalValue) * 100).toFixed(0) : 0}%
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Hover Tooltip (ECharts style) */}
            {hoveredIndex !== null && (
                <div style={{
                    position: 'absolute',
                    left: mousePos.x > 150 ? mousePos.x - 180 : mousePos.x + 15,
                    top: mousePos.y > 150 ? mousePos.y - 120 : mousePos.y + 15,
                    backgroundColor: 'rgba(13, 17, 23, 0.95)',
                    border: `1px solid ${COLORS[hoveredIndex % COLORS.length]}88`,
                    borderRadius: '8px',
                    padding: '10px 14px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(12px)',
                    zIndex: 1000,
                    pointerEvents: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    minWidth: '160px',
                    transition: 'left 0.1s ease-out, top 0.1s ease-out'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px', marginBottom: '4px' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS[hoveredIndex % COLORS.length] }} />
                        <span style={{ color: '#f0f6fc', fontWeight: 600, fontSize: '0.85rem' }}>{data[hoveredIndex].name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', fontSize: '0.75rem' }}>
                        <span style={{ color: '#8b949e' }}>Símbolo:</span>
                        <span style={{ color: '#c9d1d9', fontFamily: 'monospace' }}>{data[hoveredIndex].symbol}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', fontSize: '0.75rem' }}>
                        <span style={{ color: '#8b949e' }}>Valor:</span>
                        <span style={{ color: '#c9d1d9', fontWeight: 500 }}>{formatCurrency(data[hoveredIndex].currentValue)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', fontSize: '0.75rem' }}>
                        <span style={{ color: '#8b949e' }}>Porcentaje:</span>
                        <span style={{ color: '#7ee787', fontWeight: 700 }}>{((data[hoveredIndex].currentValue / totalValue) * 100).toFixed(1)}%</span>
                    </div>
                </div>
            )}
        </div>
    );
}
