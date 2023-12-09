import styles from './ArticlePreview.module.css';

import Link from 'next/link';

export default function ArticlePreview({ post }) {
  const title = post.title.trim().toLowerCase().split(' ').join('-');

  return (
    <Link href={`/${title}/${post._id}`} className={styles.previewLink}>
      <div className={styles.articlePreview}>
        <h1 className={styles.previewTitle}>{post.title}</h1>
      </div>
    </Link>
  );
}
