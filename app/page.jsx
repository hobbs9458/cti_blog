import styles from './page.module.css';

import Articles from './components/Articles';
import AboutUs from './components/AboutUs';

export default function Home() {
  return (
    <main className={styles.mainWrap}>
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
      <div className={styles.contentWrap}>
        <AboutUs/>
        {/* <Articles /> */}
      </div>
    </main>
  );
}
