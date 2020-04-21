import { Injectable } from '@angular/core';
import { COLS, ROWS } from "../constants";
import { IPiece } from '../Piece';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor() { }
  
  getEmptyBoard(): number[][]{
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  valid(p: IPiece): boolean{
    return p.shape.every((row, y) => {
      return row.every((value, x) => {
        return value === 0 ||  // Empty cell
        (p.x + x >= 0 && // Left wall
          p.x + x < COLS && // Right wall
          p.y + y < ROWS) // Bottom wall -originally '<=' but was going through floor?
      });
    });
  }
}
