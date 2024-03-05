import { Server, Socket } from 'socket.io';
import http from 'http';
import express from 'express';
import cors from 'cors';

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://127.0.0.1:5173",
    methods: ["GET", "POST"]
  }
});
app.use(cors());

interface IPlayer {
  id: number;
  socket: Socket;
}

interface IGameData {
  playerId: number;
  player1x: number;
  player1y: number;
  player2x: number;
  player2y: number;
  action: string;
  player1Health: number;
  player2Health: number;
}

const players: IPlayer[] = [];

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  const playerId = players.length + 1;
  const newPlayer: IPlayer = {
    id: playerId,
    socket: socket
  };

  if(players.length === 2) {
    console.log("ROom is full");
    socket.emit("roomFull");
    return;
  }

  players.push(newPlayer);

  // Kirim playerId ke client
  socket.emit("playerId", playerId);

  // Player disconnected
  socket.on("disconnect", () => {
    console.log('Player disconnected:', socket.id);
    const index = players.findIndex((player) => player.id === playerId);
    if (index !== -1) {
      players.splice(index, 1);
    }
  })

  // Kirim data sesuai aksi dari player
  socket.on("joinGame", (data: IGameData) => {
    console.log(`playerId ${data.playerId} posX: ${data.player1x}, posY: ${data.player1y}, action: ${data.action}, health: ${data.player1Health}`);

    console.log(`playerId ${data.playerId} posX: ${data.player2x}, posY: ${data.player2y}, action: ${data.action}, health: ${data.player2Health}`);
    
    // BASIC MOVE P1
    if (data.action === "idle" && data.playerId === 1) {
      io.emit("playerAction", {
        playerId: playerId,
        action: data.action,
        player1x: data.player1x,
        player1y: data.player1y,
        player1Health: data.player1Health
      })
    }
    else if (data.action === "moveRight" && data.playerId === 1) {
      io.emit("playerAction", {
        playerId: playerId,
        action: data.action,
        player1x: data.player1x + 15,
        player1y: data.player1y,
        player1Health: data.player1Health
      })
    }
    else if (data.action === "moveLeft" && data.playerId === 1) {
      io.emit("playerAction", {
        playerId: playerId,
        action: data.action,
        player1x: data.player1x - 15,
        player1y: data.player1y,
        player1Health: data.player1Health
      })
    }
    else if (data.action === "jumping" && data.playerId === 1) {
      io.emit("playerAction", {
        playerId: playerId,
        action: data.action,
        player1x: data.player1x,
        player1y: data.player1y,
        player1Health: data.player1Health
      })
    }
    // BASIC MOVE P2
    else if (data.action === "idle" && data.playerId === 2) {
      io.emit("playerAction", {
        playerId: playerId,
        action: data.action,
        player2x: data.player2x,
        player2y: data.player2y,
        player2Health: data.player2Health
      })
    }
    else if (data.action === "moveRight" && data.playerId === 2) {
      io.emit("playerAction", {
        playerId: playerId,
        action: data.action,
        player2x: data.player2x + 15,
        player2y: data.player2y,
        player2Health: data.player2Health,
      })
    }
    else if (data.action === "moveLeft" && data.playerId === 2) {
      io.emit("playerAction", {
        playerId: playerId,
        action: data.action,
        player2x: data.player2x - 15,
        player2y: data.player2y,
        player2Health: data.player2Health,
      })
    }
    else if (data.action === "jumping" && data.playerId === 2) {
      io.emit("playerAction", {
        playerId: playerId,
        action: data.action,
        player2x: data.player2x,
        player2y: data.player2y,
        player2Health: data.player2Health
      })
    }
    // P1 FRONT KICK
    else if (data.action === "frontKick" && data.playerId === 1) {
      io.emit("playerAction", {
        playerId: playerId,
        action: data.action,
        player1x: data.player1x,
        player1y: data.player1y,
        player1Health: data.player1Health
      })
    }
    else if (data.action === "frontKickMirror" && data.playerId === 1) {
      io.emit("playerAction", {
        playerId: playerId,
        action: data.action,
        player1x: data.player1x,
        player1y: data.player1y,
        player1Health: data.player1Health
      })
    }
    else if (data.action === "dealFrontKickDamage" && data.playerId === 1) {
      io.emit("playerAction", {
        playerId: playerId,
        action: data.action,
        player1x: data.player1x,
        player1y: data.player1y,
        player1Health: data.player1Health,
        player2Health: data.player2Health - 10
      })
    }
    // P2 FRONT KICK
    else if (data.action === "frontKick" && data.playerId === 2) {
      io.emit("playerAction", {
        playerId: playerId,
        action: data.action,
        player2x: data.player2x,
        player2y: data.player2y,
        player2Health: data.player2Health
      })
    }
    else if (data.action === "frontKickMirror" && data.playerId === 2) {
      io.emit("playerAction", {
        playerId: playerId,
        action: data.action,
        player2x: data.player2x,
        player2y: data.player2y,
        player2Health: data.player2Health
      })
    }
    else if (data.action === "dealFrontKickDamage" && data.playerId === 2) {
      io.emit("playerAction", {
        playerId: playerId,
        action: data.action,
        player2x: data.player2x,
        player2y: data.player2y,
        player2Health: data.player2Health,
        player1Health: data.player1Health - 10
      })
    }
    // P1 LOW KICK
    else if (data.action === "lowKickRight" && data.playerId === 1) {
      io.emit("playerAction", {
        playerId: playerId,
        action: data.action,
        player1x: data.player1x,
        player1y: data.player1y,
        player1Health: data.player1Health
      })
    }
    else if (data.action === "lowKickLeft" && data.playerId === 1) {
      io.emit("playerAction", {
        playerId: playerId,
        action: data.action,
        player1x: data.player1x,
        player1y: data.player1y,
        player1Health: data.player1Health
      })
    }
    else if (data.action === "dealLowKickDamage" && data.playerId === 1) {
      io.emit("playerAction", {
        playerId: playerId,
        action: data.action,
        player1x: data.player1x,
        player1y: data.player1y,
        player1Health: data.player1Health,
        player2Health: data.player2Health - 15
      })
    }
    // P2 LOW KICK
    else if (data.action === "lowKickRight" && data.playerId === 2) {
      io.emit("playerAction", {
        playerId: playerId,
        action: data.action,
        player2x: data.player2x,
        player2y: data.player2y,
        player2Health: data.player2Health
      })
    }
    else if (data.action === "lowKickLeft" && data.playerId === 2) {
      io.emit("playerAction", {
        playerId: playerId,
        action: data.action,
        player2x: data.player2x,
        player2y: data.player2y,
        player2Health: data.player2Health
      })
    }
    else if (data.action === "dealLowKickDamage" && data.playerId === 2) {
      io.emit("playerAction", {
        playerId: playerId,
        action: data.action,
        player2x: data.player2x,
        player2y: data.player2y,
        player2Health: data.player2Health,
        player1Health: data.player1Health - 15
      })
    }
  })
})

httpServer.listen(3000, () => {
  console.log('Server listening on port 3000');
});