import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {BLOCK_SIZE, COLORS, COLS, KEY, ROWS, POINTS, LEVEL, LINES_PER_LEVEL} from "../constants";
import {GameService} from "../services/game.service";
import {IPiece, Piece} from "../Piece";

@Component({
  selector: 'game-board',
  templateUrl: 'board.component.html',
  styles: [
  ]
})
export class BoardComponent implements OnInit {
  // Get reference to canvas
  @ViewChild('board', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  
  ctx: CanvasRenderingContext2D;
  points: number;
  lines: number;
  level: number;
  board: number[][];
  piece: Piece;
  requestId: number;
  highScore: number;
  paused: boolean;
  gameStarted: boolean;
  // time: Time;
  time: {
    start: number;
    elapsed: number;
    level: number
  };
  moves = {
    [KEY.LEFT]: (p: IPiece): IPiece => ({ ...p, x: p.x - 1 }),
    [KEY.RIGHT]: (p: IPiece): IPiece => ({ ...p, x: p.x + 1 }),
    [KEY.DOWN]: (p: IPiece): IPiece => ({ ...p, y: p.y + 1 }),
    [KEY.SPACE]: (p: IPiece): IPiece => ({ ...p, y: p.y + 1 }),
    [KEY.UP]: (p: IPiece): IPiece => this.gameService.rotate(p)
  }
  
  @HostListener('window: keydown', ['$event'])
  keyEvent(event: KeyboardEvent){
    
    //event.keyCode is deprecated
    if (this.moves[event.code]){
      // If the key exists in our moves stop the event from bubbling
      event.preventDefault();
      // Get the next state of the piece
      let p = this.moves[event.code](this.piece);

      // console.log('p: ');
      // console.log(p);
      // console.log('this');
      // console.log(this.piece);

      // Hard drop
      if (event.code === KEY.SPACE){
        while (this.gameService.valid(p, this.board)){
          this.points += POINTS.HARD_DROP; // Points for every drop
          this.piece.move(p);
          p = this.moves[event.code](this.piece);
        }
      }
      
      // else if (event.code === KEY.UP){
      //   if (this.gameService.valid(p, this.board)){
      //     this.piece.move(p);
      //   }
      // }
      
      else if (this.gameService.valid(p, this.board)){
        // Move the piece
        this.piece.move(p);
        if (event.code === KEY.DOWN){
          this.points += POINTS.SOFT_DROP; // Points if we move down
        }
      }
      
      // Clear the old position before drawing
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      
      // Draw the new position
      this.piece.draw();
    }
  }

  constructor(
      private gameService: GameService
  ) { }

  ngOnInit(): void {
    this.initBoard();
    // this.initNext();
    this.resetGame();
    this.highScore = 0;
    
    // Scale so we don't need to give size on every draw
    this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
  }
  
  initBoard() {
    // Get the 2D context that we draw on
    this.ctx = this.canvas.nativeElement.getContext('2d');
    
    // Calculate size of canvas from constants.
    this.ctx.canvas.width = COLS * BLOCK_SIZE;
    this.ctx.canvas.height = ROWS * BLOCK_SIZE;
  }
  
  drawBoard(): void{
    this.board.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0){
          this.ctx.fillStyle = COLORS[value];
          this.ctx.fillRect(x, y, 1, 1);
          // this.add3D(x, y, value);
        }
      });
    });
    // this.addOutlines();
  }
  
  drawPiece(): void{
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.piece.draw();
    this.drawBoard();
    
  }
  
  play(){
    this.gameStarted = true;
    this.resetGame();
    // this.next = new Piece(this.ctx);
    this.piece = new Piece(this.ctx);
    // this.next.drawNext(this.ctxNext);
    
    // console.table(this.board);
    
    // set current time
    this.time.start = performance.now();
    
    // If we have an old game running a game, then cancel the old
    if (this.requestId){
      cancelAnimationFrame(this.requestId);
    }
    
    this.animate();
  }
  
  animate(now = 0): void {
    // Update elapsed time
    this.time.elapsed = now - this.time.start;
    
    // If elapsed time has passed time for current level
    if (this.time.elapsed > this.time.level) {
      // Reset start time
      this.time.start = now;
      this. drop();
      // if (!this.drop()) {
      //   this.gameOver();
      //   return;
      // }
    }
    this.drawPiece();
    this.requestId = requestAnimationFrame(this.animate.bind(this));
  }
  
  drop(): void {
    // set p as if down key was pressed
    let p = this.moves[KEY.DOWN](this.piece);
  
    if (this.gameService.valid(p, this.board)){
      // Move the piece
      this.piece.move(p);
    }
    
    
    else {
      // add piece to gameboard to lock it in
      this.freeze();
      
      //
      this.clearLines();
    //   if (this.piece.y === 0){
    //     // Game over
    //     return false;
    //   }
      this.piece = new Piece(this.ctx);
    //   this.piece = this.next;
    //   this.next = new Piece(this.ctx);
    //   this.next.drawNext(this.ctxNext);
    }
    // return true;
  }
  
  freeze(): void{
    this.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0){
          this.board[y + this.piece.y][x + this.piece.x] = value;
        }
      });
    });
  }
  
  clearLines(): void {
    let lines = 0;
    this.board.forEach((row, y) => {
  
      // If every value is greater than 0
      if (row.every(value => value !== 0)) {
        lines++;
  
        // Remove the row
        this.board.splice(y, 1);
  
        // Add a zero filled array at the top, causing the board to 'move down'
        this.board.unshift(Array(COLS).fill(0));
      }
    });
    
    if (lines > 0) {
      // Calculate points form cleared lines and level
      this.points += this.gameService.getLinesClearedPoints(lines, this.level);
      this.lines += lines;
      
      // If we have reached the lines per level
      if (this.lines >= LINES_PER_LEVEL) {
        
        // Goto next level
        this.level++;
        
        // Remove lines so we start working for the next level
        this.lines -= LINES_PER_LEVEL;
        
        // Increase speed of game
        this.time.level = LEVEL[this.level];
      }
    }
  }
  
  // Initialize game
  resetGame(): void {
      this.points = 0;
      this.lines = 0;
      this.level = 0;
      this.board = this.gameService.getEmptyBoard();
      this.time = { start: 0, elapsed: 0, level: LEVEL[this.level] };
      this.paused = false;
      // this.addOutlines();
    }
  
  // getEmptyBoard(): number[][] {
  //   return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  // }
}
