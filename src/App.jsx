import { useState, useEffect } from 'react';
import './index.css';
import Home from './components/Home';
import Game from './components/Game';
import Summary from './components/Summary';
import flagsData from './data/flags.json';

function App() {
  const [gameState, setGameState] = useState('home'); // 'home', 'playing', 'summary'
  const [gameMode, setGameMode] = useState(null); // 'multiple_choice', 'timed'
  const [level, setLevel] = useState(1);
  const [sessionStats, setSessionStats] = useState({ score: 0, streak: 0, highestStreak: 0, correct: 0, total: 0, missed: [] });
  
  // Stats stored in localStorage
  const [userStats, setUserStats] = useState({
    bestScoreMC: 0,
    bestScoreTimed: 0,
    unlockedRegions: ['North America', 'Europe', 'Asia']
  });

  useEffect(() => {
    const savedStats = localStorage.getItem('flagQuestStats');
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }
  }, []);

  const saveStats = (newStats) => {
    const combined = { ...userStats, ...newStats };
    setUserStats(combined);
    localStorage.setItem('flagQuestStats', JSON.stringify(combined));
  };

  const startGame = (mode, selectedLevel = 1) => {
    setGameMode(mode);
    setLevel(selectedLevel);
    setSessionStats({ score: 0, streak: 0, highestStreak: 0, correct: 0, total: 0, missed: [] });
    setGameState('playing');
  };

  const endGame = (finalStats) => {
    setSessionStats(finalStats);
    setGameState('summary');
    
    // Update High Scores
    if (gameMode === 'multiple_choice' && finalStats.score > userStats.bestScoreMC) {
      saveStats({ bestScoreMC: finalStats.score });
    } else if (gameMode === 'timed' && finalStats.score > userStats.bestScoreTimed) {
      saveStats({ bestScoreTimed: finalStats.score });
    }
  };

  const resetGame = () => {
    setGameState('home');
    setGameMode(null);
  };

  return (
    <div className="app-container">
      {gameState === 'home' && <Home startGame={startGame} userStats={userStats} />}
      {gameState === 'playing' && (
        <Game 
          mode={gameMode} 
          level={level} 
          flags={flagsData} 
          endGame={endGame} 
        />
      )}
      {gameState === 'summary' && (
        <Summary 
          stats={sessionStats} 
          mode={gameMode} 
          resetGame={resetGame} 
        />
      )}
    </div>
  );
}

export default App;
