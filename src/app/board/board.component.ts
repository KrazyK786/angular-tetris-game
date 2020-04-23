import {Component, OnInit, ViewChild, ElementRef, HostListener} from '@angular/core';
import {COLS, BLOCK_SIZE, ROWS, KEY} from "../constants";
import { GameService } from "../services/game.service";
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
  
  play(){
    this.board = this.gameService.getEmptyBoard();
    // console.table(this.board);
    this.piece = new Piece(this.ctx);
    this.piece.draw();
  }
  
}
