'use client';

import { useState } from 'react';

import styles from './page.module.css';

import Quill from '@/app/components/Quill';

export default function Post() {
  const [quillValue, setQuillValue] = useState('');

  const [formData, setFormData] = useState({
    author: '',
    title: '',
    blogPreviewImg: null,
  });

  function handleInputChange(e) {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const formDataToSend = new FormData();

    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    formDataToSend.append('post', quillValue);

    const requestOptions = {
      method: 'POST',
      body: formDataToSend,
    };

    console.log('form DATA', formDataToSend);

    const res = await fetch('http://localhost:3000/api/post', requestOptions);
    const data = await res.json();
    console.log('DATA', data);

    setFormData((prevFormData) => {
      const newFormData = { ...prevFormData };

      for (const key in newFormData) {
        newFormData[key] = '';
      }

      return newFormData;
    });

    setQuillValue(null);
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
        onChange={handleInputChange}
        value={formData.author}
      />

      <label htmlFor='title' className={styles.label}>
        Title
      </label>
      <input
        type='text'
        name='title'
        id='title'
        onChange={handleInputChange}
        value={formData.title}
      />

      <br></br>

      <label htmlFor='blogPreviewImg'>Choose a preview photo for post:</label>
      <input
        type='file'
        id='blogPreviewImg'
        name='blogPreviewImg'
        accept='image/png, image/jpeg'
        onChange={handleInputChange}
      />

      <Quill setQuillValue={setQuillValue} quillValue={quillValue} />
      <button>Submit</button>
    </form>
  );
}
