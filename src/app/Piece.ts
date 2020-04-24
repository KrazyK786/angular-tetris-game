import {BLOCK_SIZE, COLORS, SHAPES} from "./constants";

export interface IPiece {
    x: number;
    y: number;
    color: string;
    shape: number[][];
}

export class Piece implements IPiece {
    x: number;
    y: number;
    color: string;
    shape: number[][];
    colorDarker: string;
    colorLighter: string;
    
    constructor(
        private ctx: CanvasRenderingContext2D
    ) {
        this.spawn();
    }
    
    spawn(): void{
        // const typeId: number = this.randomizeTetrominoType(COLORS.length);
        const colorId: number = this.randomizeTetrominoType(COLORS.length);
        const shapeId: number = this.randomizeTetrominoType(SHAPES.length);
        this.color = COLORS[colorId];
        this.shape = SHAPES[shapeId]; //[[2, 0, 0], [2, 2, 2], [0, 0, 0]];
        
        // Position where the shape spawns
        this.x = 3;
        this.y = 0;
    }
    
    draw(): void{
        // removed scaling- was re-scaling on every draw..? :( (making the pieces bigger and bigger)
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0){
                    this.ctx.fillStyle = this.color;
                    const currentX = this.x + x;
                    const currentY = this.y + y;
                    this.ctx.fillRect(currentX, currentY, 1, 1);
                    // this.add3D(this.ctx, currentX, currentY);
                }
            })
        })
    }
    
    
    private add3D(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        // Darker Color
        ctx.fillStyle = this.colorDarker;
        
        // Vertical
        ctx.fillRect(x + .9, y, .1, 1);
        
        // Horizontal
        ctx.fillRect(x, y + .9, 1, .1);
    
        //Darker Color - Inner
        // Vertical
        ctx.fillRect(x + .65, y + .3, .05, .3);
        
        // Horizontal
        ctx.fillRect(x + .3, y + .6, .4, .05);
    
        // Lighter Color - Outer
        ctx.fillStyle = this.colorLighter;
    
        // Lighter Color - Inner
        // Vertical
        ctx.fillRect(x + .3, y + .3, .05, .3);
        
        // Horizontal
        ctx.fillRect(x + .3, y + .3, .4, .05);
    
        // Lighter Color - Outer
        // Vertical
        ctx.fillRect(x, y, .05, 1);
        ctx.fillRect(x, y, .1, .95);
        
        // Horizontal
        ctx.fillRect(x, y, 1 , .05);
        ctx.fillRect(x, y, .95, .1);
    }
    
    move(p: IPiece): void{
        this.x = p.x;
        this.y = p.y;
        this.shape = p.shape;
    }
    
    randomizeTetrominoType(noOfTypes: number): number{
        // return Math.floor(Math.random() * noOfTypes + 1);
        return Math.floor(Math.random() * Math.floor(noOfTypes));
    }
}
