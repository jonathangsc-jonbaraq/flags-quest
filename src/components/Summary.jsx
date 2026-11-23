import React from 'react';

const Summary = ({ stats, mode, resetGame, playAgain, lang }) => {
  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  const getCountryName = (f) => (lang === 'es' ? f.nameEs || f.name : f.name);
  const getCapitalName = (f) => (lang === 'es' ? f.capitalEs || f.capital : f.capital);

  return (
    <div
      className="summary-container animate-slide-up"
      style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', gap: '16px' }}
    >
      <div style={{ textAlign: 'center', marginTop: '12px' }}>
        <img
          src="/icon.png"
          alt="Flag Quest"
          style={{ width: '64px', height: '64px', borderRadius: '16px', marginBottom: '10px', boxShadow: 'var(--elevation-2)' }}
        />
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--game-indigo)' }}>
          {mode === 'multiple_choice'
            ? (lang === 'es' ? '¡Partida Terminada!' : 'Game Over!')
            : (lang === 'es' ? '¡Tiempo Agotado!' : 'Time Up!')}
        </h1>
        <p style={{ color: 'var(--md-sys-color-muted)', fontSize: '1.1rem', marginTop: '4px' }}>
          {lang === 'es' ? 'Puntuación Final:' : 'Final Score:'}{' '}
          <strong style={{ color: 'var(--md-sys-color-on-background)', fontSize: '1.35rem' }}>{stats.score}</strong>
        </p>
        {stats.newlyMastered > 0 && (
          <div style={{
            display: 'inline-block',
            marginTop: '8px',
            padding: '4px 12px',
            borderRadius: '999px',
            background: 'var(--md-sys-color-success-container)',
            color: 'var(--md-sys-color-success)',
            fontWeight: 700,
            fontSize: '0.82rem'
          }}>
            +{stats.newlyMastered} {lang === 'es' ? 'nuevos países dominados en tu Atlas' : 'new countries mastered in your Atlas'}
          </div>
        )}
      </div>

      <div className="glass-card" style={{ padding: '18px' }}>
        <h3 style={{ marginBottom: '12px', fontSize: '1rem' }}>
          {lang === 'es' ? 'Estadísticas de la Sesión' : 'Session Statistics'}
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.92rem' }}>
          <span>{lang === 'es' ? 'Precisión:' : 'Accuracy:'}</span>
          <strong>{accuracy}%</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.92rem' }}>
          <span>{lang === 'es' ? 'Mejor Racha:' : 'Highest Streak:'}</span>
          <strong>{stats.highestStreak} 🔥</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem' }}>
          <span>{lang === 'es' ? 'Aciertos:' : 'Correct Answers:'}</span>
          <strong>{stats.correct} / {stats.total}</strong>
        </div>
      </div>

      {stats.missed && stats.missed.length > 0 && (
        <div className="glass-card" style={{ padding: '18px' }}>
          <h3 style={{ marginBottom: '12px', color: 'var(--md-sys-color-error)', fontSize: '1rem' }}>
            {lang === 'es' ? 'Repaso de Países y Capitales Fallados' : 'Review Missed Countries & Capitals'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {stats.missed.map((flag, idx) => (
              <div
                key={flag.code + idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '10px 12px',
                  background: 'var(--md-sys-color-surface-variant)',
                  borderRadius: '12px'
                }}
              >
                <img
                  src={`https://flagcdn.com/w80/${flag.code}.png`}
                  alt={getCountryName(flag)}
                  style={{ width: '54px', borderRadius: '6px', boxShadow: '0 2px 5px rgba(0,0,0,0.12)' }}
                />
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>{getCountryName(flag)}</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--md-sys-color-muted)' }}>
                    🏛️ {lang === 'es' ? 'Capital:' : 'Capital:'} <strong>{getCapitalName(flag)}</strong> • 👥 {flag.population}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto', paddingBottom: '8px' }}>
        <button className="btn btn-primary" onClick={playAgain}>
          <span className="material-symbols-outlined">replay</span>
          {lang === 'es' ? 'Jugar de Nuevo' : 'Play Again'}
        </button>
        <button className="btn btn-outline" onClick={resetGame}>
          <span className="material-symbols-outlined">home</span>
          {lang === 'es' ? 'Volver al Menú' : 'Back to Home'}
        </button>
      </div>
    </div>
  );
};

export default Summary;
