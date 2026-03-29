import React from 'react';

const Home = ({ startGame, userStats }) => {
  return (
    <div className="home-container" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }} className="animate-slide-up">
        <span className="material-symbols-outlined" style={{ fontSize: '64px', color: 'var(--game-indigo)' }}>public</span>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--md-sys-color-on-background)', margin: '16px 0' }}>Flag Quest</h1>
        <p style={{ color: 'var(--md-sys-color-secondary)' }}>Test your knowledge of world flags!</p>
      </div>

      <div className="glass-card animate-slide-up" style={{ padding: '24px', marginBottom: '24px', animationDelay: '0.1s' }}>
        <h2 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>Multiple Choice</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--md-sys-color-secondary)', marginBottom: '16px' }}>Identify as many flags as you can in a row. Best Score: {userStats.bestScoreMC}</p>
        <button className="btn btn-primary" onClick={() => startGame('multiple_choice')}>
          Play Now
        </button>
      </div>

      <div className="glass-card animate-slide-up" style={{ padding: '24px', animationDelay: '0.2s' }}>
        <h2 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>Timed Challenge</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--md-sys-color-secondary)', marginBottom: '16px' }}>Identify as many flags as possible in 60 seconds. Best Score: {userStats.bestScoreTimed}</p>
        <button className="btn btn-secondary" onClick={() => startGame('timed')}>
          Start Challenge
        </button>
      </div>
    </div>
  );
};

export default Home;
