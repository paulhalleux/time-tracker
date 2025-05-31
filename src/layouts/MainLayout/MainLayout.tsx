import { AnimatePresence } from "motion/react";
import { Outlet, Route, Routes, useLocation } from "react-router";

import { Sidebar } from "../../components";
import { CreateTrackerModal } from "../../pages/DashboardPage/CreateTrackerModal.tsx";
import { EditTrackerModal } from "../../pages/DashboardPage/EditTrackerModal.tsx";
import styles from "./MainLayout.module.css";

export function MainLayout() {
  const location = useLocation();
  return (
    <div className={styles.layout}>
      <AnimatePresence>
        <Routes location={location} key={location.key}>
          <Route path="/trackers/new" element={<CreateTrackerModal />} />
          <Route path="/trackers/:id/edit" element={<EditTrackerModal />} />
        </Routes>
      </AnimatePresence>
      <Sidebar />
      <main className={styles.layout__content}>
        <Outlet />
      </main>
    </div>
  );
}
