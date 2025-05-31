import { useTranslation } from "react-i18next";

import { useQueryCategories, useQueryTrackers } from "../../hooks/query";
import { CurrentTrackingIsland } from "./CurrentTrackingIsland.tsx";
import styles from "./DashboardPage.module.css";
import { TrackerCategory } from "./TrackerCategory/TrackerCategory.tsx";
import { UNCATEGORIZED_TRACKER_ID } from "./TrackerForm/TrackerForm.tsx";

export function DashboardPage() {
  const { t } = useTranslation();
  const { data: trackers = [] } = useQueryTrackers();
  const { data: categories = [] } = useQueryCategories();
  return (
    <div className={styles.page}>
      <div className={styles.page__container}>
        <header className={styles.header}>
          <h1 className={styles.header__title}>{t("page.dashboard.title")}</h1>
        </header>
        <div className={styles.categories}>
          <TrackerCategory
            category={{
              id: UNCATEGORIZED_TRACKER_ID,
              name: t("page.trackers.uncategorized"),
              createdAt: new Date(),
              updatedAt: new Date(),
            }}
            trackers={trackers.filter(
              (tracker) => tracker.categoryId === undefined,
            )}
          />
          {categories.map((category) => (
            <TrackerCategory
              key={category.id}
              category={category}
              trackers={trackers.filter(
                (tracker) => tracker.categoryId === category.id,
              )}
            />
          ))}
        </div>
      </div>
      <CurrentTrackingIsland />
    </div>
  );
}
