
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
  
  //bsp spliting 
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

    const padding = 1;
    const minRoomSize = 2;
    
    // Valid room placement area
    const validMinX = xPos + padding;
    const validMinY = yPos + padding;
    const validMaxWidth = this.area.width - padding * 2;
    const validMaxHeight = this.area.height - padding * 2;
    
    // Random room size within valid area
    let r_width = Math.floor(Math.random() * validMaxWidth);
    let r_height = Math.floor(Math.random() * validMaxHeight);
    r_width = Math.max(minRoomSize, r_width);
    r_height = Math.max(minRoomSize, r_height);
    
    // Random position - room must fit entirely within valid area
    const availableX = validMaxWidth - r_width;
    const availableY = validMaxHeight - r_height;
    
    const newX = validMinX + Math.floor(Math.random() * (availableX + 1));
    const newY = validMinY + Math.floor(Math.random() * (availableY + 1));

    // if(newX + r_width >= this.area.x + this.area.width - 1){
    //   console.log("room is touching right bound");
    // }
    // if(newY + r_height >= this.area.y + this.area.height - 1){
    //   console.log("room is touching bot bound");
    // }

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

  //connect sibiling nodes
  connectRooms(grid: Tile[][]): void {
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

  //sort the room by x first then connect one by one
  connectRoomsSorted(grid: Tile[][], rooms: Room[]): void {
    // Sort by x position
    const sorted = [...rooms].sort((a, b) => a.x - b.x);
    
    // Connect each room to the previous
    for (let i = 0; i < sorted.length-1; i++) {
        carveCorridor(grid, sorted[i], sorted[i+1]);
    }
}

// Get any room from this subtree
  getAnyRoom(): Room | null {
      if (this.room) 
        return this.room;
      
      // left to right
      if (this.left) 
        return this.left.getAnyRoom();
      if (this.right) 
        return this.right.getAnyRoom();
      
      return null;
  }
  
}