import { Request, Response } from 'express';
import Book from '../models/Book';

export const getBooksByName = async (req: Request, res: Response) => {
  const { term } = req.query;
  const books = await Book.find({ bookName: new RegExp(term as string, 'i') });
  res.json(books);
};

export const getBooksByRent = async (req: Request, res: Response) => {
  const { min, max } = req.query;
  const books = await Book.find({ rentPerDay: { $gte: min, $lte: max } });
  res.json(books);
};

export const getBooksByCategory = async (req: Request, res: Response) => {
  const { category, term, minRent, maxRent } = req.query;
  const books = await Book.find({
    category,
    bookName: new RegExp(term as string, 'i'),
    rentPerDay: { $gte: minRent, $lte: maxRent }
  });
  res.json(books);
};
