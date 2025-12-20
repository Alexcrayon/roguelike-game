
interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}
interface Room {
    x: number;
    y: number;
    width :number;
    height: number;

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
  split(depth: number, minSize: number): void{
    
     if (depth == 0 || this.area.width < minSize || this.area.height < minSize){

        this.room = this.createRoom();
        return;
     }

     const rand: number = Math.random();
     if(rand > 0.5){
        //split vertically
        //create two room horizontally
        const splitX = this.area.x + this.area.width / 2;
        const leftArea: Rectangle = {
            x : this.area.x,
            y : this.area.y,
            width: splitX - this.area.x,
            height: this.area.height
        } 

        const rightArea: Rectangle = {
            x : this.area.x,
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
        const splitY = this.area.y + this.area.height / 2;
        const topArea: Rectangle = {
            x : this.area.x,
            y : this.area.y,
            width: this.area.width,
            height: splitY - this.area.y
        } 

        const botArea: Rectangle = {
            x : this.area.x,
            y : this.area.y,
            width: this.area.width,
            height: (this.area.y + this.area.height) - splitY
        } 

        this.left = new BSPNode(topArea);
        this.right = new BSPNode(botArea);
     }
    depth--;
    this.left.split(depth, 20);

    this.right.split(depth, 20);


  };
  createRoom(): Room{
    const room:Room = {
        x:100,
        y:100,
        width:100,
        height:100,
    }
    return room;
  };
//   getRoom(): Room | null{

//   };
//   getAllRooms(): Room[]{

//   };
//   private isLeaf(): boolean{

//   };
// }

// export class DungeonGenerator {
//   // Static method (like static in Java)
//   static generate(width: number, height: number): Dungeon{
//     return null;
//   };
  
//   // Helper methods
//   private static createTiles(width: number, height: number): Tile[][];
//   private static placeRoomsOnTiles(tiles: Tile[][], rooms: Room[]): void;
//   private static createCorridors(tiles: Tile[][], rooms: Room[]): void;
// }

// // ========== RETURN TYPE ==========

// interface Dungeon {
//   width: number;
//   height: number;
//   tiles: Tile[][];
//   rooms: Room[];
}