import { useEffect, useRef, useState } from "react";
import music from "../../game-assets/background music 1.mp3";
import { Player1 } from "../../game-object/Player1";
import { Player2 } from "../../game-object/Player2";
// import { Background } from "../../game-object/Background";
import background from "../../game-assets/background/background.png";
import lifebar from "../../game-assets/lifebar full.png";
import win from "../../game-assets/win.png";
import draw from "../../game-assets/draw.png";
import lose from "../../game-assets/lose.png";
import { socketClient } from "../../socket-client";
import { useNavigate } from "react-router-dom";

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const [player1, setPlayer1] = useState(new Player1(100, 250, 200, 300));
  const [player2, setPlayer2] = useState(new Player2(700, 250, 200, 300));
  const playerId = useRef<number | null>(null);
  // const background = new Background(player1, player2);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const backgroundMusic = new Audio()
  backgroundMusic.src = music

  // client
  useEffect(() => {
    socketClient.on("playerId", (id: number) => {
      playerId.current = id;
    })

    socketClient.on("roomFull", () => {
      alert("Room is full! Try again later");
      navigate("/")
    })
  }, [])
  
  const animate = () => {
    console.log('asdasd')
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      const backgroundImage = new Image();
      const lifebarImage = new Image();
      const drawMatchImage = new Image();
      const winMatchImage = new Image();
      const loseMatchImage = new Image();
      backgroundImage.src = background;
      lifebarImage.src = lifebar;
      drawMatchImage.src = draw;
      winMatchImage.src = win;
      loseMatchImage.src = lose;

      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // background.draw(ctx, canvasRef.current)
        ctx.drawImage(
          backgroundImage,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        ctx.fillStyle = "green";
        ctx.fillRect(150, 40, player1.getHealth() * 3, 20);
        ctx.save();
    
        ctx.translate(canvasRef.current.width, 0);
        ctx.scale(-1, 1);
        ctx.fillStyle = "blue";
        ctx.fillRect(150, 40, player2.getHealth() * 3, 20);
        ctx.restore();
        ctx.drawImage(lifebarImage, 100, 0, 800, 100);

        player1.update(ctx);
        player2.update(ctx);

        requestAnimationFrame(animate);
      }
    }
  };

  useEffect(() => {
    animate();
  }, []);

  useEffect(() => {
    window.onclick = () => {
      backgroundMusic.play();
    };
  }, []);

  return (
    <div
      style={{
        backgroundColor: "var(--black-soft)",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <canvas ref={canvasRef} width={1000} height={600} />
    </div>
  );
};

export default GamePage;
