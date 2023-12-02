import styles from './ArticlePreview.module.css';

export default function ArticlePreview({ post }) {
  return (
    <a className={styles.previewLink}>
      <div className={styles.articlePreview}>
        <h1 className={styles.previewTitle}>{post.title}</h1>
      </div>
    </a>
  );
}
