import styles from "./page.module.css";

import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";

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
        <AboutUs />
        <ContactUs />
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3220.7185353106324!2d-86.52049882364092!3d36.173403302780166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x886415adfe7e4757%3A0xe3e92b44b109cb56!2sCutting%20Tools%20Inc.!5e0!3m2!1sen!2sus!4v1702479313770!5m2!1sen!2sus"
          width="600"
          height="450"
          style={{ border: "0", width: "100%", margin: "0 auto 3rem" }}
          loading="lazy"
          className={styles.map}
        ></iframe>
      </div>
    </main>
  );
}
