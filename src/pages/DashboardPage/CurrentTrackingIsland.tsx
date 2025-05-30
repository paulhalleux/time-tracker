import { useTimeTrackerStore } from "../../store/context.tsx";
import { CurrentTracker } from "./CurrentTracker/CurrentTracker.tsx";
import styles from "./CurrentTrackingIsland.module.css";
import { EmptyTracker } from "./EmptyTracker.tsx";

export function CurrentTrackingIsland() {
  const currentTrackerId = useTimeTrackerStore(
    (state) => state.instance?.trackerId,
  );

  return (
    <div className={styles.tracking__container}>
      <div className={styles["current-tracking"]}>
        {!currentTrackerId ? <EmptyTracker /> : <CurrentTracker />}
      </div>
    </div>
  );
}
