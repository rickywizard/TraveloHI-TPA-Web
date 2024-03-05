import { useEffect, useRef, useState } from "react";
import music from "../../game-assets/background music 1.mp3";
import { Player1 } from "../../game-object/Player1";
import { Player2 } from "../../game-object/Player2";
import background from "../../game-assets/background/background.png";
import lifebar from "../../game-assets/lifebar full.png";
import win from "../../game-assets/win.png";
import draw from "../../game-assets/draw.png";
import lose from "../../game-assets/lose.png";
import { socketClient } from "../../socket-client";
import { useNavigate } from "react-router-dom";
import { IGameData } from "../../interfaces/game-data";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const GamePage: React.FC = () => {
  const { user } = useAuth();
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

  // MUSIC
  const backgroundMusic = new Audio();
  backgroundMusic.src = music;
  backgroundMusic.loop = true;
  backgroundMusic.volume = 0.6;

  useEffect(() => {
    window.onclick = () => {
      backgroundMusic.play();
    }

    return () => {
      backgroundMusic.pause();
    }
  }, []);

  // CLIENT ACCEPT MESSAGE
  useEffect(() => {
    socketClient.connect()
    socketClient.on("playerId", (id: number) => {
      playerId.current = id;
    });

    socketClient.on("roomFull", () => {
      alert("Room is full! Try again later");
      backgroundMusic.pause()
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
      else if (data.action === "idle" && data.playerId === 2) {
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
          prevPlayerData.setState("walkMirror")
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
      // P1 FRONT KICK
      else if (data.action === "frontKick" && data.playerId === 1) {
        setPlayer1((prevPlayerData) => {
          prevPlayerData.setX(data.player1x)
          prevPlayerData.setY(data.player1y)
          prevPlayerData.setState("frontkick")
          prevPlayerData.setHealth(data.player1Health)
          return prevPlayerData
        })
      }
      else if (data.action === "frontKickMirror" && data.playerId === 1) {
        setPlayer1((prevPlayerData) => {
          prevPlayerData.setX(data.player1x)
          prevPlayerData.setY(data.player1y)
          prevPlayerData.setState("backkick")
          prevPlayerData.setHealth(data.player1Health)
          return prevPlayerData
        })
      }
      else if(data.action === "dealFrontKickDamage" && data.playerId === 1) {
        setPlayer1((prevPlayerData) => {
          prevPlayerData.setX(data.player1x)
          prevPlayerData.setY(data.player1y)
          prevPlayerData.setHealth(data.player1Health)
          return prevPlayerData
        })
        
        setPlayer2((prevPlayerData) => {
          prevPlayerData.setHealth(data.player2Health)
          return prevPlayerData
        })
      }
      // P2 FRONT KICK
      else if (data.action === "frontKick" && data.playerId === 2) {
        setPlayer2((prevPlayerData) => {
          prevPlayerData.setX(data.player2x)
          prevPlayerData.setY(data.player2y)
          prevPlayerData.setState("frontkickMirror")
          prevPlayerData.setHealth(data.player2Health)
          return prevPlayerData
        })
      }
      else if (data.action === "frontKickMirror" && data.playerId === 2) {
        setPlayer2((prevPlayerData) => {
          prevPlayerData.setX(data.player2x)
          prevPlayerData.setY(data.player2y)
          prevPlayerData.setState("frontkick")
          prevPlayerData.setHealth(data.player2Health)
          return prevPlayerData
        })
      }
      else if (data.action === "dealFrontKickDamage" && data.playerId === 2) {
        setPlayer2((prevPlayerData) => {
          prevPlayerData.setX(data.player2x)
          prevPlayerData.setY(data.player2y)
          prevPlayerData.setHealth(data.player2Health)
          return prevPlayerData
        })

        setPlayer1((prevPlayerData) => {
          prevPlayerData.setHealth(data.player1Health)
          return prevPlayerData
        })
      }
      // P1 LOW KICK
      else if (data.action === "lowKickRight" && data.playerId === 1) {
        setPlayer1((prevPlayerData) => {
          prevPlayerData.setX(data.player1x)
          prevPlayerData.setY(data.player1y)
          prevPlayerData.setState("lowkick")
          prevPlayerData.setHealth(data.player1Health)
          return prevPlayerData
        })
      }
      else if (data.action === "lowKickLeft" && data.playerId === 1) {
        setPlayer1((prevPlayerData) => {
          prevPlayerData.setX(data.player1x)
          prevPlayerData.setY(data.player1y)
          prevPlayerData.setState("lowbackkick")
          prevPlayerData.setHealth(data.player1Health)
          return prevPlayerData
        })
      }
      else if (data.action === "dealLowKickDamage" && data.playerId === 1) {
        setPlayer1((prevPlayerData) => {
          prevPlayerData.setX(data.player1x)
          prevPlayerData.setY(data.player1y)
          prevPlayerData.setHealth(data.player1Health)
          return prevPlayerData
        })

        setPlayer2((prevPlayerData) => {
          prevPlayerData.setHealth(data.player2Health)
          return prevPlayerData
        })
      }
      // P2 LOW KICK
      else if (data.action === "lowKickRight" && data.playerId === 2) {
        setPlayer2((prevPlayerData) => {
          prevPlayerData.setX(data.player2x)
          prevPlayerData.setY(data.player2y)
          prevPlayerData.setState("lowkick")
          prevPlayerData.setHealth(data.player2Health)
          return prevPlayerData
        })
      }
      else if (data.action === "lowKickLeft" && data.playerId === 2) {
        setPlayer2((prevPlayerData) => {
          prevPlayerData.setX(data.player2x)
          prevPlayerData.setY(data.player2y)
          prevPlayerData.setState("lowkickMirror")
          prevPlayerData.setHealth(data.player2Health)
          return prevPlayerData
        })
      }
      else if (data.action === "dealLowKickDamage" && data.playerId === 2) {
        setPlayer2((prevPlayerData) => {
          prevPlayerData.setX(data.player2x)
          prevPlayerData.setY(data.player2y)
          prevPlayerData.setHealth(data.player2Health)
          return prevPlayerData
        })

        setPlayer1((prevPlayerData) => {
          prevPlayerData.setHealth(data.player1Health)
          return prevPlayerData
        })
      }
    })

    return () => {
      socketClient.off("playerId");
      socketClient.off("roomFull");
    };
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
  let matchPlayed = 0
  let timer = 240

  const checkCollision = (rect1: any, rect2: any): boolean => {
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
      }
      else if (e.key === "a") {
        sendGameData("moveLeft");
      }
      else if (isAPressed && e.key === " ") {
        sendGameData("frontKickMirror")

        if (checkCollision(player1.collisionBox, player2.collisionBox)) {
          sendGameData("dealFrontKickDamage")
        }
      }
      else if (e.key === "s") {
        setIsSPressed(true);
      }
      else if (isSPressed && e.key === " ") {
        if (player1.getState() === "idle" || player2.getState() === "idle") {
          sendGameData("lowKickRight")

          if (checkCollision(player1.collisionBox, player2.collisionBox)) {
            sendGameData("dealLowKickDamage")
          }
        }
        else if (player1.getState() === "mirror" || player2.getState() === "mirror") {
          sendGameData("lowKickLeft")

          if (checkCollision(player1.collisionBox, player2.collisionBox)) {
            sendGameData("dealLowKickDamage")
          }
        }
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
        ctx.drawImage(backgroundImage, 0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.fillStyle = "green";
        ctx.fillRect(200, 40, player1.getHealth() * 2.5, 20);
        ctx.save();

        ctx.translate(canvasRef.current.width, 0);
        ctx.scale(-1, 1);
        ctx.fillStyle = "blue";
        ctx.fillRect(200, 40, player2.getHealth() * 2.5, 20);
        ctx.restore();
        ctx.drawImage(lifebarImage, 100, 0, 800, 100);

        player1.update(ctx);
        player1.updateCollisionBox();
        player2.update(ctx);
        player2.updateCollisionBox();

        ctx.font = "20px fantasy"
        ctx.fillStyle = "white"
        ctx.fillText(`${timer}`, 485, 60)

        // POSITIONING PLAYER
        if (player1.getState() === "idle" || player1.getState() === "mirror") {
          if ( player1.getX() > (player2.getX() + player2.getWidth()/2) ) {
            player1.setState("mirror")
          }
          else if ( player1.getX() < (player2.getX() + player2.getWidth()/2) ) {
            player1.setState("idle")
          }
        }

        if (player2.getState() === "idle" || player2.getState() === "mirror") {
          if ( player2.getX() < (player1.getX() + player1.getWidth()/2) ) {
            player2.setState("mirror")
          }
          else if ( player2.getX() > (player1.getX() + player1.getWidth()/2) ) {
            player2.setState("idle")
          }
        }

        // WINNING CONDITION
        // Check match condition
        if (matchPlayed === 3) {
          player1.setCanMove(false)
          player2.setCanMove(false)
          socketClient.disconnect()
          setTimeout(() => {
            backgroundMusic.pause()
            navigate("/")
          }, 3000);
        }
        else {
          // P1 LOSE, P2 WIN GAME
          if (player1.getHealth() <= 0) {
            player1.setCanMove(false)
            player2.setCanMove(false)
            if (playerId.current === 1) {
              ctx.drawImage(loseMatchImage, 350, 200, 300, 300)
            }
            else if (playerId.current === 2) {
              ctx.drawImage(winMatchImage, 350, 200, 300, 300)
              // Give reward
              giveReward()
              backgroundMusic.pause()
            } 
            setTimeout(() => {
              matchPlayed += 1
              player1.setX(100)
              player1.setHealth(100)
              player2.setX(700)
              player2.setHealth(100)
              player1.setCanMove(true)
              player2.setCanMove(true)
            }, 2000);
          }
          // P1 WIN, P2 LOSE GAME
          else if (player2.getHealth() <= 0) {
            player1.setCanMove(false)
            player2.setCanMove(false)
            if (playerId.current === 1) {
              ctx.drawImage(winMatchImage, 350, 200, 300, 300)
              // Give reward
              giveReward()
              backgroundMusic.pause()
            }
            else if (playerId.current === 2) {
              ctx.drawImage(loseMatchImage, 350, 200, 300, 300)
            }
            setTimeout(() => {
              matchPlayed += 1
              player1.setX(100)
              player1.setHealth(100)
              player2.setX(700)
              player2.setHealth(100)
              player1.setCanMove(true)
              player2.setCanMove(true)
            }, 2000);
          }
        }
        
        // DRAW
        if (timer === 0) {
          ctx.drawImage(drawMatchImage, 350, 200, 300, 300)
          player1.setCanMove(false)
          player2.setCanMove(false)
          socketClient.disconnect()
          setTimeout(() => {
            backgroundMusic.pause()
            navigate("/")
          }, 5000);
        }

        requestAnimationFrame(animate);
      }
    }
  };

  useEffect(() => {
    animate();
  }, []);

  const giveReward = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/game_reward",
        { user_id: user?.id },
        { withCredentials: true }
      )
      if (response.status === 200) {
        console.log("Reward sent");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
      }
    }
  }

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
