import { useRef, use, useEffect, useState } from "react";
import { BSPNode } from "./game/system/DungeonGenerator";
import type {Rectangle,Room}  from "./game/system/DungeonGenerator";
import type { Tile } from "./game/system/TileGrid";
import { carveAllRooms, createGrid, TILE_SIZE, TileType } from "./game/system/TileGrid";
import { dla, dlaExpand, expandRoom } from "./game/system/DLA";
import { mulberry32 } from "./game/system/Utilities";

interface Props {
    width: number;
    height: number;
    depth: number;
    minSize: number;
}

// interface dungeonProps{
//     grid: Tile[][]

// }

export const GameCanvas = () => {
    var currDungRoot;
    //var grid;
    const [grid, setGrid] = useState<Tile[][]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [areas, setAreas] = useState<Rectangle[]>([]);
    const [debugMode, setDebug] = useState<boolean>(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    //let debugMode = false;


    
    const generateDungeon = () => {
        console.log("generating dungeon");
        const canvas = canvasRef.current;
        if(!canvas) return;

        const ctx = canvas.getContext('2d');
        if(!ctx) return;

        //clear the canvas first
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const gridX = canvas.width / TILE_SIZE;
        const gridY = canvas.height / TILE_SIZE;

        const start:Rectangle = {
            x : 0,
            y : 0,
            width: gridX,
            height: gridY
        }

        const rand = mulberry32(12345);
        const root = new BSPNode(start, rand);
       

        root.split(6, 12);
        currDungRoot = root;
        var allrooms = root.getAllRooms();
        var allareas = root.getAllAreas();
        console.log("number of rooms: " + allrooms.length);
        console.log("number of areas: " + allareas.length);

        //create grid
        var newGrid = createGrid(gridX, gridY);
        carveAllRooms(newGrid, allrooms);
        //root.connectRooms(newGrid)
        root.connectRoomsSortedX(newGrid, allrooms);
        // allrooms.forEach(rm => {
        //     //dla(grid,rm)
        //     expandRoom(grid, rm, 5)
        // }
        dlaExpand(newGrid, 100);


        setGrid(newGrid);
        setRooms(allrooms);
        setAreas(allareas);
   
         // Draw rooms using canvas API
        
    }

    const drawCanvas = (grid:Tile[][], allrooms:Room[], allareas:Rectangle[]) =>{
        const canvas = canvasRef.current;
        if(!canvas) return;

        const ctx = canvas.getContext('2d');
        if(!ctx) return;

        //clear the canvas first
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if(allrooms){
            allrooms.forEach(room => {
                ctx.fillStyle = 'rgba(100, 100, 255, 0.0)';
                ctx.fillRect(room.x * TILE_SIZE, room.y * TILE_SIZE, room.width * TILE_SIZE, room.height* TILE_SIZE);
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 1;
                ctx.strokeRect(room.x * TILE_SIZE, room.y * TILE_SIZE, room.width * TILE_SIZE, room.height * TILE_SIZE);
            });
        }
        if(allareas){
            if( debugMode === true){
                allareas.forEach(room => {
                    // ctx.fillStyle = 'rgba(100, 100, 255, 0.0)';
                    // ctx.fillRect(room.x * TILE_SIZE, room.y * TILE_SIZE, room.width * TILE_SIZE, room.height* TILE_SIZE);
                    ctx.strokeStyle = 'red';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(room.x * TILE_SIZE, room.y * TILE_SIZE, room.width * TILE_SIZE, room.height * TILE_SIZE);
                });
            }
        }

        if(grid){
            for(let i = 0; i<grid.length; i++){
                for(let j = 0; j < grid[0].length; j++){

                    if(grid[i][j].type == TileType.Wall){
                        ctx.fillStyle = 'rgba(25, 168, 0, 0.6)';
                        ctx.fillRect(j*TILE_SIZE,i*TILE_SIZE,TILE_SIZE,TILE_SIZE);
                    }
                    else if(grid[i][j].type == TileType.Floor){
                        ctx.fillStyle = 'rgba(220, 136, 136, 0.5)';
                        ctx.fillRect(j*TILE_SIZE,i*TILE_SIZE,TILE_SIZE,TILE_SIZE);
                    }
                    else if(grid[i][j].type == TileType.Corridor ){
                        if( debugMode === true){
                            ctx.fillStyle = 'rgba(255, 0, 136, 0.5)';
                            ctx.fillRect(j*TILE_SIZE,i*TILE_SIZE,TILE_SIZE,TILE_SIZE);
                        }
                        else{
                            ctx.fillStyle = 'rgba(220, 136, 136, 0.5)';
                            ctx.fillRect(j*TILE_SIZE,i*TILE_SIZE,TILE_SIZE,TILE_SIZE);
                        }
                    }

                }
            }
        }
        
    }

    const debug = () =>{

        //debugMode = !debugMode;
        setDebug(!debugMode);
        console.log('Debug mode:', debugMode);
        // roomLists = ((BSPNode)currDungRoot).getAllRooms();
        // currDungRoot
        //drawCanvas()//here need reference to grid, all rooms, all areas, the latter two need reference to root of bsp tree.

    }

     useEffect(() => {
    //     const canvas = canvasRef.current;
    //     if(!canvas) return;

    //     const ctx = canvas.getContext('2d');
    //     if(!ctx) return;

    //     let playerX= 100;
    //     let playerY= 100;
    //     let movement = 2;
    //     const keys: { [key: string]: boolean } = {};

    //     const prevKeys :{ [key: string]: boolean } = {};
    //     const handleKeyDown = (e: KeyboardEvent) => { 
    //         keys[e.key] = true; 
    //         //prevKeys[e.key] = true;
          
    //     };
    //     const handleKeyUp = (e: KeyboardEvent) => { 
    //         keys[e.key] = false; 
    //         //prevKeys[e.key] = false;
    //     };
        
        
    //     window.addEventListener('keydown', handleKeyDown);
    //     window.addEventListener('keyup', handleKeyUp);
        
        
       
    //     //grid[50][50].type = TileType.Floor;
        
        generateDungeon();

  
    
    
   

    // const gameloop = () =>{
    //         //clearing the canvas
    //         //
    //         if (keys['ArrowUp'] || keys['w']) playerY -= movement;
    //         if (keys['ArrowDown'] || keys['s']) playerY += movement;
    //         if (keys['ArrowLeft'] || keys['a']) playerX -= movement;
    //         if (keys['ArrowRight'] || keys['d']) playerX += movement;
           

    //         //const allrooms = null;
    //         if (keys[' '] && !prevKeys[' '] ){
    //             // const prop: Props = {
    //             //     width: canvas.width,
    //             //     height: canvas.height,
    //             //     depth: 3,
    //             //     minSize: 200
    //             // };
    //             // allrooms = DebugDungeon(prop);
    //             // console.log('debug dungeon..');
                
    //             // if(debugMode === false)
    //             //     debugMode = true;
    //             // else
    //             //     debugMode = false;

               
    //         }


    //         //bound check
    //         const PLAYER_SIZE = 16;
    //         if(playerX < 0)
    //             playerX = 0;
    //         if(playerX > canvas.width - PLAYER_SIZE)
    //             playerX = canvas.width - PLAYER_SIZE;
    //         if(playerY < 0)
    //             playerY = 0;
    //         if(playerY > canvas.height - PLAYER_SIZE)
    //             playerY = canvas.height - PLAYER_SIZE;
    //         //playerX = Math.min(playerX, 800);
    //         //playerY = Math.min(playerY, 600);

    //         ctx.fillStyle = 'red';
    //         ctx.fillRect(playerX,playerY, PLAYER_SIZE, PLAYER_SIZE);

    //         ctx.strokeStyle = 'white';
    //         ctx.lineWidth = 4;
    //         ctx.strokeRect(0, 0, canvas.width, canvas.height);
            

            

           
    //         for (const key in keys) {
    //             prevKeys[key] = keys[key];
    //         }

    //         requestAnimationFrame(gameloop);
    // };

    // gameloop();


    // // Cleanup
    // return () => {
    //   window.removeEventListener('keydown', handleKeyDown);
    //   window.removeEventListener('keyup', handleKeyUp);
    // };

    }, []);

    useEffect(()=>{



       // drawCanvas(grid, allrooms, allareas);
        if(grid.length<=0){
            return;
        }
        console.log("grid updated");
        drawCanvas(grid, rooms, areas);
    },[grid, rooms, areas, debugMode]);
    



    return <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#1a1a2e',
            padding: '20px'
             }}>
            <h1 style={{ color: 'white', fontSize: '32px', marginBottom: '20px' }}>
                Random Dungeon Generator
            </h1>


            <div style={{ marginBottom: '10px' }}>
                <button 
                    onClick={generateDungeon}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        backgroundColor: '#4a4a8a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        marginRight: '10px'
                    }}
                >
                    Generate New
                </button>
                
                <button 
                    onClick={debug}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        backgroundColor: '#4a4a8a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px'
                    }}
                >
                    Toggle Debug
                </button>
            </div>
            <canvas ref ={canvasRef} width={960} height={720} />
        
        </div>;

}
