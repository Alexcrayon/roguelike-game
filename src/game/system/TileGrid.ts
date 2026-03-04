import type { Room } from './DungeonGenerator';
import {clamp} from './Utilities';

export const TILE_SIZE = 16;

export enum TileType {
    Wall,
    Floor,
    Corridor,
}

export interface Tile {
    type: TileType;
}

//export type Tile[][] ;

export function createGrid(width: number, height: number): Tile[][] {
    // ...
    var grid:Tile[][] = [];

    for(let i:number = 0; i< height; i++){
        const row : Tile[] = [];
         
         for(let j: number = 0; j<width; j++){
            row.push({type: TileType.Wall})
         }
        grid.push(row)
    }
    //console.log(grid);
    return grid;
}

export function carveRoom(grid: Tile[][], room: Room): void {
    // ...
    //carve the room area to floor
    //room is in pixel coordinate
    //room split is not tile perfect


    switch(room.type){
        // case 0:
        //     carveLShapeRoom(grid, room);
        //     break;
        case 0:
            const startY = Math.floor(room.y);
            const endY = Math.floor((room.y + room.height) );
            const startX = Math.floor(room.x );
            const endX = Math.floor((room.x + room.width) );

            for(let i = startY; i < endY; i++){
                for(let j = startX; j < endX; j++){
                    grid[i][j].type = TileType.Floor;
                }
            }
            break;
    }
}

export function carveCorridor(grid: Tile[][], roomA: Room, roomB: Room){
    //get center of two rooms
    const roomACenter = getCenterWithOffset(roomA);
    const roomBCenter = getCenterWithOffset(roomB);
    
    const width = grid[0].length;
    const height = grid.length;
    
    const ax = clamp(roomACenter[0], 0, width-1);
    const ay = clamp(roomACenter[1], 0, height-1);
    const bx = clamp(roomBCenter[0], 0, width-1);
    const by = clamp(roomBCenter[1], 0, height-1);
    //console.log([grid.length, grid[0].length]);


    if(ay >= grid.length || ax >= grid[0].length 
        || by >= grid.length || bx >= grid[0].length
    ){
        console.log("room center is out of boundary of grid");
    }
    // Carve L-shape: horizontal then vertical
    // could be out of bound of grid
    for (let x = Math.min(ax, bx); x <= Math.max(ax, bx); x++) {
        if (grid[ay][x].type === TileType.Wall) {
            grid[ay][x].type = TileType.Corridor;
        }
    }
    
    for (let y = Math.min(ay, by); y <= Math.max(ay, by); y++) {
        if (grid[y][bx].type === TileType.Wall) {
            grid[y][bx].type = TileType.Corridor;
        }
    }
    
}

function getCenterWithOffset(room : Room): number[] {
    //room.width

    const offset_w = findOffsetRange(room.width);
    const offset_h = findOffsetRange(room.height);

    const randIndx = Math.floor(Math.random() * offset_w.length);
    const randIndx2 = Math.floor(Math.random() * offset_h.length);

    const x = Math.floor(room.x + room.width / 2) + offset_w[randIndx];
    const y = Math.floor(room.y + room.height / 2) + offset_h[randIndx2];

    return [x,y];
}

function findOffsetRange(size:number): number[]{
    let range = [];
    for(let i = -Math.floor(size/2); i<0; i++){
        range.push(i);
    }
    for(let i = 0; i < Math.floor(size/2); i++){
        range.push(i);
    }
    return range;
}
export function carveAllRooms(grid: Tile[][], rooms: Room[]): void {
    rooms.forEach(room => carveRoom(grid, room));
}