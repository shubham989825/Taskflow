import { Response } from "express";
import Board from "../models/Board";
import { AuthRequest } from "../middleware/authMiddleware";

 
export const createBoard = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { name, description } = req.body;

    const board = await Board.create({
      name,
      description,
      owner: req.userId,
      members: [req.userId],
    });

    return res.status(201).json(board);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

 
export const getBoards = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }
    
    const boards = await Board.find({
      members: req.userId,
    });

    return res.status(200).json(boards);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteBoard = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const board = await Board.findOne({
      _id: req.params.boardId,
      owner: req.userId,
    });

    if (!board) {
      return res.status(404).json({ message: "Board not found or not authorized" });
    }

    await Board.findByIdAndDelete(req.params.boardId);

    return res.status(200).json({ message: "Board deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};