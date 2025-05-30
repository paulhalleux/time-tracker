import { Outlet } from "react-router";

import { Sidebar } from "../../components";
import styles from "./MainLayout.module.css";

export function MainLayout() {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.layout__content}>
        <Outlet />
      </main>
    </div>
  );
}
