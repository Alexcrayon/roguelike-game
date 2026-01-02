
import type { Room } from "./DungeonGenerator";
import type { Tile } from "./TileGrid";

export function dla(map:Tile[][], room: Room){
    var builderSpawned=0
    var builderMoveDirection=0;
    var allocatedBlocks=0 //variable used to track the percentage of the map filled
    var rootX= Math.floor((room.x+room.width)/2);
    var rootY= Math.floor((room.y+room.height)/2);; //this is where the growth starts from. Currently center of map
    var stepped=0;



    
}