import LogoutBtn from "@/app/components/LogoutBtn";

import styles from "./logout.module.css";

export default function Logout() {
  return (
    <div className={styles.logout}>
      <LogoutBtn />
    </div>
  );
}
