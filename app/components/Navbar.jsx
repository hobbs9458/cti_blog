'use client';

import Image from 'next/image';
import Link from 'next/link';

import logo from '../../public/CTI-logo-svg.svg';
import hamburgerMenuIcon from '../../public/hamburger_menu.png';

import styles from './navbar.module.css';
import { useState, useRef, useEffect } from 'react';

function Navbar() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const mobileNavRef = useRef(null);

  const handleOutsideClick = function (e) {
    if (mobileNavRef.current && !mobileNavRef.current.contains(e.target)) {
      setIsMobileNavOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <div className='logo'>
            <Link href='/'>
              <Image
                src={logo}
                width={213}
                height={28}
                alt={'Cutting Tools Inc Logo'}
                />
            </Link>
          </div>
          <ul className={styles.navMenu}>
            <li className={styles.li}>
              <Link
                href='https://cuttingtoolsinc.com'
                target='_blank'
                className={styles.link}
              >
                Newsletter
              </Link>
            </li>
            <li className={styles.li}>
              <Link
                href='https://cuttingtoolsinc.com'
                target='_blank'
                className={styles.link}
              >
                Articles
              </Link>
            </li>
            <li className={styles.li}>
              <Link
                href='https://cuttingtoolsinc.com'
                target='_blank'
                className={styles.link}
              >
                Shop
              </Link>
            </li>
          </ul>
          <Image
            src={hamburgerMenuIcon}
            width={47}
            height={28}
            alt={'Hamburger Menu Icon'}
            className={styles.hamburgerIcon}
            onClick={() => setIsMobileNavOpen((prevState) => !prevState)}
          />
        </div>

        {isMobileNavOpen && (
          <div className={styles.overlay}>
            <div className={styles.mobileNav} ref={mobileNavRef}>
              <ul className={styles.mobileNavMenu}>
                <li className={styles.liMobile}>
                  <Link
                    href='https://cuttingtoolsinc.com'
                    target='_blank'
                    className={styles.link}
                  >
                    Newsletter
                  </Link>
                </li>
                <li className={styles.liMobile}>
                  <Link
                    href='https://cuttingtoolsinc.com'
                    target='_blank'
                    className={styles.link}
                  >
                    Articles
                  </Link>
                </li>
                <li className={styles.liMobile}>
                  <Link
                    href='https://cuttingtoolsinc.com'
                    target='_blank'
                    className={styles.link}
                  >
                    Shop
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
