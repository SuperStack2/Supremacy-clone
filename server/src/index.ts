import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());

// Verbinde zur MongoDB
mongoose
  .connect('MONGODB_CONNECTION_STRING')
  .then(() => console.log('MongoDB connected'))
  .catch((err: Error) => console.log(err));

// Socket.io Verbindung
io.on('connection', (socket: Socket) => {
  console.log('Ein Benutzer hat sich verbunden');
});

// Starte den Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});