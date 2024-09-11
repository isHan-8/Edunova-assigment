import { Request, Response } from 'express';
import Transaction from '../models/Transaction';
import Book from '../models/Book';
import User from '../models/User';

const calculateRent = (issueDate: Date, returnDate: Date, rentPerDay: number): number => {
  const diffTime = Math.abs(returnDate.getTime() - issueDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays * rentPerDay;
};

export const issueBook = async (req: Request, res: Response) => {
  const { bookName, userId, issueDate } = req.body;
  
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  
  const transaction = new Transaction({ bookName, userId, issueDate, rent: 0 });
  await transaction.save();
  
  res.status(201).json(transaction);
};

export const returnBook = async (req: Request, res: Response) => {
  const { bookName, userId, returnDate } = req.body;
  
  const transaction = await Transaction.findOne({ bookName, userId, returnDate: { $exists: false } });
  if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
  
  const book = await Book.findOne({ bookName });
  if (!book) return res.status(404).json({ message: 'Book not found' });
  
  transaction.returnDate = returnDate;
  transaction.rent = calculateRent(transaction.issueDate, returnDate, book.rentPerDay);
  await transaction.save();
  
  res.json(transaction);
};

export const getBookHistory = async (req: Request, res: Response) => {
  const { bookName } = req.params;
  const transactions = await Transaction.find({ bookName });
  
  const currentlyIssued = transactions.find(t => !t.returnDate);
  const history = {
    issuedCount: transactions.length,
    currentlyIssued: currentlyIssued ? await User.findById(currentlyIssued.userId) : 'Not Issued'
  };
  
  res.json(history);
};

export const getTotalRent = async (req: Request, res: Response) => {
  const { bookName } = req.params;
  const transactions = await Transaction.find({ bookName });
  
  const totalRent = transactions.reduce((total, t) => total + t.rent, 0);
  res.json({ totalRent });
};

export const getIssuedBooks = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const transactions = await Transaction.find({ userId, returnDate: { $exists: false } });
  
  const bookNames = transactions.map(t => t.bookName);
  res.json(bookNames);
};

export const getIssuedBooksByDateRange = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  const transactions = await Transaction.find({
    issueDate: { $gte: new Date(startDate as string), $lte: new Date(endDate as string) }
  }).populate('userId');
  
  res.json(transactions.map(t => ({
    bookName: t.bookName,
    issuedTo: t.userId,
    issueDate: t.issueDate
  })));
};
