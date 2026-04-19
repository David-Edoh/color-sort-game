export type LevelType = {
  id: number;
  tubes: string[][];
};

const levels: LevelType[] = [
  {
    id: 1,
    tubes: [
      ['red', 'blue', 'red', 'blue'],
      ['blue', 'red', 'blue', 'red'],
      []
    ]
  },
  {
    id: 2,
    tubes: [
      ['#FF5733', '#33FF57', '#FF5733', '#3357FF'],
      ['#3357FF', '#33FF57', '#33FF57', '#FF5733'],
      ['#3357FF', '#FF5733', '#3357FF', '#33FF57'],
      [],
      []
    ]
  },
  {
    id: 3,
    tubes: [
      ['pink', 'yellow', 'purple', 'pink'],
      ['purple', 'pink', 'yellow', 'purple'],
      ['yellow', 'purple', 'pink', 'yellow'],
      [],
      []
    ]
  },
  { // Level 4
    id: 4,
    tubes: [
      ['cyan', 'magenta', 'lime', 'magenta'],
      ['lime', 'cyan', 'lime', 'cyan'],
      ['magenta', 'lime', 'cyan', 'magenta'],
      [],
      []
    ]
  },
  { // Level 5
    id: 5,
    tubes: [
      ['orange', 'teal', 'navy', 'orange'],
      ['navy', 'orange', 'teal', 'navy'],
      ['teal', 'navy', 'orange', 'teal'],
      ['brown', 'brown', 'brown', 'brown'], // mostly sorted distractor
      [],
      []
    ]
  },
  { // Level 6
    id: 6,
    tubes: [
      ['red', 'green', 'blue', 'yellow'],
      ['blue', 'red', 'yellow', 'green'],
      ['yellow', 'blue', 'green', 'red'],
      ['green', 'yellow', 'red', 'blue'],
      [],
      []
    ]
  },
  { // Level 7
    id: 7,
    tubes: [
      ['#ff0055', '#00ffaa', '#ffaa00', '#0055ff'],
      ['#0055ff', '#ff0055', '#bb00ff', '#00ffaa'],
      ['#ffaa00', '#bb00ff', '#ff0055', '#bb00ff'],
      ['#00ffaa', '#0055ff', '#ffaa00', '#00ffaa'],
      ['#bb00ff', '#ffaa00', '#0055ff', '#ff0055'],
      [],
      []
    ]
  },
  { // Level 8
    id: 8,
    tubes: [
      ['darkred', 'darkblue', 'darkgreen', 'gold'],
      ['gold', 'darkred', 'darkblue', 'darkgreen'],
      ['darkgreen', 'gold', 'darkred', 'darkblue'],
      ['darkblue', 'darkgreen', 'gold', 'darkred'],
      ['hotpink', 'hotpink', 'teal', 'teal'],
      ['teal', 'teal', 'hotpink', 'hotpink'],
      [],
      []
    ]
  }
];

export default levels;
