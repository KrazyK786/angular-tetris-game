import { Injectable } from '@angular/core';
import {COLS, POINTS, ROWS} from "../constants";
import { IPiece } from '../Piece';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor() { }
  
  getEmptyBoard(): number[][]{
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  valid(p: IPiece, board: number[][]): boolean{
    return p.shape.every((row, dy) => {
      return row.every((value, dx) => {
        let x = p.x + dx;
        let y = p.y + dy;
        return (
          this.isEmpty(value) ||
        (this.insideWalls(x) && 
        this.aboveFloor(y) &&
        this.notOccupied(board, x, y))
        );
        // return value === 0 ||  // Empty cell
        // (p.x + x >= 0 && // Left wall
        //   p.x + x < COLS && // Right wall
        //   p.y + y < ROWS) // Bottom wall -originally '<=' but was going through floor?
      });
    });
  }
  
  notOccupied(board: number[][], x: number, y: number): boolean {
    return board[y] && board[y][x] === 0;
  }

  aboveFloor(y: number): boolean {
    return y <= ROWS;
  }

  insideWalls(x: number): boolean {
    return x >= 0 && x < COLS;
  }

  isEmpty(value: number): boolean {
    return value === 0;
  }
  
  rotate(piece: IPiece): IPiece {
    // Clone piece using JSON
    let p: IPiece = JSON.parse(JSON.stringify(piece));
    
    // Transpose matrix
    for (let y = 0; y < p.shape.length; ++y){
      for (let x = 0; x < y; ++x){
        [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
      }
    }
    
    // Reverse order of the columns
    p.shape.forEach(row => row.reverse());
    
    // Return clone
    return p;
  }
  
  getLinesClearedPoints(lines: number, level: number): number {
    const lineClearPoints =
        lines === 1
            ? POINTS.SINGLE
            : lines === 2
            ? POINTS.DOUBLE
            : lines === 3
                ? POINTS.TRIPLE
                : lines === 4
                    ? POINTS.TETRIS
                    : 0;
  
    return (level + 1) * lineClearPoints;
  }
}
