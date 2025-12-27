import type { Room } from './DungeonGenerator';

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
    console.log(grid);
    return grid;
}

export function carveRoom(grid: Tile[][], room: Room): void {
    // ...
    //carve the room area to floor
    //room is in pixel coordinate
    //room split is not tile perfect
    const startY = Math.floor(room.y / TILE_SIZE);
    const endY = Math.floor((room.y + room.height) / TILE_SIZE);
    const startX = Math.floor(room.x / TILE_SIZE);
    const endX = Math.floor((room.x + room.width) / TILE_SIZE);

    for(let i = startY; i < endY; i++){
        for(let j = startX; j < endX; j++){
            grid[i][j].type = TileType.Floor;
        }
    }
}

export function carveAllRooms(grid: Tile[][], rooms: Room[]): void {
    rooms.forEach(room => carveRoom(grid, room));
}