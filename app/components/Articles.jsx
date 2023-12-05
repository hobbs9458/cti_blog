import ArticlePreview from './ArticlePreview';

async function getData() {
  'fetching';
  const res = await fetch('http:localhost:3000/api/post', {
    next: {
      revalidate: 0,
    },
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export default async function Articles() {
  const data = await getData();
  console.log(data)
  const posts = data.map((post) => {
    return <ArticlePreview key={post._id} post={post} />;
  });

  return posts;
}
