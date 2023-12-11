import Image from 'next/image'

import styles from './AboutUs.module.css'
import pieChartImage815 from '../../public/cost_pie_chart_815.svg';
import pieChartImage600 from '../../public/cost_pie_chart_600.svg';
import pieChartImage350 from '../../public/cost_pie_chart_350.svg';

function AboutUs() {
    return (
        <>
            <h1 className={`${styles.aboutUsH1} underline`}>About Us</h1>
            <p className={styles.aboutUsP}>We are more than just a tool distribution company. We are an engineering driven, machine solutions provider. We solve our customers' problems at the spindle, saving time and money while making our customers more efficient and profitable.</p>
            <p className={styles.aboutUsP}>Our sales team is comprised of degreed engineers and those with decades of experience in the manufacturing industry, and we know that sets us apart.</p>
            <h2 className={`${styles.aboutUsH2} underline`}>Our Customers' Success Is Our Priority</h2>
            <p className={styles.aboutUsP}>Though tooling costs only account for 3&#37; of production cost, the right tools can increase overall productivity. Using the right cutting tools can decrease your actual cycle time. It also means substantial increases in overall productivity. Our technical tooling competency has helped customers double and even triple their productivity.</p>
            <Image src={pieChartImage815} width={815} height={519} className={styles.pieImg815}/>     
            <Image src={pieChartImage600} width={600} height={382} className={styles.pieImg600}/>     
            <Image src={pieChartImage350} width={350} height={223} className={styles.pieImg350}/>     
        </> 
    )
}

export default AboutUs
