import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const REGION_NAMES_ES = {
  'Europe': 'Europa',
  'Asia': 'Asia',
  'Africa': 'África',
  'North America': 'Norteamérica y Caribe',
  'South America': 'Sudamérica',
  'Oceania': 'Oceanía'
};

const Game = ({ mode, quizType, region, flags, endGame, lang }) => {
  const [currentFlag, setCurrentFlag] = useState(null);
  const [activeSubType, setActiveSubType] = useState('flags'); // 'flags', 'capitals', 'reverse_flags'
  const [options, setOptions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(mode === 'timed' ? 60 : null);
  const [lives, setLives] = useState(mode === 'multiple_choice' ? 3 : null);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [missed, setMissed] = useState([]);
  const [guessedCodes, setGuessedCodes] = useState([]);
  const [bonusToast, setBonusToast] = useState(null);

  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showLearnMore, setShowLearnMore] = useState(false);

  const seenCodesRef = useRef(new Set());
  const statsRef = useRef({ score, streak, highestStreak, correct, total, missed, guessedCodes });

  useEffect(() => {
    statsRef.current = { score, streak, highestStreak, correct, total, missed, guessedCodes };
  }, [score, streak, highestStreak, correct, total, missed, guessedCodes]);

  const getCountryName = (f) => (lang === 'es' ? f.nameEs || f.name : f.name);
  const getCapitalName = (f) => (lang === 'es' ? f.capitalEs || f.capital : f.capital);
  const getRegionName = (r) => (lang === 'es' ? REGION_NAMES_ES[r] || r : r);

  const generateQuestion = useCallback((currentCorrectCount = statsRef.current.correct) => {
    const regionPool = region === 'ALL' ? flags : flags.filter((f) => f.region === region);

    // Progressive difficulty when playing ALL world:
    // 0-4 correct -> difficulty 1, 5-11 correct -> difficulty <=2, 12+ -> all 197 countries
    let difficultyCap = 3;
    if (region === 'ALL') {
      if (currentCorrectCount < 5) difficultyCap = 1;
      else if (currentCorrectCount < 12) difficultyCap = 2;
      else difficultyCap = 3;
    }

    let availableFlags = regionPool.filter((f) => f.difficulty <= difficultyCap);
    if (availableFlags.length < 4) availableFlags = regionPool;

    // Exclude already-seen flags in this session so questions don't repeat
    let unseen = availableFlags.filter((f) => !seenCodesRef.current.has(f.code));
    if (unseen.length === 0) {
      // If tier exhausted, expand to full region pool before resetting
      unseen = regionPool.filter((f) => !seenCodesRef.current.has(f.code));
      if (unseen.length === 0) {
        seenCodesRef.current.clear();
        unseen = regionPool;
      }
    }

    const target = unseen[Math.floor(Math.random() * unseen.length)];
    seenCodesRef.current.add(target.code);

    // Pick distractions preferably from same region for better challenge
    const sameRegionDistractors = regionPool.filter((f) => f.code !== target.code);
    const distractorSource = sameRegionDistractors.length >= 3
      ? sameRegionDistractors
      : flags.filter((f) => f.code !== target.code);

    const shuffledOthers = [...distractorSource].sort(() => 0.5 - Math.random()).slice(0, 3);
    const newOptions = [target, ...shuffledOthers].sort(() => 0.5 - Math.random());

    let subType = quizType;
    if (quizType === 'mixed') {
      const types = ['flags', 'capitals', 'reverse_flags'];
      subType = types[Math.floor(Math.random() * types.length)];
    }

    setActiveSubType(subType);
    setCurrentFlag(target);
    setOptions(newOptions);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowLearnMore(false);
  }, [flags, region, quizType]);

  useEffect(() => {
    seenCodesRef.current.clear();
    generateQuestion(0);
  }, [generateQuestion]);

  useEffect(() => {
    let timer;
    if (mode === 'timed' && timeLeft > 0 && selectedOption === null) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame(statsRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, timeLeft, selectedOption, endGame]);

  const handleOptionClick = async (option) => {
    if (selectedOption !== null) return;

    setSelectedOption(option.code);
    const isAnsCorrect = option.code === currentFlag.code;

    const newTotal = statsRef.current.total + 1;
    let newCorrect = statsRef.current.correct;
    let newStreak = statsRef.current.streak;
    let newHighestStreak = statsRef.current.highestStreak;
    let newScore = statsRef.current.score;
    let newMissed = [...statsRef.current.missed];
    let newGuessed = [...statsRef.current.guessedCodes];

    setTotal(newTotal);

    if (isAnsCorrect) {
      setIsCorrect(true);
      newCorrect += 1;
      newStreak += 1;
      if (newStreak > newHighestStreak) newHighestStreak = newStreak;
      const difficultyBonus = (currentFlag.difficulty || 1) * 5;
      newScore += 10 + difficultyBonus + Math.floor(newStreak * 2);
      if (!newGuessed.includes(currentFlag.code)) {
        newGuessed.push(currentFlag.code);
      }

      setCorrect(newCorrect);
      setStreak(newStreak);
      setHighestStreak(newHighestStreak);
      setScore(newScore);
      setGuessedCodes(newGuessed);

      if (mode === 'timed' && newStreak > 0 && newStreak % 5 === 0) {
        setTimeLeft((prev) => prev + 2);
        setBonusToast('+2s 🔥');
        setTimeout(() => setBonusToast(null), 1200);
      }

      try {
        await Haptics.impact({ style: ImpactStyle.Light });
      } catch {
        if (navigator.vibrate) navigator.vibrate([40]);
      }

      if (mode === 'timed') {
        setTimeout(() => {
          generateQuestion(newCorrect);
        }, 550);
      } else {
        setShowLearnMore(true);
      }
    } else {
      setIsCorrect(false);
      newStreak = 0;
      if (!newMissed.find((f) => f.code === currentFlag.code)) {
        newMissed.push(currentFlag);
      }

      setStreak(newStreak);
      setMissed(newMissed);

      try {
        await Haptics.vibrate({ duration: 300 });
      } catch {
        if (navigator.vibrate) navigator.vibrate([180, 50, 180]);
      }

      if (mode === 'multiple_choice') {
        const nextLives = (lives || 1) - 1;
        setLives(nextLives);
        if (nextLives <= 0) {
          setTimeout(() => {
            endGame({
              score: newScore,
              streak: newStreak,
              highestStreak: newHighestStreak,
              correct: newCorrect,
              total: newTotal,
              missed: newMissed,
              guessedCodes: newGuessed
            });
          }, 1400);
        } else {
          setShowLearnMore(true);
        }
      } else {
        setTimeout(() => {
          generateQuestion(newCorrect);
        }, 950);
      }
    }
  };

  const handleNext = () => generateQuestion(statsRef.current.correct);

  if (!currentFlag) return null;

  const currentTier = region !== 'ALL'
    ? getRegionName(region)
    : correct < 5
      ? (lang === 'es' ? 'Nivel 1 • Famosos' : 'Tier 1 • Famous')
      : correct < 12
        ? (lang === 'es' ? 'Nivel 2 • Intermedio' : 'Tier 2 • Intermediate')
        : (lang === 'es' ? 'Nivel 3 • Experto Mundial' : 'Tier 3 • World Expert');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top Header */}
      <div className="top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            className="material-symbols-outlined"
            onClick={() => endGame(statsRef.current)}
            style={{ cursor: 'pointer', color: 'var(--md-sys-color-muted)' }}
          >
            arrow_back
          </span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
              {mode === 'timed'
                ? (lang === 'es' ? 'Contrarreloj' : 'Timed 60s')
                : (lang === 'es' ? 'Supervivencia' : 'Survival')}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--md-sys-color-muted)' }}>{currentTier}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {mode === 'multiple_choice' && (
            <div style={{ fontSize: '0.95rem', letterSpacing: '2px' }}>
              {'❤️'.repeat(Math.max(0, lives))}{'🖤'.repeat(Math.max(0, 3 - lives))}
            </div>
          )}
          {mode === 'timed' && (
            <div style={{
              color: timeLeft <= 10 ? 'var(--md-sys-color-error)' : 'inherit',
              fontWeight: 800,
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              ⏱️ {timeLeft}s
              {bonusToast && <span style={{ color: 'var(--md-sys-color-success)', fontSize: '0.85rem' }}>{bonusToast}</span>}
            </div>
          )}
          <div className="score-badge">{score} pts</div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', minHeight: '22px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--md-sys-color-muted)', fontWeight: 600 }}>
            {lang === 'es' ? `Pregunta #${total + (selectedOption ? 0 : 1)}` : `Question #${total + (selectedOption ? 0 : 1)}`}
          </span>
          <span style={{ color: 'var(--game-amber-dark)', fontWeight: 800, fontSize: '0.9rem' }}>
            {streak >= 2 ? `🔥 ${streak} ${lang === 'es' ? 'en racha!' : 'Streak!'}` : ''}
          </span>
        </div>

        {/* Question Prompt Card */}
        <div
          className={`glass-card ${isCorrect === true ? 'flash-correct' : isCorrect === false ? 'flash-wrong' : ''}`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '16px',
            padding: '18px',
            minHeight: '185px',
            textAlign: 'center',
            gap: '12px'
          }}
        >
          {activeSubType === 'flags' && (
            <>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--md-sys-color-muted)', textTransform: 'uppercase' }}>
                {lang === 'es' ? '¿A qué país pertenece esta bandera?' : 'Which country does this flag belong to?'}
              </span>
              <img
                key={currentFlag.code}
                src={`https://flagcdn.com/w320/${currentFlag.code}.png`}
                alt="Guess the flag"
                className="animate-pop-in"
                style={{
                  maxWidth: '100%',
                  maxHeight: '145px',
                  borderRadius: '10px',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.14)',
                  border: '1px solid rgba(0,0,0,0.08)'
                }}
              />
            </>
          )}

          {activeSubType === 'capitals' && (
            <>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--md-sys-color-muted)', textTransform: 'uppercase' }}>
                {lang === 'es' ? '¿Cuál es la capital de este país?' : 'What is the capital of this country?'}
              </span>
              <img
                key={currentFlag.code}
                src={`https://flagcdn.com/w160/${currentFlag.code}.png`}
                alt={getCountryName(currentFlag)}
                className="animate-pop-in"
                style={{
                  height: '76px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                  border: '1px solid rgba(0,0,0,0.08)'
                }}
              />
              <h2 style={{ fontSize: '1.45rem', fontWeight: 900 }}>{getCountryName(currentFlag)}</h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--md-sys-color-muted)' }}>
                {getRegionName(currentFlag.region)}
              </span>
            </>
          )}

          {activeSubType === 'reverse_flags' && (
            <>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--md-sys-color-muted)', textTransform: 'uppercase' }}>
                {lang === 'es' ? 'Selecciona la bandera correcta de:' : 'Select the correct flag for:'}
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--game-indigo)' }}>
                {getCountryName(currentFlag)}
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--md-sys-color-muted)' }}>
                🏛️ {lang === 'es' ? 'Capital:' : 'Capital:'} <strong>{getCapitalName(currentFlag)}</strong> • {getRegionName(currentFlag.region)}
              </p>
            </>
          )}
        </div>

        {/* 4 Answer Options */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {options.map((option, idx) => {
            const isTarget = option.code === currentFlag.code;
            const isSelected = option.code === selectedOption;

            if (activeSubType === 'reverse_flags') {
              let cardClass = 'flag-option-card animate-slide-up';
              if (selectedOption !== null) {
                if (isTarget) cardClass += ' correct';
                else if (isSelected && !isCorrect) cardClass += ' wrong';
              }
              return (
                <button
                  key={option.code + idx}
                  className={cardClass}
                  onClick={() => handleOptionClick(option)}
                  disabled={selectedOption !== null}
                  style={{
                    animationDelay: `${idx * 0.06}s`,
                    opacity: selectedOption !== null && !isTarget && !isSelected ? 0.45 : 1
                  }}
                >
                  <img
                    src={`https://flagcdn.com/w160/${option.code}.png`}
                    alt="Flag option"
                    style={{ maxWidth: '100%', maxHeight: '72px', borderRadius: '6px', boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }}
                  />
                </button>
              );
            }

            let btnClass = 'btn btn-option animate-slide-up';
            if (selectedOption !== null) {
              if (isTarget) btnClass += ' correct';
              else if (isSelected && !isCorrect) btnClass += ' wrong';
            }

            const label = activeSubType === 'capitals' ? getCapitalName(option) : getCountryName(option);

            return (
              <button
                key={option.code + idx}
                className={btnClass}
                onClick={() => handleOptionClick(option)}
                disabled={selectedOption !== null}
                style={{
                  animationDelay: `${idx * 0.06}s`,
                  opacity: selectedOption !== null && !isTarget && !isSelected ? 0.55 : 1
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Educational Learn More Pop-up Card (Survival Mode) */}
        {showLearnMore && mode === 'multiple_choice' && (
          <div
            className="glass-card animate-slide-up"
            style={{
              marginTop: '16px',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              borderLeft: `5px solid ${isCorrect ? 'var(--md-sys-color-success)' : 'var(--md-sys-color-error)'}`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img
                  src={`https://flagcdn.com/w80/${currentFlag.code}.png`}
                  alt={getCountryName(currentFlag)}
                  style={{ width: '36px', borderRadius: '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}
                />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>{getCountryName(currentFlag)}</h3>
              </div>
              <span
                className="material-symbols-outlined"
                style={{ color: isCorrect ? 'var(--md-sys-color-success)' : 'var(--md-sys-color-error)' }}
              >
                {isCorrect ? 'check_circle' : 'cancel'}
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.84rem', color: 'var(--md-sys-color-muted)', marginTop: '2px' }}>
              <span>🏛️ {lang === 'es' ? 'Capital:' : 'Capital:'} <strong style={{ color: 'var(--md-sys-color-on-surface)' }}>{getCapitalName(currentFlag)}</strong></span>
              <span>👥 {lang === 'es' ? 'Población:' : 'Pop:'} <strong style={{ color: 'var(--md-sys-color-on-surface)' }}>{currentFlag.population}</strong></span>
              <span>🌍 {getRegionName(currentFlag.region)}</span>
            </div>
            <button
              className="btn btn-primary"
              style={{ marginTop: '8px', padding: '10px 16px', fontSize: '0.95rem' }}
              onClick={handleNext}
            >
              {lang === 'es' ? 'Siguiente →' : 'Next →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
