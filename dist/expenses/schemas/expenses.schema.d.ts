import mongoose from 'mongoose';
export declare class Expense {
    category: string;
    productName: string;
    img: string;
    price: number;
    author: mongoose.Schema.Types.ObjectId;
}
export declare const expenseSchema: mongoose.Schema<Expense, mongoose.Model<Expense, any, any, any, mongoose.Document<unknown, any, Expense, any> & Expense & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Expense, mongoose.Document<unknown, {}, mongoose.FlatRecord<Expense>, {}> & mongoose.FlatRecord<Expense> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
