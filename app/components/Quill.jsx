'use client';
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from './Quill.module.css';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'image'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
];

export default function Quill({ quillValue, setQuillValue }) {
  const ReactQuill = useMemo(
    () => dynamic(() => import('react-quill'), { ssr: false }),
    []
  );

  return (
    <ReactQuill
      className={styles.quill}
      theme='snow'
      modules={modules}
      formats={formats}
      value={quillValue}
      onChange={setQuillValue}
    />
  );
}
