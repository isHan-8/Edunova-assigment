import express from 'express';
import { getBooksByName, getBooksByRent, getBooksByCategory } from '../controllers/bookController';

const router = express.Router();

router.get('/search', getBooksByName);
router.get('/rent', getBooksByRent);
router.get('/filter', getBooksByCategory);

export default router;
