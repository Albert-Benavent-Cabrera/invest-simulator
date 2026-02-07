export function MarketSkeleton() {
    return (
        <section>
            <h2 className="section-title">📊 Acciones</h2>
            <div className="assets-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div className="glass-panel" key={i} style={{ height: '380px', animation: 'pulse-glow 1.5s infinite ease-in-out' }} />
                ))}
            </div>
        </section>
    )
}
