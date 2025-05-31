import { PauseIcon, PlayIcon, RowsIcon, StopIcon } from "@phosphor-icons/react";
import { clsx } from "clsx";
import { useCallback } from "react";

import { useQueryCategory, useQueryTracker } from "../../../hooks/query";
import {
  useTimeTracker,
  useTimeTrackerStore,
} from "../../../store/context.tsx";
import styles from "./CurrentTracker.module.css";

export function CurrentTracker() {
  const timeTracker = useTimeTracker();

  const currentTime = useTimeTrackerStore(
    (state) => state.instance?.duration || 0,
  );

  const isPaused = useTimeTrackerStore((state) => state.isPaused);
  const currentTrackerId = useTimeTrackerStore(
    (state) => state.instance?.trackerId,
  );

  const { data: tracker } = useQueryTracker({ id: currentTrackerId });
  const { data: category } = useQueryCategory({ id: tracker?.categoryId });

  const onStop = useCallback(async () => {
    await timeTracker.stopTracking();
  }, [timeTracker]);

  const onPauseToggle = useCallback(async () => {
    if (isPaused) {
      await timeTracker.resume();
    } else await timeTracker.pause();
  }, [isPaused, timeTracker]);

  if (!tracker) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.name}>
          {tracker.name}
          <span className={styles.category}>
            <RowsIcon />
            {category?.name || "Uncategorized"}
          </span>
        </div>
        <span className={styles.description}>{tracker.description}</span>
      </div>
      <div className={clsx(styles.time__container)}>
        {isPaused && <span className={styles.pausedText}>Paused</span>}
        <span
          className={clsx({
            [styles.paused]: isPaused,
          })}
        >
          {durationMillsToString(currentTime)}
        </span>
      </div>
      <div className={styles.actions}>
        <button
          className={clsx(styles.action, styles.pause)}
          onClick={onPauseToggle}
        >
          {isPaused ? (
            <PlayIcon size={16} weight="fill" />
          ) : (
            <PauseIcon size={16} weight="fill" />
          )}
        </button>
        <button className={clsx(styles.action, styles.stop)} onClick={onStop}>
          <StopIcon size={16} weight="fill" />
        </button>
      </div>
    </div>
  );
}

export const durationMillsToString = (duration: number): string => {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0",
  )}:${String(seconds).padStart(2, "0")}`;
};
