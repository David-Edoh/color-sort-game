import { useGameStore } from '../store/gameStore';
import { RotateCcw, Undo2, PlayCircle } from 'lucide-react';
import './UI.css';

export const UI = () => {
  const { 
    currentLevelIndex, 
    levels, 
    status, 
    undo, 
    restartLevel, 
    nextLevel,
    history 
  } = useGameStore();

  return (
    <div className="ui-container">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="level-indicator">
          Level {currentLevelIndex + 1} 
          <span className="total-levels">{levels.length} Total</span>
        </div>
        
        <div className="controls">
          <button 
            onClick={undo}
            disabled={history.length === 0 || status === 'won'}
            className="icon-button"
            title="Undo"
          >
            <Undo2 size={24} />
          </button>
          <button 
            onClick={restartLevel}
            className="icon-button"
            title="Restart"
          >
            <RotateCcw size={24} />
          </button>
        </div>
      </div>

      {/* Win Overlay */}
      {status === 'won' && (
        <div className="win-overlay">
          <div className="win-card">
            <h2>Level Cleared!</h2>
            <p>Awesome sorting skills!</p>
            <button 
              onClick={nextLevel}
              className="next-button"
            >
              <span>Next Level</span>
              <PlayCircle className="icon" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
