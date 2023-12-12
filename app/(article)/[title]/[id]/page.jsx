import { headers } from 'next/headers';
import { Blog } from '@/app/models/blogPost';

import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

export default async function Article() {
  // get article from db
  const heads = headers();
  const id = heads.get('next-url').split('/')[2];
  const article = await Blog.findById(id);

  // clean markup for injection
  const window = new JSDOM('').window;
  const purify = DOMPurify(window);
  const clean = purify.sanitize(article.post);
  console.log(clean);
  const cleanMarkup = { __html: clean };

  return (
    <div style={{ margin: '0 auto', maxWidth: '75%' }}>
      <h1>{article.title}</h1>
      <p>By: {article.author}</p>
      <div dangerouslySetInnerHTML={cleanMarkup} />
    </div>
  );
}
