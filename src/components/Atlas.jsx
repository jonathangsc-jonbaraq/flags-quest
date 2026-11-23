import React, { useState, useMemo } from 'react';

const REGIONS = [
  { id: 'ALL', es: 'Todos (197)', en: 'All (197)' },
  { id: 'Europe', es: 'Europa', en: 'Europe' },
  { id: 'Asia', es: 'Asia', en: 'Asia' },
  { id: 'Africa', es: 'África', en: 'Africa' },
  { id: 'North America', es: 'Norteamérica', en: 'North America' },
  { id: 'South America', es: 'Sudamérica', en: 'South America' },
  { id: 'Oceania', es: 'Oceanía', en: 'Oceania' }
];

const Atlas = ({ flags, masteredCodes, onBack, lang }) => {
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('ALL');
  const masteredSet = useMemo(() => new Set(masteredCodes), [masteredCodes]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return flags
      .filter((f) => (regionFilter === 'ALL' ? true : f.region === regionFilter))
      .filter((f) => {
        if (!q) return true;
        const name = (lang === 'es' ? f.nameEs || f.name : f.name).toLowerCase();
        const cap = (lang === 'es' ? f.capitalEs || f.capital : f.capital).toLowerCase();
        return name.includes(q) || cap.includes(q) || f.code.includes(q);
      })
      .sort((a, b) => {
        const na = lang === 'es' ? a.nameEs || a.name : a.name;
        const nb = lang === 'es' ? b.nameEs || b.name : b.name;
        return na.localeCompare(nb);
      });
  }, [flags, regionFilter, search, lang]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            className="material-symbols-outlined"
            onClick={onBack}
            style={{ cursor: 'pointer', color: 'var(--md-sys-color-muted)' }}
          >
            arrow_back
          </span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem' }}>
              {lang === 'es' ? 'Atlas Mundial' : 'World Atlas'}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--md-sys-color-muted)' }}>
              {filtered.length} {lang === 'es' ? 'países mostrados' : 'countries shown'}
            </div>
          </div>
        </div>
        <div className="score-badge">
          ✓ {masteredSet.size} / {flags.length}
        </div>
      </div>

      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px', borderBottom: '1px solid var(--md-sys-color-outline)' }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={lang === 'es' ? 'Buscar país o capital...' : 'Search country or capital...'}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '12px',
            border: '1.5px solid var(--md-sys-color-outline)',
            background: 'var(--md-sys-color-surface)',
            color: 'var(--md-sys-color-on-surface)',
            fontSize: '0.92rem',
            outline: 'none'
          }}
        />
        <div className="chip-row">
          {REGIONS.map((r) => (
            <button
              key={r.id}
              className={`chip ${regionFilter === r.id ? 'active' : ''}`}
              onClick={() => setRegionFilter(r.id)}
            >
              {lang === 'es' ? r.es : r.en}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map((flag) => {
          const isMastered = masteredSet.has(flag.code);
          const countryName = lang === 'es' ? flag.nameEs || flag.name : flag.name;
          const capitalName = lang === 'es' ? flag.capitalEs || flag.capital : flag.capital;
          return (
            <div
              key={flag.code}
              className="glass-card"
              style={{
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                borderLeft: isMastered ? '4px solid var(--md-sys-color-success)' : undefined
              }}
            >
              <img
                src={`https://flagcdn.com/w80/${flag.code}.png`}
                alt={countryName}
                loading="lazy"
                style={{ width: '52px', borderRadius: '6px', boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{countryName}</h4>
                  {isMastered && (
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--md-sys-color-success)' }}>
                      verified
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--md-sys-color-muted)', marginTop: '2px' }}>
                  🏛️ <strong>{capitalName}</strong> • 👥 {flag.population}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Atlas;
