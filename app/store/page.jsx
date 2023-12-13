import styles from "./Store.module.css";
import maintenanceMan from "../../public/maintenance-image.jpg";

import Image from "next/image";
import Link from "next/link";

function Store() {
  return (
    <main className={styles.maintenanceContentWrap}>
      <Image
        src={maintenanceMan}
        className={styles.maintenanceMan}
        width={247}
        height={252}
        alt="maintenance man"
      />
      <h1 className={styles.maintenanceH1}>
        Our store is currently undergoing maintenance and should be back soon.
        You can find our brochure{" "}
        <Link
          href="https://online.fliphtml5.com/yzmoq/zvqa/#p=1"
          className="link"
          target="_blank"
        >
          here
        </Link>{" "}
        or{" "}
        <Link href="/#contact" className="link">
          contact
        </Link>{" "}
        us today.
      </h1>
    </main>
  );
}

export default Store;
