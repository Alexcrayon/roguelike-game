import { useRef, use, useEffect } from "react";
import { BSPNode } from "./game/system/DungeonGenerator";
import type {Rectangle}  from "./game/system/DungeonGenerator";

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
        
         
        const start:Rectangle = {
            x : 0,
            y : 0,
            width: canvas.width,
            height: canvas.height
        }
        const root = new BSPNode(start);
        root.split(5, 150);
        var allrooms = root.getAllRooms();
 
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
            if(playerX < 0)
                playerX = 0;
            if(playerX > 750)
                playerX = 750;
            if(playerY < 0)
                playerY = 0;
            if(playerY > 550)
                playerY = 550;
            //playerX = Math.min(playerX, 800);
            //playerY = Math.min(playerY, 600);

            ctx.fillStyle = 'red';
            ctx.fillRect(playerX,playerY,50,50);

            ctx.strokeStyle = 'white';
            ctx.lineWidth = 4;
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
            

             // Draw rooms using canvas API
            if(allrooms){
                allrooms.forEach(room => {
                    ctx.fillStyle = 'rgba(100, 100, 255, 0.0)';
                    ctx.fillRect(room.x, room.y, room.width, room.height);
                    ctx.strokeStyle = 'white';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(room.x, room.y, room.width, room.height);
                });
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
            <canvas ref ={canvasRef} width={800} height={600} />
        
        </div>;

}
