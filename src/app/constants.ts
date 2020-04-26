export const COLS = 10;
export const ROWS = 20;
export const BLOCK_SIZE = 30;

export const COLORS = [
    'cyan',
    'blue',
    'orange',
    'yellow',
    'green',
    'purple',
    'red'
];

export const SHAPES = [
    // [],
    [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[2, 0, 0], [2, 2, 2], [0, 0, 0]],
    [[0, 0, 3], [3, 3, 3], [0, 0, 0]],
    [[4, 4], [4, 4]],
    [[0, 5, 5], [5, 5, 0], [0, 0, 0]],
    [[0, 6, 0], [6, 6, 6], [0, 0, 0]],
    [[7, 7, 0], [0, 7, 7], [0, 0, 0]]
]

// map keys to key codes
export class KEY {
    static readonly ESC = 'Escape';
    static readonly SPACE = 'Space';
    static readonly LEFT = 'ArrowLeft';
    static readonly UP = 'ArrowUp';
    static readonly RIGHT = 'ArrowRight';
    static readonly DOWN = 'ArrowDown';
    
    // Prevoius key codes- deprecated
    // static readonly ESC = 27;
    // static readonly SPACE = 32;
    // static readonly LEFT = 37;
    // static readonly UP = 38;
    // static readonly RIGHT = 39;
    // static readonly DOWN = 40;
}

// time workaround?
export class Time {
    start = 0;
    elapsed = 0;
    level = 0;
    // start: number;
    // elapsed: number;
    // level: number
};
