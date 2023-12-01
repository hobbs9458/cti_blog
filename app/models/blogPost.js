import mongoose from 'mongoose';
const { Schema } = mongoose;

const blogSchema = new Schema({
  title: String, // String is shorthand for {type: String}
  author: String,
  body: String,
  date: { type: Date, default: Date.now() },
});

const Blog = mongoose.model('Blog', blogSchema);

export { Blog };
