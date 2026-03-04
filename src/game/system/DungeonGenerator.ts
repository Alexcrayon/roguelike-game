import type { Tile } from './TileGrid';
import { carveCorridor } from './TileGrid';
import { clamp, mulberry32 } from './Utilities';
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
  private rand: ()=>number;
  //private seed:number;

  //constructor(area: Rectangle);
  constructor(area: Rectangle, rand?: ()=>number);

  // Constructor
  constructor(area: Rectangle, rand?: ()=>number){
    this.area = area;
    this.left = null;
    this.right = null;
    this.room = null;

    this.rand = rand ?? mulberry32(Date.now());
    // if (seed !== undefined) {
    //   this.rand = mulberry32(seed);
    //   //this.seed = seed;
    // }
  }

  
  //bsp spliting 
  split(depth: number, minSize: number): void{

     if (depth == 0 || this.area.width < minSize || this.area.height < minSize){

        this.room = this.createRoom(this.area.x, this.area.y);
        return;
     }

     const rand: number = this.rand();
     if(rand > 0.5){
        //split vertically
        //create two room horizontally
        // 0.3 0.4 0.5 
        const ratio = 0.3 + this.rand() *0.4;
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
        this.left = new BSPNode(leftArea, this.rand);
        this.right = new BSPNode(rightArea, this.rand);
     }
     else
     {
        //split horizontally
        const ratio = 0.3 + this.rand()*0.4;
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

        this.left = new BSPNode(topArea, this.rand);
        this.right = new BSPNode(botArea, this.rand);
     }
    depth--;
    this.left.split(depth, minSize);

    this.right.split(depth, minSize);

  };

  createRoom(xPos:number, yPos:number): Room{
    const padding = 1;
    const minRoomSize = 4;
    const maxAspectRatio = 3;
    
    const validMaxWidth = this.area.width - padding * 2;
    const validMaxHeight = this.area.height - padding * 2;
    
    // Actual min can't exceed max
    const minW = Math.min(minRoomSize, validMaxWidth);
    const minH = Math.min(minRoomSize, validMaxHeight);
    
    // Generate random size directly in valid range (minW to validMaxWidth)
    let r_width = minW + Math.floor(this.rand()* (validMaxWidth - minW + 1));
    let r_height = minH + Math.floor(this.rand() * (validMaxHeight - minH + 1));
    
    // Enforce aspect ratio (shrink the larger dimension)
    const currentRatio = r_width / r_height;
    if (currentRatio > maxAspectRatio) {
        // Too wide, shrink width
        r_width = Math.floor(r_height * maxAspectRatio);
        r_width = Math.max(minW, r_width);  // Don't go below min
    } else if (currentRatio < 1 / maxAspectRatio) {
        // Too tall, shrink height
        r_height = Math.floor(r_width * maxAspectRatio);
        r_height = Math.max(minH, r_height);  // Don't go below min
    }
    
    // Calculate position
    const availableX = Math.max(0, validMaxWidth - r_width);
    const availableY = Math.max(0, validMaxHeight - r_height);
    
    const newX = this.area.x + padding + Math.floor(this.rand() * (availableX + 1));
    const newY = this.area.y + padding + Math.floor(this.rand() * (availableY + 1));
    
    return {
        x: newX,
        y: newY,
        width: r_width,
        height: r_height,
        type: roomType.Rec
    };
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
  connectRoomsSortedX(grid: Tile[][], rooms: Room[]): void {
    // Sort by x position
    const sorted = [...rooms].sort((a, b) => a.x - b.x);
    //add sort by y also

    // Connect each room to the previous
    for (let i = 0; i < sorted.length-1; i++) {
        carveCorridor(grid, sorted[i], sorted[i+1]);
    }
  }

   //sort the room by x first then connect one by one
  connectRoomsSortedY(grid: Tile[][], rooms: Room[]): void {
    // Sort by y position
    const sorted = [...rooms].sort((a, b) => a.y - b.y);

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