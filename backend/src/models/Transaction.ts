import mongoose, { Schema, Document } from 'mongoose';

interface ITransaction extends Document {
  bookName: string;
  userId: mongoose.Types.ObjectId;
  issueDate: Date;
  returnDate?: Date;
  rent: number;
}

const TransactionSchema: Schema = new Schema({
  bookName: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  issueDate: { type: Date, required: true },
  returnDate: { type: Date },
  rent: { type: Number, required: true }
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
