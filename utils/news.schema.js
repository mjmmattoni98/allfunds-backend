import { model, Schema } from "mongoose";

const NewsSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  content: { type: String, required: true },
  author: { type: String, required: true },
  archiveDate: { type: Date, default: null },
});

const News = model("News", NewsSchema);

export { News };
