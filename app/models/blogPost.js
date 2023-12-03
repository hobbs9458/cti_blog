import mongoose from 'mongoose';
const { Schema } = mongoose;

const blogSchema = new Schema({
  title: String, // String is shorthand for {type: String}
  author: String,
  post: String,
  blogPreviewImg: String,
  date: { type: Date, default: Date.now() },
});

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

export { Blog };
