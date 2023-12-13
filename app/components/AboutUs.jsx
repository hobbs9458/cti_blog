import Image from 'next/image';
import Link from 'next/link';

import styles from './AboutUs.module.css';

import pieChartImage815 from '../../public/cost_pie_chart_815.svg';
import metalTool815 from '../../public/metal_tool815.jpg';

function AboutUs() {
  return (
    <div className={styles.aboutUsWrap}>
      <h1 className={`${styles.aboutUsH1}`}>About Us</h1>
      <p className={styles.aboutUsP}>
        Founded in 1969 under the motto of &quot;Always Thinking
        Productivity&quot;, Cutting Tools Inc. is the premier distributor and
        machine solutions provider for the Automotive, Aerospace, Defense,
        Energy, Firearms, and Medical manufacturing industries.
      </p>
      <p className={styles.aboutUsP}>
        After more than 50 years of experience and proven excellence, we are
        more than just a distributor for our customers, we are a business
        partner. Our focus is on cost saving sand ensuring our customers are
        more profitable by manufacturing their parts in less time and at less
        cost.
      </p>
      <p className={styles.aboutUsP}>
        We are an engineering driven, machine solutions provider and we solve
        our customer&apos; problems at the spindle, saving time and money while
        making them more efficient and profitable.Our sales team is comprised of
        degreed engineers and those with decades of experience in the
        manufacturing industry, and we know that sets us apart.
      </p>
      <h2 className={`${styles.aboutUsH2}`}>
        Our Customers&apos; Success Is Our Priority
      </h2>
      <p className={styles.aboutUsP}>
        Though tooling costs only account for 3&#37; of production cost, the
        right tools can increase overall productivity. Using the right cutting
        tools can decrease your actual cycle time. It also means substantial
        increases in overall productivity and saving costs in other areas. Our
        technical tooling competency has helped customers double and even triple
        their productivity while saving them time and money.
      </p>
      <div className={styles.imgWrap}>
        <Image
          src={pieChartImage815}
          fill
          className={styles.pieImg815}
          alt='pie chart showing only 3% of cost is on tooling'
          sizes='(max-width: 460px) 337px,(max-width: 687px) 400px,(max-width: 897px) 600px, 815px'
        />
      </div>
      <Link href='/what-we-do' className='link'>
        <h2 className={`${styles.aboutUsH2}`}>What We Do</h2>
      </Link>
      <p className={styles.aboutUsP}>
        From turn-key tool setup and CNC programming to coolant management and
        engineering consulting, we&#39;ve got your machining needs covered. Our
        expertise extends to tool reconditioning, ball screw repair, gaging,
        metrology, MRO, and inventory management. Click{' '}
        <Link href='/what-we-do' className='link-underline link'>
          here
        </Link>{' '}
        for more details on the services we provide and{' '}
        <Link href='#contact' className='link-underline link'>
          contact Cutting Tools Inc.
        </Link>{' '}
        to see how we can optimize your operations.
      </p>
      <div className={styles.imgWrap}>
        <Image
          src={metalTool815}
          fill
          alt='metal tool'
          sizes='(max-width: 460px) 337px,(max-width: 687px) 400px,(max-width: 897px) 600px, 815px'
        />
      </div>
    </div>
  );
}

export default AboutUs;
