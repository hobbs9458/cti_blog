import Image from 'next/image';
import Link from 'next/link';

import styles from './Footer.module.css';

import logo from '../../public/CTI-logo-svg.svg';

function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.footerContent}>
        <Link href='/'>
          <Image
            src={logo}
            width={213}
            height={28}
            className={styles.footerLogo}
            alt='cutting tools inc logo'
          ></Image>
        </Link>
        <div className={`${styles.address} ${styles.footerAddress1}`}>
          <h3 className={`${styles.addressH3}`}>Mt. Juliet TN</h3>
          <p style={{ color: '#f3f3f3' }}>(615) 391-0200</p>
          <p>
            1002 Pleasant Grove Pl, <br />
            Mt. Juliet, TN 37122
          </p>
        </div>
        <div className={`${styles.address} ${styles.footerAddress2}`}>
          <h3 className={`${styles.addressH3}`}>Louisville KY</h3>
          <p style={{ color: '#f3f3f3' }}>(502) 896-2353</p>
          <p>
            13029 Middletown Industrial Blvd, <br />
            Louisville, KY 40223
          </p>
        </div>
        <ul className={styles.footerLinksWrap}>
          <Link href='#contact' className={`${styles.footerLink}`}>
            Contact Us
          </Link>
          <Link
            href='https://online.fliphtml5.com/yzmoq/zvqa/#p=1'
            className={`${styles.footerLink}`}
            target='_blank'
          >
            Brochure
          </Link>
          <Link href='/store' className={`${styles.footerLink}`}>
            Store
          </Link>
          <Link href='/privacy' className={`${styles.footerLink}`}>
            Privacy Policy
          </Link>
          <Link href='/return' className={`${styles.footerLink}`}>
            Return Policy
          </Link>
        </ul>
      </div>
    </div>
  );
}

export default Footer;
