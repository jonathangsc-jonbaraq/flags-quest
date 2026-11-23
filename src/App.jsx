import { useState } from 'react';
import './index.css';
import Home from './components/Home';
import Game from './components/Game';
import Summary from './components/Summary';
import Atlas from './components/Atlas';
import flagsData from './data/flags.json';

const DEFAULT_STATS = {
  bestScoreMC: 0,
  bestScoreTimed: 0,
  bestScoreCapitals: 0,
  totalCorrect: 0,
  masteredCodes: []
};

function App() {
  const [gameState, setGameState] = useState('home'); // 'home', 'playing', 'summary', 'atlas'
  const [gameMode, setGameMode] = useState('multiple_choice'); // 'multiple_choice', 'timed'
  const [quizType, setQuizType] = useState('flags'); // 'flags', 'capitals', 'reverse_flags', 'mixed'
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [lang, setLang] = useState(() => localStorage.getItem('flagQuestLang') || 'es');
  const [sessionStats, setSessionStats] = useState({
    score: 0,
    streak: 0,
    highestStreak: 0,
    correct: 0,
    total: 0,
    missed: [],
    newlyMastered: 0
  });

  const [userStats, setUserStats] = useState(() => {
    try {
      const saved = localStorage.getItem('flagQuestStats');
      return saved ? { ...DEFAULT_STATS, ...JSON.parse(saved) } : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  });

  const toggleLang = () => {
    const next = lang === 'es' ? 'en' : 'es';
    setLang(next);
    localStorage.setItem('flagQuestLang', next);
  };

  const saveStats = (updates) => {
    const combined = { ...userStats, ...updates };
    setUserStats(combined);
    localStorage.setItem('flagQuestStats', JSON.stringify(combined));
  };

  const startGame = (mode, qType = quizType, region = selectedRegion) => {
    setGameMode(mode);
    setQuizType(qType);
    setSelectedRegion(region);
    setSessionStats({
      score: 0,
      streak: 0,
      highestStreak: 0,
      correct: 0,
      total: 0,
      missed: [],
      newlyMastered: 0
    });
    setGameState('playing');
  };

  const endGame = (finalStats) => {
    const existingMastered = new Set(userStats.masteredCodes || []);
    let newlyMastered = 0;
    (finalStats.guessedCodes || []).forEach((code) => {
      if (!existingMastered.has(code)) {
        existingMastered.add(code);
        newlyMastered += 1;
      }
    });

    const updatedMastered = Array.from(existingMastered);
    const updates = {
      masteredCodes: updatedMastered,
      totalCorrect: (userStats.totalCorrect || 0) + (finalStats.correct || 0)
    };

    if (gameMode === 'multiple_choice' && finalStats.score > (userStats.bestScoreMC || 0)) {
      updates.bestScoreMC = finalStats.score;
    }
    if (gameMode === 'timed' && finalStats.score > (userStats.bestScoreTimed || 0)) {
      updates.bestScoreTimed = finalStats.score;
    }
    if (quizType === 'capitals' && finalStats.score > (userStats.bestScoreCapitals || 0)) {
      updates.bestScoreCapitals = finalStats.score;
    }

    saveStats(updates);
    setSessionStats({ ...finalStats, newlyMastered });
    setGameState('summary');
  };

  const resetGame = () => {
    setGameState('home');
  };

  return (
    <div className="app-container">
      {gameState === 'home' && (
        <Home
          startGame={startGame}
          openAtlas={() => setGameState('atlas')}
          userStats={userStats}
          totalCountries={flagsData.length}
          quizType={quizType}
          setQuizType={setQuizType}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          lang={lang}
          toggleLang={toggleLang}
        />
      )}
      {gameState === 'playing' && (
        <Game
          mode={gameMode}
          quizType={quizType}
          region={selectedRegion}
          flags={flagsData}
          endGame={endGame}
          lang={lang}
        />
      )}
      {gameState === 'summary' && (
        <Summary
          stats={sessionStats}
          mode={gameMode}
          quizType={quizType}
          region={selectedRegion}
          resetGame={resetGame}
          playAgain={() => startGame(gameMode, quizType, selectedRegion)}
          lang={lang}
        />
      )}
      {gameState === 'atlas' && (
        <Atlas
          flags={flagsData}
          masteredCodes={userStats.masteredCodes || []}
          onBack={() => setGameState('home')}
          lang={lang}
        />
      )}
    </div>
  );
}

export default App;
