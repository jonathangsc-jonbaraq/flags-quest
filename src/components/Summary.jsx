import React from 'react';

const Summary = ({ stats, mode, resetGame }) => {
  return (
    <div className="summary-container animate-slide-up" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px', marginTop: '32px' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--game-indigo)' }}>
          {mode === 'multiple_choice' ? 'Game Over' : 'Time Up!'}
        </h1>
        <p style={{ color: 'var(--md-sys-color-secondary)', fontSize: '1.2rem' }}>
          Final Score: <strong style={{ color: 'var(--md-sys-color-on-background)' }}>{stats.score}</strong>
        </p>
      </div>

      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>Session Stats</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Accuracy:</span>
          <strong>{stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Highest Streak:</span>
          <strong>{stats.highestStreak}🔥</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Flags Guessed:</span>
          <strong>{stats.correct} / {stats.total}</strong>
        </div>
      </div>

      {stats.missed.length > 0 && (
        <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px', color: 'var(--md-sys-color-error)' }}>Review Missed Flags</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats.missed.map((flag, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                <img src={`https://flagcdn.com/w80/${flag.code}.png`} alt={flag.name} style={{ width: '60px', borderRadius: '4px' }} />
                <div>
                  <h4 style={{ margin: 0 }}>{flag.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--md-sys-color-secondary)' }}>Capital: {flag.capital}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button className="btn btn-primary" onClick={resetGame} style={{ marginTop: 'auto', marginBottom: '24px' }}>
        Back to Home
      </button>
    </div>
  );
};

export default Summary;
