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

//carev L Shape Room
function carveLShapeRoom(grid:Tile[][], room:Room):void{
    const ratio = 0.4 + Math.random()*0.4;
    const cornerX= Math.floor(room.width * ratio);
    const cornerY= Math.floor(room.height * ratio);


    //random number from 0-3
    const corner = Math.floor(Math.random() * 4);

    // do top left first for testing

    switch(corner){
        case 0:
            for(let i = room.y; i< room.y + room.height; i++){
                if(i < room.y + cornerY){
                    for(let j = room.x + cornerX; j < room.x + room.width; j++){
                        grid[i][j].type = TileType.Floor;
                    }
                }
                else{
                    for(let j = room.x; j < room.x + room.width; j++){
                        grid[i][j].type = TileType.Floor;
                    }
                }
            }
            break;
        case 1:
             // top right
            for(let i = room.y; i< room.y + room.height; i++){
                if(i < room.y + cornerY){
                    for(let j = room.x; j < room.x + room.width - cornerX; j++){
                        grid[i][j].type = TileType.Floor;
                    }
                }
                else{
                    for(let j = room.x; j < room.x + room.width; j++){
                        grid[i][j].type = TileType.Floor;
                    }
                }
            }
            break;

        case 2:
             //bot left
            for(let i = room.y; i< room.y + room.height; i++){
                if(i < room.y + cornerY){
                    for(let j = room.x; j < room.x + room.width; j++){
                        grid[i][j].type = TileType.Floor;
                    }
                    
                }
                else{
                    for(let j = room.x + cornerX; j < room.x + room.width; j++){
                        grid[i][j].type = TileType.Floor;
                    }
                }
            }
            break;

        case 3:
            // bot right
            for(let i = room.y; i< room.y + room.height; i++){
                if(i < room.y + cornerY){
                    for(let j = room.x; j < room.x + room.width; j++){
                        grid[i][j].type = TileType.Floor;
                    }
                }
                else{
                    for(let j = room.x; j < room.x + room.width - cornerX; j++){
                        grid[i][j].type = TileType.Floor;
                    }
                }
            }
            break;
    }

    
}   

export function carveCorridor(grid: Tile[][], roomA: Room, roomB: Room){
    //get center of two rooms
    //how about center of L shape room?
    const ax = Math.floor(roomA.x + roomA.width / 2);
    const ay = Math.floor(roomA.y + roomA.height / 2);
    const bx = Math.floor(roomB.x + roomB.width / 2);
    const by = Math.floor(roomB.y + roomB.height / 2);

    // Carve L-shape: horizontal then vertical
    for (let x = Math.min(ax, bx); x <= Math.max(ax, bx); x++) {
        if (grid[ay][x].type === TileType.Wall) {
            grid[ay][x].type = TileType.Floor;
        }
    }
    
    for (let y = Math.min(ay, by); y <= Math.max(ay, by); y++) {
        if (grid[y][bx].type === TileType.Wall) {
            grid[y][bx].type = TileType.Floor;
        }
    }

}

export function carveAllRooms(grid: Tile[][], rooms: Room[]): void {
    rooms.forEach(room => carveRoom(grid, room));
}