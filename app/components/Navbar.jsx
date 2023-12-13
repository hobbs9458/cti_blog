"use client";

import Image from "next/image";
import Link from "next/link";

import logo from "../../public/CTI-logo-svg.svg";
import hamburgerMenuIcon from "../../public/hamburger_menu.png";
import closeMobileNavX from "../../public/close_x.png";

import styles from "./navbar.module.css";
import { useState, useRef, useEffect } from "react";

function Navbar() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const mobileNavRef = useRef(null);

  const handleOutsideClick = function (e) {
    if (mobileNavRef.current && !mobileNavRef.current.contains(e.target)) {
      setIsMobileNavOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <div className="logo">
            <Link href="/">
              <Image
                src={logo}
                width={213}
                height={28}
                alt="Cutting Tools Inc Logo"
                tabIndex={0}
              />
            </Link>
          </div>
          <ul className={styles.navMenu}>
            <li className={styles.li}>
              <Link
                href="https://online.fliphtml5.com/yzmoq/zvqa/#p=1"
                target="_blank"
                className={`${styles.link} ${styles.desktopLi}`}
              >
                Brochure
              </Link>
            </li>
            <li className={styles.li}>
              <Link
                href="/store"
                target="_blank"
                className={`${styles.link} ${styles.desktopLi}`}
              >
                Store
              </Link>
            </li>
            <li className={styles.li}>
              <Link
                href="/#contact"
                className={`${styles.link} ${styles.desktopLi}`}
              >
                Contact Us
              </Link>
            </li>
          </ul>
          <Image
            src={hamburgerMenuIcon}
            width={47}
            height={28}
            alt="Hamburger Menu Icon"
            className={styles.hamburgerIcon}
            onClick={() => setIsMobileNavOpen((prevState) => !prevState)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                setIsMobileNavOpen((prevState) => !prevState);
              }
            }}
            tabIndex={0}
          />
        </div>

        {isMobileNavOpen && (
          <div className={styles.overlay}>
            <div className={styles.mobileNav} ref={mobileNavRef}>
              <ul className={styles.mobileNavMenu}>
                <li className={styles.liMobile}>
                  <Link
                    href="https://online.fliphtml5.com/yzmoq/zvqa/#p=1"
                    target="_blank"
                    className={styles.link}
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    Brochure
                  </Link>
                </li>
                <li className={styles.liMobile}>
                  <Link
                    href="#contact"
                    className={styles.link}
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    Contact Us
                  </Link>
                </li>
                <li className={styles.liMobile}>
                  <Link
                    href="/store"
                    target="_blank"
                    className={styles.link}
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    Store
                  </Link>
                </li>
                <Image
                  src={closeMobileNavX}
                  alt="close nav menu button"
                  width={33}
                  height={33}
                  className={styles.closeMobileNavX}
                  onClick={() => setIsMobileNavOpen(false)}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      setIsMobileNavOpen(false);
                    }
                  }}
                  tabIndex={0}
                />
              </ul>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
