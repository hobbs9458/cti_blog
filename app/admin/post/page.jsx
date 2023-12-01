'use client';

import { useState } from 'react';

import styles from './page.module.css';

export default function Post() {
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [post, setPost] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    console.log('POSTING');

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        author,
        body: post,
      }),
    };

    const res = await fetch('http://localhost:3000/api/post', requestOptions);
    const data = await res.json();
    console.log(data);

    setAuthor('');
    setTitle('');
    setPost('');
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor='author' className={styles.label}>
        Author
      </label>
      <input
        type='text'
        name='author'
        id='author'
        onChange={(e) => setAuthor(e.target.value)}
        value={author}
      />

      <label htmlFor='title' className={styles.label}>
        Title
      </label>
      <input
        type='text'
        name='title'
        id='title'
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />

      <label htmlFor='post' className={styles.label}>
        Post
      </label>
      <textarea
        name='post'
        id='post'
        cols='30'
        rows='10'
        onChange={(e) => setPost(e.target.value)}
        value={post}
      ></textarea>
      <button>Submit</button>
    </form>
  );
}
