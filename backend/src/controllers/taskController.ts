import { Response } from "express";
import Task from "../models/Task";
import { AuthRequest } from "../middleware/authMiddleware";
import { io } from "../index";

export const createTask = async (req: AuthRequest, res: Response, ) => {
    try {
        if (!req.userId) {
            return res.status(401).json({message: "Not authorized"});
        }
        const {title, description, dueDate} = req.body;
        const {boardId} = req.params;

        const task = await Task.create({
            title,
            description,
            board: boardId,
            dueDate,
        });

        io.to(boardId).emit("taskCreated", task);

        return res.status(201).json(task);
    } catch (error) {
        return res.status(500).json({message: "server error"});
    
    };
}

export const getTasks = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.userId) {
            return res.status(401).json({message: "Not authorized"});
}
    const {boardId} = req.params;
    const tasks = await Task.find({board: boardId});

    return res.status(200).json(tasks);
    }
    catch (error) {
        return res.status(500).json({message: "server error"});
    }
};

//.....................................................

export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    io.to(task.board.toString()).emit("taskUpdated", task);

    return res.status(200).json(task);

  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
//..........................................................

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const task = await Task.findByIdAndDelete(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    io.to(task.board.toString()).emit("taskDeleted", task._id);

    return res.status(200).json({ message: "Task deleted" });

  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};