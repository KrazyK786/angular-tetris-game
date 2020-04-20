import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { COLS, BLOCK_SIZE, ROWS } from "../constants";
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

  constructor(
      private gameService: GameService
  ) { }

  ngOnInit(): void {
    this.initBoard();
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
