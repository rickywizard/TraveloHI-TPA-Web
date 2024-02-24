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
  console.log('Player connected:', socket.id);

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
    socket.broadcast.emit("globalMessage", {
      player1x: data.player1x,
      player1y: data.player1y,
      player2x: data.player2x,
      player2y: data.player2y,
      action: data.action,
      player1Health: data.player1Health,
      player2Health: data.player2Health,
    })

    console.log(`player ${data.playerId} posX: ${data.player1x}, posY: ${data.player1y}, action: ${data.action}`);
    

  })
})

httpServer.listen(3000, () => {
  console.log('Server listening on port 3000');
});