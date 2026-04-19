import { create } from 'zustand';
import levels, { type LevelType } from '../levels';

type GameState = {
  levels: LevelType[];
  currentLevelIndex: number;
  tubes: string[][];
  selectedTube: number | null;
  history: string[][][];
  status: 'playing' | 'won';
  selectTube: (index: number) => void;
  undo: () => void;
  restartLevel: () => void;
  nextLevel: () => void;
  startLevel: (index: number) => void;
};

const checkWinCondition = (tubes: string[][]): boolean => {
  return tubes.every(tube => {
    if (tube.length === 0) return true;
    if (tube.length !== 4) return false;
    const firstColor = tube[0];
    return tube.every(color => color === firstColor);
  });
};

export const useGameStore = create<GameState>((set, get) => ({
  levels,
  currentLevelIndex: 0,
  tubes: levels[0].tubes.map(t => [...t]),
  selectedTube: null,
  history: [],
  status: 'playing',

  startLevel: (index: number) => {
    const levelIndex = Math.max(0, Math.min(index, levels.length - 1));
    const levelData = levels[levelIndex];
    set({
      currentLevelIndex: levelIndex,
      tubes: levelData.tubes.map(t => [...t]),
      selectedTube: null,
      history: [],
      status: 'playing'
    });
  },

  selectTube: (index: number) => {
    const { status, selectedTube, tubes, history } = get();

    if (status !== 'playing') return;

    if (selectedTube === null) {
      // Selecting a tube to pour from
      if (tubes[index].length > 0) {
        set({ selectedTube: index });
      }
    } else {
      // Trying to pour from selectedTube to index
      if (selectedTube === index) {
        // Deselect
        set({ selectedTube: null });
        return;
      }

      const sourceTube = tubes[selectedTube];
      const targetTube = tubes[index];

      if (sourceTube.length === 0 || targetTube.length >= 4) {
        // Invalid: source empty or target full
        set({ selectedTube: null });
        return;
      }

      const topSourceColor = sourceTube[sourceTube.length - 1];
      
      // Check if target is empty or top color matches
      if (targetTube.length === 0 || targetTube[targetTube.length - 1] === topSourceColor) {
        // Valid move
        // Figure out how many blocks to move
        // Count contiguous matching colors in source
        let contiguousCount = 0;
        for (let i = sourceTube.length - 1; i >= 0; i--) {
          if (sourceTube[i] === topSourceColor) {
            contiguousCount++;
          } else {
            break;
          }
        }

        const spaceTarget = 4 - targetTube.length;
        const transferAmount = Math.min(contiguousCount, spaceTarget);

        if (transferAmount > 0) {
          // Perform transfer
          const newTubes = tubes.map(t => [...t]); // Deep enough clone for 2D array of primitives
          const transferred = newTubes[selectedTube].splice(-transferAmount, transferAmount);
          newTubes[index].push(...transferred);

          const win = checkWinCondition(newTubes);

          set({
            history: [...history, tubes.map(t => [...t])],
            tubes: newTubes,
            selectedTube: null,
            status: win ? 'won' : 'playing'
          });
          return;
        }
      }

      // Invalid move
      set({ selectedTube: null });
    }
  },

  undo: () => {
    const { history, status } = get();
    if (history.length > 0 && status === 'playing') {
      const newHistory = [...history];
      const previousState = newHistory.pop()!;
      set({ tubes: previousState, history: newHistory, selectedTube: null });
    }
  },

  restartLevel: () => {
    const { currentLevelIndex } = get();
    get().startLevel(currentLevelIndex);
  },

  nextLevel: () => {
    const { currentLevelIndex, levels } = get();
    if (currentLevelIndex < levels.length - 1) {
      get().startLevel(currentLevelIndex + 1);
    }
  }
}));
