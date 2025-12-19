import { useRef, use, useEffect } from "react";

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

 


    const gameloop = () =>{

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (keys['ArrowUp'] || keys['w']) playerY -= movement;
            if (keys['ArrowDown'] || keys['s']) playerY += movement;
            if (keys['ArrowLeft'] || keys['a']) playerX -= movement;
            if (keys['ArrowRight'] || keys['d']) playerX += movement;
            
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
