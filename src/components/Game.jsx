import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const Game = ({ mode, level, flags, endGame }) => {
  const [currentFlag, setCurrentFlag] = useState(null);
  const [options, setOptions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(mode === 'timed' ? 60 : null);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [missed, setMissed] = useState([]);
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null); // null, true, false
  const [showLearnMore, setShowLearnMore] = useState(false);

  // Use refs to avoid stale closures in timeouts
  const statsRef = useRef({ score, streak, highestStreak, correct, total, missed });
  useEffect(() => {
    statsRef.current = { score, streak, highestStreak, correct, total, missed };
  }, [score, streak, highestStreak, correct, total, missed]);

  const generateQuestion = useCallback(() => {
    const availableFlags = flags.filter(f => f.difficulty <= level);
    const target = availableFlags[Math.floor(Math.random() * availableFlags.length)];
    const otherFlags = flags.filter(f => f.code !== target.code);
    const shuffledOthers = otherFlags.sort(() => 0.5 - Math.random()).slice(0, 3);
    const newOptions = [target, ...shuffledOthers].sort(() => 0.5 - Math.random());
    
    setCurrentFlag(target);
    setOptions(newOptions);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowLearnMore(false);
  }, [flags, level]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  useEffect(() => {
    let timer;
    if (mode === 'timed' && timeLeft > 0 && selectedOption === null) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
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
    
    // Calculate new stats immediately
    const newTotal = statsRef.current.total + 1;
    let newCorrect = statsRef.current.correct;
    let newStreak = statsRef.current.streak;
    let newHighestStreak = statsRef.current.highestStreak;
    let newScore = statsRef.current.score;
    let newMissed = [...statsRef.current.missed];

    setTotal(newTotal);

    if (isAnsCorrect) {
      setIsCorrect(true);
      newCorrect += 1;
      newStreak += 1;
      if (newStreak > newHighestStreak) newHighestStreak = newStreak;
      newScore += 10 + Math.floor(newStreak * 2);

      setCorrect(newCorrect);
      setStreak(newStreak);
      setHighestStreak(newHighestStreak);
      setScore(newScore);

      try { await Haptics.impact({ style: ImpactStyle.Light }); } catch(e) { if(navigator.vibrate) navigator.vibrate([50]); }
      setShowLearnMore(true);
    } else {
      setIsCorrect(false);
      newStreak = 0;
      if (!newMissed.find(f => f.code === currentFlag.code)) {
        newMissed.push(currentFlag);
      }

      setStreak(newStreak);
      setMissed(newMissed);
      
      try { await Haptics.vibrate({ duration: 300 }); } catch(e) { if(navigator.vibrate) navigator.vibrate([200, 50, 200]); }

      if (mode === 'multiple_choice') {
        setTimeout(() => {
          endGame({
            score: newScore,
            streak: newStreak,
            highestStreak: newHighestStreak,
            correct: newCorrect,
            total: newTotal,
            missed: newMissed
          });
        }, 1500);
      } else {
        setTimeout(() => {
          generateQuestion();
        }, 1500);
      }
    }
  };

  const handleNext = () => generateQuestion();

  if (!currentFlag) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-outlined" onClick={() => endGame(statsRef.current)} style={{cursor:'pointer', color: 'var(--md-sys-color-secondary)'}}>arrow_back</span>
          <span style={{ fontWeight: '500' }}>{mode === 'timed' ? 'Timed' : 'Endless'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {mode === 'timed' && (
            <div style={{ color: timeLeft <= 10 ? 'var(--md-sys-color-error)' : 'inherit', fontWeight: 'bold' }}>
              {timeLeft}s
            </div>
          )}
          <div className="score-badge">Score: {score}</div>
        </div>
      </div>

      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', marginBottom: '16px', color: 'var(--game-amber-dark)', fontWeight: 'bold', height: '24px' }}>
          {streak > 2 && `🔥 ${streak} Streak!`}
        </div>

        <div className={`glass-card ${isCorrect === true ? 'flash-correct' : isCorrect === false ? 'flash-wrong' : ''}`}
             style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '32px', padding: '24px', minHeight: '200px' }}>
          <img src={`https://flagcdn.com/w320/${currentFlag.code}.png`} alt="Guess the flag" className="animate-pop-in" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {options.map((option, idx) => {
            let btnClass = 'btn btn-option animate-slide-up';
            if (selectedOption !== null) {
              if (option.code === currentFlag.code) btnClass += ' correct';
              else if (option.code === selectedOption && !isCorrect) btnClass += ' wrong';
              else btnClass += ' fade';
            }
            
            return (
              <button 
                key={option.code + idx} 
                className={btnClass}
                onClick={() => handleOptionClick(option)}
                disabled={selectedOption !== null}
                style={{ animationDelay: `${idx * 0.1}s`, opacity: selectedOption !== null && option.code !== currentFlag.code && option.code !== selectedOption ? 0.6 : 1 }}
              >
                {option.name}
              </button>
            );
          })}
        </div>

        {showLearnMore && isCorrect && mode !== 'timed' && (
          <div className="glass-card animate-slide-up" style={{ marginTop: '24px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '4px solid var(--md-sys-color-success)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{currentFlag.name}</h3>
              <span className="material-symbols-outlined" style={{ color: 'var(--md-sys-color-success)' }}>check_circle</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--md-sys-color-secondary)' }}>Capital: <b>{currentFlag.capital}</b></p>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--md-sys-color-secondary)' }}>Population: <b>{currentFlag.population}</b></p>
            <button className="btn btn-primary" style={{ marginTop: '8px', padding: '8px 16px', fontSize: '1rem' }} onClick={handleNext}>Next Flag</button>
          </div>
        )}

        {showLearnMore && isCorrect && mode === 'timed' && (
          <button className="btn btn-primary animate-slide-up" style={{ marginTop: '24px' }} onClick={handleNext}>
            Next Flag
          </button>
        )}
      </div>
    </div>
  );
};

export default Game;
