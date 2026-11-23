import React from 'react';

const REGIONS = [
  { id: 'ALL', es: '🌍 Todo', en: '🌍 All' },
  { id: 'Europe', es: 'Europa', en: 'Europe' },
  { id: 'Asia', es: 'Asia', en: 'Asia' },
  { id: 'Africa', es: 'África', en: 'Africa' },
  { id: 'North America', es: 'Norteamérica', en: 'N. America' },
  { id: 'South America', es: 'Sudamérica', en: 'S. America' },
  { id: 'Oceania', es: 'Oceanía', en: 'Oceania' }
];

const QUIZ_TYPES = [
  { id: 'flags', icon: 'flag', es: 'Banderas', en: 'Flags' },
  { id: 'capitals', icon: 'location_city', es: 'Capitales', en: 'Capitals' },
  { id: 'mixed', icon: 'shuffle', es: 'Mixto', en: 'Mixed' }
];

const Home = ({
  startGame,
  openAtlas,
  userStats,
  totalCountries,
  quizType,
  setQuizType,
  selectedRegion,
  setSelectedRegion,
  lang,
  toggleLang
}) => {
  const masteredCount = (userStats.masteredCodes || []).length;

  return (
    <div
      style={{
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between'
      }}
    >
      {/* Top Bar: Mastery badge + Language toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          onClick={openAtlas}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '999px',
            background: 'var(--md-sys-color-surface)',
            border: '1px solid var(--md-sys-color-outline)',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <span>🏆</span>
          <span>{masteredCount}/{totalCountries}</span>
        </div>

        <button
          onClick={toggleLang}
          className="chip"
          style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>translate</span>
          {lang === 'es' ? 'ES' : 'EN'}
        </button>
      </div>

      {/* Hero Logo & Title */}
      <div className="animate-slide-up" style={{ textAlign: 'center', margin: '12px 0' }}>
        <img
          src="/icon.png"
          alt="Flag Quest"
          style={{
            width: '88px',
            height: '88px',
            borderRadius: '22px',
            boxShadow: 'var(--elevation-3)',
            marginBottom: '12px'
          }}
        />
        <h1 style={{ fontSize: '2.1rem', fontWeight: 900, letterSpacing: '-0.5px' }}>Flag Quest</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--md-sys-color-muted)', marginTop: '4px' }}>
          {lang === 'es' ? 'Países, banderas y capitales del mundo' : 'World countries, flags & capitals'}
        </p>
      </div>

      {/* Compact Filters: Quiz Type Segmented Control + Region Chips */}
      <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '6px',
            background: 'var(--md-sys-color-surface-variant)',
            padding: '5px',
            borderRadius: '16px'
          }}
        >
          {QUIZ_TYPES.map((qt) => {
            const active = quizType === qt.id;
            return (
              <button
                key={qt.id}
                onClick={() => setQuizType(qt.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px 8px',
                  borderRadius: '12px',
                  border: 'none',
                  background: active ? 'var(--md-sys-color-surface)' : 'transparent',
                  color: active ? 'var(--game-indigo)' : 'var(--md-sys-color-muted)',
                  boxShadow: active ? 'var(--elevation-1)' : 'none',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{qt.icon}</span>
                <span>{lang === 'es' ? qt.es : qt.en}</span>
              </button>
            );
          })}
        </div>

        <div className="chip-row" style={{ justifyContent: 'flex-start' }}>
          {REGIONS.map((reg) => (
            <button
              key={reg.id}
              className={`chip ${selectedRegion === reg.id ? 'active' : ''}`}
              onClick={() => setSelectedRegion(reg.id)}
            >
              {lang === 'es' ? reg.es : reg.en}
            </button>
          ))}
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button
          className="btn btn-primary"
          style={{ padding: '18px 22px', justifyContent: 'space-between', borderRadius: '18px' }}
          onClick={() => startGame('multiple_choice', quizType, selectedRegion)}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.08rem' }}>
            <span className="material-symbols-outlined">play_circle</span>
            {lang === 'es' ? 'Supervivencia (3 ❤️)' : 'Survival (3 ❤️)'}
          </span>
          <span style={{ fontSize: '0.82rem', opacity: 0.9, fontWeight: 500 }}>
            {lang === 'es' ? `Récord: ${userStats.bestScoreMC}` : `Best: ${userStats.bestScoreMC}`}
          </span>
        </button>

        <button
          className="btn btn-secondary"
          style={{ padding: '18px 22px', justifyContent: 'space-between', borderRadius: '18px' }}
          onClick={() => startGame('timed', quizType, selectedRegion)}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.08rem' }}>
            <span className="material-symbols-outlined">bolt</span>
            {lang === 'es' ? 'Contrarreloj 60s' : 'Timed 60s'}
          </span>
          <span style={{ fontSize: '0.82rem', opacity: 0.85, fontWeight: 600 }}>
            {lang === 'es' ? `Récord: ${userStats.bestScoreTimed}` : `Best: ${userStats.bestScoreTimed}`}
          </span>
        </button>

        <button
          className="btn btn-outline"
          style={{ padding: '13px 18px', borderRadius: '16px', fontSize: '0.92rem' }}
          onClick={openAtlas}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>menu_book</span>
          {lang === 'es' ? 'Atlas Mundial (197 países)' : 'World Atlas (197 countries)'}
        </button>
      </div>
    </div>
  );
};

export default Home;
