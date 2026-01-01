
import type { Tile } from './TileGrid';
import { carveCorridor } from './TileGrid';
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface Room {
  x: number;
  y: number;
  width :number;
  height: number;

  type: roomType;

}

export enum roomType{
  //L,
  Rec,
}

export function randomEnum<T>(enumObj: object): T {
    const values = Object.values(enumObj).filter(v => typeof v === 'number');
    return values[Math.floor(Math.random() * values.length)] as T;
}



export class BSPNode{
  private area: Rectangle ;
  private left: BSPNode | null;
  private right: BSPNode | null;
  private room: Room | null;
  
  // Constructor
  constructor(area: Rectangle){
    this.area = area;
    this.left = null;
    this.right = null;
    this.room = null;
  };
  
  // Methods
  //area split currently is not pixel perfect to the tile system
  split(depth: number, minSize: number): void{
    
     if (depth == 0 || this.area.width < minSize || this.area.height < minSize){

        this.room = this.createRoom(this.area.x, this.area.y);
        return;
     }

     const rand: number = Math.random();
     if(rand > 0.5){
        //split vertically
        //create two room horizontally
        // 0.3 0.4 0.5 
        const ratio = 0.3 + Math.random()*0.4;
        const splitX = this.area.x + Math.floor(this.area.width * ratio);
        const leftArea: Rectangle = {
            x : this.area.x,
            y : this.area.y,
            width: splitX - this.area.x,
            height: this.area.height
        } 

        const rightArea: Rectangle = {
            x : splitX,
            y : this.area.y,
            width: (this.area.x + this.area.width) - splitX,
            height: this.area.height
        } 

        this.left = new BSPNode(leftArea);
        this.right = new BSPNode(rightArea);
     }
     else
     {
        //split horizontally
        const ratio = 0.3 + Math.random()*0.4;
        //const splitX = this.area.x + this.area.width * ratio;
        const splitY = this.area.y + Math.floor(this.area.height * ratio);
        const topArea: Rectangle = {
            x : this.area.x,
            y : this.area.y,
            width: this.area.width,
            height: splitY - this.area.y
        } 

        const botArea: Rectangle = {
            x : this.area.x,
            y : splitY,
            width: this.area.width,
            height: (this.area.y + this.area.height) - splitY
        } 

        this.left = new BSPNode(topArea);
        this.right = new BSPNode(botArea);
     }
    depth--;
    this.left.split(depth, minSize);

    this.right.split(depth, minSize);


  };
  createRoom(xPos:number, yPos:number): Room{

    const padding = 1;  // tiles of wall/corridor space
    //const minRoomSize = 4;
  
    const maxWidth = this.area.width - padding * 2;
    const maxHeight = this.area.height - padding * 2;

    const minRoomSize = 3;
    


    // const w_ratio = 0.2 + Math.random() * 0.6;
    // const h_ratio = 0.2 + Math.random() * 0.6;
    // const x = Math.floor(w_ratio  * (xPos + this.area.width))
    // const y = Math.floor(h_ratio * (yPos + this.area.height))

    //const r_width = Math.floor((0.2 + Math.random()* 0.9) * (maxWidth - xPos));
    //const r_height = Math.floor((0.2 + Math.random()* 0.9) * (maxHeight - yPos));

    const r_width = minRoomSize + Math.floor(Math.random() * (maxWidth - minRoomSize + 1));
    const r_height = minRoomSize + Math.floor(Math.random() * (maxHeight - minRoomSize + 1));

    const newX = xPos + Math.floor(Math.random() * (this.area.width - r_width))
    const newY = yPos + Math.floor(Math.random() * (this.area.height - r_height))
    //
    //draw it on screen
    const room:Room = {
        x: newX,
        y: newY,
        width:r_width,
        height:r_height,
        type: roomType.Rec//randomEnum(roomType)
    }
    return room;
  };

  getAllRooms(): Room[]{
    if (this.room !== null) {
      return [this.room]
    }

    const rooms: Room[] = [];
    if(this.left !== null){
      rooms.push(...this.left.getAllRooms());
    }
    if(this.right !== null){
      rooms.push(...this.right.getAllRooms());
    }

    return rooms;
  };

  getAllAreas(): Rectangle[]{
    //temperaily 
    const areas: Rectangle[] = [this.area]
    //const areas: Rectangle[] = [];
    
    if(this.left !== null){
      areas.push(...this.left.getAllAreas());
    }
    if(this.right !== null){
      areas.push(...this.right.getAllAreas());
    }

    return areas;
  };

  
  connectRooms(grid: Tile[][]): void {
      // Only proceed if this node was split
      if (this.left && this.right) {
          // First, let children connect their subtrees
          this.left.connectRooms(grid);
          this.right.connectRooms(grid);
          
          // Then connect left subtree to right subtree
          const leftRoom = this.left.getAnyRoom();
          const rightRoom = this.right.getAnyRoom();
          
          if (leftRoom && rightRoom) {
              carveCorridor(grid, leftRoom, rightRoom);
          }
      }
}

// Get any room from this subtree (for corridor connection)
  getAnyRoom(): Room | null {
      if (this.room) return this.room;
      
      // Prefer left, fallback to right
      if (this.left) return this.left.getAnyRoom();
      if (this.right) return this.right.getAnyRoom();
      
      return null;
  }
  
}