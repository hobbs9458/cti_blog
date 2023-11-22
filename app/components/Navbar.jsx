import Image from 'next/image'
import Link from 'next/link'


import logo from '../../public/CTI-logo-svg.svg'

import styles from './navbar.module.css'

function Navbar() {
    return (
        <nav className={styles.nav}>
            <div className={styles.navContainer}>
                <div className="logo">
                    <Image src={logo} width={213} height={28} />
                </div>
                <ul className={styles.navMenu}>
                    <li className={styles.li}>
                        <Link href="https://cuttingtoolsinc.com" target="_blank" className={styles.link}>Newsletter</Link>
                    </li>
                    <li className={styles.li}>
                        <Link href="https://cuttingtoolsinc.com" target="_blank" className={styles.link}>Articles</Link>
                    </li>
                    <li className={styles.li}>
                        <Link href="https://cuttingtoolsinc.com" target="_blank" className={styles.link}>Shop</Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar
