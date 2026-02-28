import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes';
import { protect } from "./middleware/authMiddleware";
import boardRoutes from './routes/boardRoutes';
import taskRoutes from './routes/taskRoutes';
import { errorHandler } from './middleware/errorMiddleware';

dotenv.config();
const app = express();
const server = http.createServer(app);

 export const io = new Server(server, {
    cors: {
        origin: "*",
    },
});
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinBoard", (boardId: string) => {
    socket.join(boardId);
    console.log(`User joined board ${boardId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use(
  cors({
    origin: process.env.FRONTEND_URI, // frontend URL
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "You accessed protected route" });
});
app.use('/api/boards', boardRoutes);
app.use("/api/tasks", taskRoutes);
app.use(errorHandler)

mongoose.connect(process.env.MONGO_URI as string)
.then(() => console.log('connected to MongoDB'))
.catch((err) => console.log(err));

app.get('/', (req, res) => {
    res.send("API is running.....");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});