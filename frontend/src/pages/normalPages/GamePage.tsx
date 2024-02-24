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
import { IGameData } from "../../interfaces/game-data";

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [player1, setPlayer1] = useState(new Player1(100, 300, 200, 275));
  const [player2, setPlayer2] = useState(new Player2(700, 300, 200, 275));
  const playerId = useRef<number | null>(null);
  const [isDPressed, setIsDPressed] = useState<boolean>(false);
  const [isSPressed, setIsSPressed] = useState<boolean>(false);
  const [isAPressed, setIsAPressed] = useState<boolean>(false);
  const [isMovingLeft, setIsMovingLeft] = useState<boolean>(false);
  const [isMovingRight, setIsMovingRight] = useState<boolean>(false);
  const [isJumping, setIsJumping] = useState<boolean>(false)
  // const background = new Background(player1, player2);

  // MUSIC
  const backgroundMusic = new Audio();
  backgroundMusic.src = music;
  backgroundMusic.loop = true;
  backgroundMusic.volume = 0;

  useEffect(() => {
    window.onclick = () => {
      backgroundMusic.play();
    };
  }, []);

  // CLIENT ACCEPT MESSAGE
  useEffect(() => {
    socketClient.on("playerId", (id: number) => {
      playerId.current = id;
    });

    socketClient.on("roomFull", () => {
      alert("Room is full! Try again later");
      navigate("/");
    });

    socketClient.on("playerAction", (data: IGameData) => {
      // BASIC MOVE P1
      if (data.action === "idle" && data.playerId === 1) {
        setPlayer1((prevPlayerData) => {
          prevPlayerData.setX(data.player1x)
          prevPlayerData.setY(data.player1y)
          prevPlayerData.setState("idle")
          prevPlayerData.setHealth(data.player1Health)
          return prevPlayerData
        })
      }
      else if (data.action === "moveRight" && data.playerId === 1) {
        setIsDPressed(true)
        setIsMovingRight(true)
        
        setPlayer1((prevPlayerData) => {
          prevPlayerData.setX(data.player1x)
          prevPlayerData.setY(data.player1y)
          prevPlayerData.setState("walkingFront")
          prevPlayerData.setHealth(data.player1Health)
          return prevPlayerData
        })
      }
      else if (data.action === "moveLeft" && data.playerId === 1) {
        setIsAPressed(true)
        setIsMovingLeft(true)
        setPlayer1((prevPlayerData) => {
          prevPlayerData.setX(data.player1x)
          prevPlayerData.setY(data.player1y)
          prevPlayerData.setState("walkingBack")
          prevPlayerData.setHealth(data.player1Health)
          return prevPlayerData
        })
      }
      else if (data.action === "jumping" && data.playerId === 1) {
        const jumpDuration = 1000;
        const jumpHeight = 200;

        let jumpStart = Date.now();

        const jump = () => {
          const now = Date.now();
          const elapsed = now - jumpStart;

          if (elapsed < jumpDuration) {
            const jumpProgress = 1 - elapsed / jumpDuration;
            const jumpDeltaTime = jumpHeight * Math.sin(jumpProgress * Math.PI);

            setPlayer1((prevPlayerData) => {
              prevPlayerData.setState("jump");
              const jumpXDelta = isMovingRight ? 5 : isMovingLeft ? -5 : 0;
              prevPlayerData.setX(prevPlayerData.getX() + jumpXDelta);
              prevPlayerData.setY(300 - jumpDeltaTime);
              return prevPlayerData;
            });

            requestAnimationFrame(jump);
          } else {
            setIsJumping(false);

            setPlayer1((prevPlayerData) => {
              prevPlayerData.setState("idle");
              prevPlayerData.setY(300);
              return prevPlayerData;
            });
          }
        };

        jump();
      }
      // BASIC MOVE P2
      if (data.action === "idle" && data.playerId === 2) {
        setPlayer2((prevPlayerData) => {
          prevPlayerData.setX(data.player2x)
          prevPlayerData.setY(data.player2y)
          prevPlayerData.setState("idle")
          prevPlayerData.setHealth(data.player2Health)
          return prevPlayerData
        })
      }
      else if (data.action === "moveRight" && data.playerId === 2) {
        setIsDPressed(true)
        setIsMovingRight(true)

        setPlayer2((prevPlayerData) => {
          prevPlayerData.setX(data.player2x)
          prevPlayerData.setY(data.player2y)
          prevPlayerData.setState("back")
          prevPlayerData.setHealth(data.player2Health)
          return prevPlayerData
        })
      }
      else if (data.action === "moveLeft" && data.playerId === 2) {
        setIsAPressed(true)
        setIsMovingLeft(true)
        setPlayer2((prevPlayerData) => {
          prevPlayerData.setX(data.player2x)
          prevPlayerData.setY(data.player2y)
          prevPlayerData.setState("walk")
          prevPlayerData.setHealth(data.player2Health)
          return prevPlayerData
        })
      }
      else if (data.action === "jumping" && data.playerId === 2) {
        const jumpDuration = 1000;
        const jumpHeight = 200;

        let jumpStart = Date.now();

        const jump = () => {
          const now = Date.now();
          const elapsed = now - jumpStart;

          if (elapsed < jumpDuration) {
            const jumpProgress = 1 - elapsed / jumpDuration;
            const jumpDeltaTime = jumpHeight * Math.sin(jumpProgress * Math.PI);

            setPlayer2((prevPlayerData) => {
              prevPlayerData.setState("jump");
              const jumpXDelta = isMovingRight ? 5 : isMovingLeft ? -5 : 0;
              prevPlayerData.setX(prevPlayerData.getX() + jumpXDelta);
              prevPlayerData.setY(300 - jumpDeltaTime);
              return prevPlayerData;
            });

            requestAnimationFrame(jump);
          } else {
            setIsJumping(false);

            setPlayer2((prevPlayerData) => {
              prevPlayerData.setState("idle");
              prevPlayerData.setY(300);
              return prevPlayerData;
            });
          }
        };

        jump();
      }
    })
  }, []);

  const sendGameData = (action: string) => {
    socketClient.emit("joinGame", {
      playerId: playerId.current,
      player1x: player1.getX(),
      player1y: player1.getY(),
      player2x: player2.getX(),
      player2y: player2.getY(),
      action: action,
      player1Health: player1.getHealth(),
      player2Health: player2.getHealth(),
    });
  };

  // GAME CONTROL
  let timer = 240

  const checkCollision = (rect1: any, rect2: any) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    // console.log(e.key);
    if (player1.getCanMove() && player2.getCanMove()) {
  
      if (e.key === "d") {
        sendGameData("moveRight")
      }
      else if (isDPressed && e.key === " ") {
        sendGameData("frontKick")

        if (checkCollision(player1.collisionBox, player2.collisionBox)) {
          sendGameData("dealFrontKickDamage")
        }

        if (checkCollision(player2.collisionBox, player1.collisionBox)) {
          sendGameData("hitFrontKickDamage")
        }
      }
      else if (e.key === "a") {
        sendGameData("moveLeft");
      }
      else if (isAPressed && e.key === " ") {
        sendGameData("frontKickMirror")

        if (checkCollision(player1.collisionBox, player2.collisionBox)) {
          sendGameData("dealFrontKickDamage")
        }

        if (checkCollision(player2.collisionBox, player1.collisionBox)) {
          sendGameData("hitFrontKickDamage")
        }
      }
      else if (e.key === "s") {
        setIsSPressed(true);
      }
      else if (e.key === "w" && !isJumping) {
        setIsJumping(true)
        sendGameData("jumping");
      }
    }
  }

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === "d") {
      sendGameData("idle")
      if (isDPressed) {
        setIsDPressed(false)
        setIsMovingRight(false)
      }
    }
    else if (e.key === "a") {
      sendGameData("idle")
      
      if (isAPressed) {
        setIsAPressed(false)
      }
    }
    else if (e.key === "s") {
      sendGameData("idle")

      if (isSPressed) {
        setIsSPressed(false)
      }
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    setInterval(() => {
      if (timer != 0) {
        timer -= 1;
      } else if (timer == 0) {
        timer = 0;
      }
    }, 1000);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isJumping, isDPressed, isAPressed, isSPressed])

  // GAME LOOP
  const animate = () => {
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
