import React from 'react';

const REGIONS = [
  { id: 'ALL', es: '🌍 Todo el Mundo (197)', en: '🌍 All World (197)' },
  { id: 'Europe', es: '🇪🇺 Europa (46)', en: '🇪🇺 Europe (46)' },
  { id: 'Asia', es: '🌏 Asia (49)', en: '🌏 Asia (49)' },
  { id: 'Africa', es: '🌍 África (54)', en: '🌍 Africa (54)' },
  { id: 'North America', es: '🌎 Norteamérica y Caribe (23)', en: '🌎 North America (23)' },
  { id: 'South America', es: '🌎 Sudamérica (12)', en: '🌎 South America (12)' },
  { id: 'Oceania', es: '🏝️ Oceanía (14)', en: '🏝️ Oceania (14)' }
];

const QUIZ_TYPES = [
  { id: 'flags', icon: 'flag', es: 'Banderas → País', en: 'Flags → Country' },
  { id: 'capitals', icon: 'location_city', es: 'País → Capital', en: 'Country → Capital' },
  { id: 'reverse_flags', icon: 'grid_view', es: 'País → 4 Banderas', en: 'Country → 4 Flags' },
  { id: 'mixed', icon: 'shuffle', es: 'Modo Mixto Total', en: 'Mixed Challenge' }
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
  const masteryPct = Math.min(100, Math.round((masteredCount / totalCountries) * 100));

  return (
    <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', gap: '14px' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src="/icon.png"
            alt="Flag Quest Icon"
            style={{ width: '44px', height: '44px', borderRadius: '12px', boxShadow: 'var(--elevation-1)' }}
          />
          <div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 900, lineHeight: 1.1 }}>Flag Quest</h1>
            <p style={{ fontSize: '0.78rem', color: 'var(--md-sys-color-muted)' }}>
              {lang === 'es' ? '197 Países • Banderas y Capitales' : '197 Countries • Flags & Capitals'}
            </p>
          </div>
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

      {/* World Mastery Progress Card */}
      <div className="glass-card animate-slide-up" style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
            {lang === 'es' ? '🏆 Dominio Mundial' : '🏆 World Mastery'}
          </span>
          <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--game-indigo)' }}>
            {masteredCount} / {totalCountries} ({masteryPct}%)
          </span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${masteryPct}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.78rem', color: 'var(--md-sys-color-muted)' }}>
          <span>{lang === 'es' ? `Récord Supervivencia: ${userStats.bestScoreMC}` : `Best Survival: ${userStats.bestScoreMC}`}</span>
          <span>{lang === 'es' ? `Récord 60s: ${userStats.bestScoreTimed}` : `Best 60s: ${userStats.bestScoreTimed}`}</span>
        </div>
      </div>

      {/* Quiz Type Selector */}
      <div className="animate-slide-up" style={{ animationDelay: '0.05s' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--md-sys-color-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {lang === 'es' ? '1. Elige qué practicar' : '1. Choose Quiz Category'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {QUIZ_TYPES.map((qt) => {
            const active = quizType === qt.id;
            return (
              <button
                key={qt.id}
                onClick={() => setQuizType(qt.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: '14px',
                  border: active ? '2px solid var(--game-indigo)' : '1.5px solid var(--md-sys-color-outline)',
                  background: active ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface)',
                  color: active ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface)',
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{qt.icon}</span>
                <span>{lang === 'es' ? qt.es : qt.en}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Region Filter */}
      <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--md-sys-color-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {lang === 'es' ? '2. Continente / Región' : '2. Continent / Region'}
        </div>
        <div className="chip-row">
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

      {/* Game Modes */}
      <div className="glass-card animate-slide-up" style={{ padding: '16px', animationDelay: '0.15s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
            {lang === 'es' ? '🎯 Modo Supervivencia (3 ❤️)' : '🎯 Survival Mode (3 ❤️)'}
          </h2>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--game-indigo)' }}>
            {lang === 'es' ? 'Dificultad Progresiva' : 'Progressive'}
          </span>
        </div>
        <p style={{ fontSize: '0.84rem', color: 'var(--md-sys-color-muted)', marginBottom: '12px' }}>
          {lang === 'es'
            ? 'Tienes 3 vidas. Aprende capitales, población y desbloquea países cada vez más difíciles sin repeticiones.'
            : 'You have 3 lives. Learn capitals & population as difficulty increases without repeating countries.'}
        </p>
        <button className="btn btn-primary" onClick={() => startGame('multiple_choice', quizType, selectedRegion)}>
          <span className="material-symbols-outlined">play_arrow</span>
          {lang === 'es' ? 'Jugar Supervivencia' : 'Play Survival'}
        </button>
      </div>

      <div className="glass-card animate-slide-up" style={{ padding: '16px', animationDelay: '0.2s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
            {lang === 'es' ? '⚡ Contrarreloj (60 Segundos)' : '⚡ Timed Challenge (60s)'}
          </h2>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--game-amber-dark)' }}>
            +2s {lang === 'es' ? 'por racha' : 'streak bonus'}
          </span>
        </div>
        <p style={{ fontSize: '0.84rem', color: 'var(--md-sys-color-muted)', marginBottom: '12px' }}>
          {lang === 'es'
            ? 'Responde tantas banderas y capitales como puedas en 60 segundos con avance rápido automático.'
            : 'Identify as many flags and capitals as possible in 60 seconds with fast auto-advance.'}
        </p>
        <button className="btn btn-secondary" onClick={() => startGame('timed', quizType, selectedRegion)}>
          <span className="material-symbols-outlined">timer</span>
          {lang === 'es' ? 'Iniciar Contrarreloj' : 'Start 60s Challenge'}
        </button>
      </div>

      {/* World Atlas Button */}
      <button
        className="btn btn-outline animate-slide-up"
        style={{ animationDelay: '0.25s', marginTop: 'auto' }}
        onClick={openAtlas}
      >
        <span className="material-symbols-outlined">menu_book</span>
        {lang === 'es' ? 'Explorar Atlas Mundial (197 Países y Capitales)' : 'Explore World Atlas (197 Countries & Capitals)'}
      </button>
    </div>
  );
};

export default Home;
