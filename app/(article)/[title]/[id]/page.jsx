import { headers } from 'next/headers';
import { Blog } from '@/app/models/blogPost';

import { Interweave } from 'interweave';
// WHY IS THIS ONLY A DEV DEPENDENCY? WON'T WE ALSO NEED IN PROD?
import { polyfill } from 'interweave-ssr';
polyfill();

export default async function Article() {
  const heads = headers();
  const id = heads.get('next-url').split('/')[2];
  const article = await Blog.findById(id);

  return (
    <>
      <h1>{article.title}</h1>
      <p>By: {article.author}</p>
      <Interweave content={article} />
    </>
  );
}
