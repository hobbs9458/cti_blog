import Image from 'next/image'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.mainContainer}>
        <div className={styles.heroText}>
          <h2 className={styles.tag}>Always</h2>
          <h2 className={styles.tag}>Thinking</h2>
          <h2 className={styles.tag}>Productivity.</h2>
          <p className={styles.subTag}>Since 1969</p>
        </div>
      </div>
    </main>
  )
}
