import Image from 'next/image';
import styles from './page.module.css';

export default function Home() {
  return (
    <main>
      <div className={styles.heroWrap}>
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <h2 className={styles.tag}>Always</h2>
            <h2 className={styles.tag}>Thinking</h2>
            <h2 className={styles.tag}>Productivity.</h2>
            <p className={styles.subTag}>Since 1969</p>
          </div>
        </section>
      </div>
      <section className={styles.articles}>
        <h1 className={styles.articlesHeader}>Articles</h1>
      </section>
    </main>
  );
}
