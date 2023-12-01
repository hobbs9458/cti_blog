async function getData() {
  'fetching';
  const res = await fetch('http:localhost:3000/api/post', {
    next: {
      revalidate: 0,
    },
  });

  console.log('response', res);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export default async function Articles() {
  const data = await getData();

  console.log(data);

  const posts = data.map((post) => {
    console.log(post._id);
    return <div key={post._id}>{post.body}</div>;
  });

  return posts;
}
