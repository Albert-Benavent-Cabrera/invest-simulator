export function HistorySkeleton() {
    return (
        <div className="glass-panel" style={{ padding: '24px', height: '100%', animation: 'pulse-glow 1.5s infinite ease-in-out' }}>
            <div style={{ height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '16px' }} />
            <div style={{ height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }} />
        </div>
    )
}
