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
    return grid;
}

export function carveRoom(grid: Tile[][], room: Room): void {
    // ...
    //carve the room area to floor
    for(let i = room.y; i < room.height; i++){
        for(let j = room.x; j<room.width; j++){
            grid[i][j].type = TileType.Floor;
        }
    }
}

export function carveAllRooms(grid: Tile[][], rooms: Room[]): void {
    rooms.forEach(room => carveRoom(grid, room));
}