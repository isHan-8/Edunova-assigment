import express from 'express';
import { issueBook, returnBook, getBookHistory, getTotalRent, getIssuedBooks, getIssuedBooksByDateRange } from '../controllers/transactionController';

const router = express.Router();

router.post('/issue', issueBook);
router.post('/return', returnBook);
router.get('/history/:bookName', getBookHistory);
router.get('/totalRent/:bookName', getTotalRent);
router.get('/user/:userId', getIssuedBooks);
router.get('/dateRange', getIssuedBooksByDateRange);

export default router;
