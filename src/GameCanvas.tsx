import { useRef, use, useEffect } from "react";
import { BSPNode } from "./game/system/DungeonGenerator";
import type {Rectangle}  from "./game/system/DungeonGenerator";
import { carveAllRooms, createGrid, TILE_SIZE, TileType } from "./game/system/TileGrid";
import { dla, dlaExpand, expandRoom } from "./game/system/DLA";

interface Props {
    width: number;
    height: number;
    depth: number;
    minSize: number;
}



export const GameCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if(!canvas) return;

        const ctx = canvas.getContext('2d');
        if(!ctx) return;

        let playerX= 100;
        let playerY= 100;
        let movement = 2;
        const keys: { [key: string]: boolean } = {};
        const handleKeyDown = (e: KeyboardEvent) => { keys[e.key] = true; };
        const handleKeyUp = (e: KeyboardEvent) => { keys[e.key] = false; };
    
        
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        
        const gridX = canvas.width / TILE_SIZE;
        const gridY = canvas.height / TILE_SIZE;

        const start:Rectangle = {
            x : 0,
            y : 0,
            width: gridX,
            height: gridY
        }
        const root = new BSPNode(start);
        root.split(3, 12);
        var allrooms = root.getAllRooms();
        var allareas = root.getAllAreas();
        console.log("number of rooms: " + allrooms.length);
        console.log("number of areas: " + allareas.length);

        //create grid
        var grid = createGrid(gridX, gridY);
        carveAllRooms(grid, allrooms);
        //root.connectRooms(grid)
        root.connectRoomsSorted(grid, allrooms);
        // allrooms.forEach(rm => {
        //     //dla(grid,rm)
        //     expandRoom(grid, rm, 5)
        // }
        dlaExpand(grid, 100);
        //grid[50][50].type = TileType.Floor;
 
    const DebugDungeon = ({width, height, depth, minSize} : Props) =>{
        const start:Rectangle = {
                x : 0,
                y : 0,
                width: width,
                height: height
            }
            const root = new BSPNode(start);
            root.split(depth, minSize);
            const allrooms = root.getAllRooms();
        return allrooms;
    }
    

    const gameloop = () =>{

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (keys['ArrowUp'] || keys['w']) playerY -= movement;
            if (keys['ArrowDown'] || keys['s']) playerY += movement;
            if (keys['ArrowLeft'] || keys['a']) playerX -= movement;
            if (keys['ArrowRight'] || keys['d']) playerX += movement;
           

            //const allrooms = null;
            if (keys[' ']){
                const prop: Props = {
                    width: canvas.width,
                    height: canvas.height,
                    depth: 3,
                    minSize: 200
                };
                allrooms = DebugDungeon(prop);
                console.log('debug dungeon..');
            }
            //bound check
            const PLAYER_SIZE = 16;
            if(playerX < 0)
                playerX = 0;
            if(playerX > canvas.width - PLAYER_SIZE)
                playerX = canvas.width - PLAYER_SIZE;
            if(playerY < 0)
                playerY = 0;
            if(playerY > canvas.height - PLAYER_SIZE)
                playerY = canvas.height - PLAYER_SIZE;
            //playerX = Math.min(playerX, 800);
            //playerY = Math.min(playerY, 600);

            ctx.fillStyle = 'red';
            ctx.fillRect(playerX,playerY, PLAYER_SIZE, PLAYER_SIZE);

            ctx.strokeStyle = 'white';
            ctx.lineWidth = 4;
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
            

             // Draw rooms using canvas API
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
                allareas.forEach(room => {
                    // ctx.fillStyle = 'rgba(100, 100, 255, 0.0)';
                    // ctx.fillRect(room.x * TILE_SIZE, room.y * TILE_SIZE, room.width * TILE_SIZE, room.height* TILE_SIZE);
                    ctx.strokeStyle = 'red';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(room.x * TILE_SIZE, room.y * TILE_SIZE, room.width * TILE_SIZE, room.height * TILE_SIZE);
                });
            }

            if(grid){
                for(let i = 0; i<grid.length; i++){
                    for(let j = 0; j < grid[0].length; j++){



                        if(grid[i][j].type == TileType.Wall){
                            ctx.fillStyle = 'rgba(25, 168, 0, 0.6)';
                            ctx.fillRect(j*16,i*16,16,16);
                        }
                        else if(grid[i][j].type == TileType.Floor){
                            ctx.fillStyle = 'rgba(220, 136, 136, 0.5)';
                            ctx.fillRect(j*16,i*16,16,16);
                        }
                    }
                }
            }

           
            

            requestAnimationFrame(gameloop);
    };

    gameloop();


    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };

    }, []);

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
                Canvas Game
            </h1>
            <canvas ref ={canvasRef} width={640} height={480} />
        
        </div>;

}
