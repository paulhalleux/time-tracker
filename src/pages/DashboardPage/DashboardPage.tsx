import { useQueryCategories } from "../../hooks/query";
import { useQueryTrackers } from "../../hooks/query/use-query-trackers.ts";
import { CurrentTrackingIsland } from "./CurrentTrackingIsland.tsx";
import styles from "./DashboardPage.module.css";
import { TrackerCategory } from "./TrackerCategory/TrackerCategory.tsx";

export function DashboardPage() {
  const { data: trackers = [] } = useQueryTrackers();
  const { data: categories = [] } = useQueryCategories();
  return (
    <div className={styles.page}>
      <div className={styles.page__container}>
        <header className={styles.header}>
          <h1 className={styles.header__title}>Dashboard</h1>
        </header>
        {categories.length > 0 && (
          <div className={styles.categories}>
            <TrackerCategory
              category={{
                id: "uncategorized",
                name: "Uncategorized",
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
        )}
      </div>
      <CurrentTrackingIsland />
    </div>
  );
}
