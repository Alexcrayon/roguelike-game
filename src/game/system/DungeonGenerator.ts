
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

        this.room = this.createRoom(this.area.x, this.area.y);
        return;
     }

     const rand: number = Math.random();
     if(rand > 0.5){
        //split vertically
        //create two room horizontally
        const ratio = 0.3 + Math.random()*0.4;
        const splitX = this.area.x + this.area.width * ratio;
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
        const splitY = this.area.y + this.area.height * ratio;
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

    const padding = 2;  // tiles of wall/corridor space
    const minRoomSize = 4;
  
    const maxWidth = this.area.width - padding * 2;
    const maxHeight = this.area.height - padding * 2;

    //need to find to a way to debug generated room
    //draw it on screen


    //temporarily
    const room:Room = {
        x: xPos+padding,
        y: yPos+padding,
        width:maxWidth,
        height:maxHeight,
    }
    return room;
  };
//   getRoom(): Room | null{

//   };
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

}