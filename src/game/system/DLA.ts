
import type { Room } from "./DungeonGenerator";
import { TileType, type Tile } from "./TileGrid";

export function dla(map: Tile[][], room: Room) {
    let builderSpawned = 0;
    let builderMoveDirection = 0;
    let allocatedBlocks = 0;
    let stepped = 0;
    
    const targetBlocks = Math.floor((room.width * room.height) / 8);
    const rootX = Math.floor(room.x + room.width / 2);
    const rootY = Math.floor(room.y + room.height / 2);
    
    let cx = 0, cy = 0;
    
    // Safety limit to prevent infinite loop
    let maxIterations = 50000;
    let iterations = 0;

    while (allocatedBlocks < 3){ //&& iterations < maxIterations) {
        iterations++;
        
        if (builderSpawned != 1) {
            // Spawn at random position within room
            cx = room.x + 2 + Math.floor(Math.random() * (room.width - 4));
            cy = room.y + 2 + Math.floor(Math.random() * (room.height - 4));
            
            // See if builder is on top of root
            if (Math.abs(rootX - cx) <= 0 && Math.abs(rootY - cy) <= 0) {
                // Builder spawned at root, place floor and respawn
                if (map[cy][cx].type !== TileType.Floor) {
                    map[cy][cx].type = TileType.Floor;
                    allocatedBlocks++;
                }
            } else {
                builderSpawned = 1;
                builderMoveDirection = Math.floor(Math.random() * 4);
                stepped = 0;
            }
        } else {
            // Walk the builder
            if (builderMoveDirection == 0 && cy > room.y) {
                cy--; stepped++;  // North
            } else if (builderMoveDirection == 1 && cx < room.x + room.width - 1) {
                cx++; stepped++;  // East
            } else if (builderMoveDirection == 2 && cy < room.y + room.height - 1) {
                cy++; stepped++;  // South
            } else if (builderMoveDirection == 3 && cx > room.x) {
                cx--; stepped++;  // West - FIXED: was cx++
            }
            
            // Check bounds and step limit
            const inBounds = cx < room.x + room.width - 1 && 
                            cy < room.y + room.height - 1 && 
                            cx > room.x + 1 && 
                            cy > room.y + 1;
            
            if (inBounds && stepped <= 5) {
                // Check if adjacent to existing floor (aggregation)
                if (map[cy][cx + 1].type === TileType.Floor) {
                    if (map[cy][cx].type !== TileType.Floor) {
                        map[cy][cx].type = TileType.Floor;
                        allocatedBlocks++;
                    }
                    builderSpawned = 0;
                } else if (map[cy][cx - 1].type === TileType.Floor) {
                    if (map[cy][cx].type !== TileType.Floor) {
                        map[cy][cx].type = TileType.Floor;
                        allocatedBlocks++;
                    }
                    builderSpawned = 0;
                } else if (map[cy + 1][cx].type === TileType.Floor) {
                    if (map[cy][cx].type !== TileType.Floor) {
                        map[cy][cx].type = TileType.Floor;
                        allocatedBlocks++;
                    }
                    builderSpawned = 0;
                } else if (map[cy - 1][cx].type === TileType.Floor) {
                    if (map[cy][cx].type !== TileType.Floor) {
                        map[cy][cx].type = TileType.Floor;
                        allocatedBlocks++;
                    }
                    builderSpawned = 0;
                }
            } else {
                // Out of bounds or walked too far, respawn
                builderSpawned = 0;
            }
        }
    }
    
    if (iterations >= maxIterations) {
        console.log("DLA hit max iterations");
    }
}

export function expandRoom(map: Tile[][], room: Room, targetBlocks: number) {
    let allocatedBlocks = 0;
    let maxIterations = 50000;
    let iterations = 0;
    
    while (allocatedBlocks < targetBlocks && iterations < maxIterations) {
        iterations++;
        
        // Find a random floor tile to start from
        const floorTiles: {x: number, y: number}[] = [];
        for (let y = room.y; y < room.y + room.height; y++) {
            for (let x = room.x; x < room.x + room.width; x++) {
                if (map[y][x].type === TileType.Floor) {
                    floorTiles.push({x, y});
                }
            }
        }
        
        if (floorTiles.length === 0) break;
        
        // Pick random floor tile as starting point
        const start = floorTiles[Math.floor(Math.random() * floorTiles.length)];
        let cx = start.x;
        let cy = start.y;
        
        // Pick random direction
        const direction = Math.floor(Math.random() * 4);
        
        // Walk until we hit a wall
        let steps = 0;
        const maxSteps = 20;
        
        while (steps < maxSteps) {
            steps++;
            
            // Move in direction
            let nx = cx, ny = cy;
            if (direction === 0) ny--;      // North
            else if (direction === 1) nx++; // East
            else if (direction === 2) ny++; // South
            else if (direction === 3) nx--; // West
            
            // Check bounds
            if (ny < 1 || ny >= map.length - 1 || nx < 1 || nx >= map[0].length - 1) {
                break;
            }
            
            // If next tile is wall, convert it and done
            if (map[ny][nx].type === TileType.Wall) {
                map[ny][nx].type = TileType.Floor;
                allocatedBlocks++;
                break;
            }
            
            // Otherwise keep walking
            cx = nx;
            cy = ny;
        }
    }
    
    console.log("Expansion finished. Blocks added:", allocatedBlocks);
}

// TypeScript equivalent
export function dlaExpand(map: Tile[][], iterations: number) {
    for (let i = 0; i < iterations; i++) {
        // Get all floor tiles
        const floorTiles: {x: number, y: number}[] = [];
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[0].length; x++) {
                if (map[y][x].type === TileType.Floor) {
                    floorTiles.push({x, y});
                }
            }
        }
        
        if (floorTiles.length === 0) break;
        
        // Pick random floor tile
        let digger = floorTiles[Math.floor(Math.random() * floorTiles.length)];
        
        // Walk while on floor
        while (map[digger.y][digger.x].type === TileType.Floor) {
            const dir = Math.floor(Math.random() * 4);
            if (dir === 0 && digger.y > 1) digger.y--;
            else if (dir === 1 && digger.x < map[0].length - 2) digger.x++;
            else if (dir === 2 && digger.y < map.length - 2) digger.y++;
            else if (dir === 3 && digger.x > 1) digger.x--;
        }
        
        // Convert wall to floor
        map[digger.y][digger.x].type = TileType.Floor;
    }
}