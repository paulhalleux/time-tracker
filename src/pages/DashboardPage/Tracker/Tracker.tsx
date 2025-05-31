import {
  ArrowRightIcon,
  CaretDownIcon,
  CaretRightIcon,
  PlayIcon,
  StopIcon,
} from "@phosphor-icons/react";
import { clsx } from "clsx";
import * as React from "react";
import { useCallback } from "react";
import { useNavigate } from "react-router";

import { Button, confirm } from "../../../components";
import { useDeleteTracker } from "../../../hooks/mutation";
import { useQueryTrackerInstances } from "../../../hooks/query";
import {
  useTimeTracker,
  useTimeTrackerStore,
} from "../../../store/context.tsx";
import type { Tracker as TrackerType } from "../../../types/tracker.ts";
import { durationMillsToString } from "../CurrentTracker/CurrentTracker.tsx";
import styles from "./Tracker.module.css";

const DateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

type TrackerProps = {
  tracker: TrackerType;
  expanded?: boolean;
  onToggle?: () => void;
};

export function Tracker({ tracker, expanded, onToggle }: TrackerProps) {
  const navigate = useNavigate();
  const timeTracker = useTimeTracker();
  const isActive = useTimeTrackerStore(
    (state) => state.instance?.trackerId === tracker.id,
  );

  const { data: instances = [] } = useQueryTrackerInstances({
    trackerId: tracker.id,
  });
  const deleteTracker = useDeleteTracker();

  const onStart = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      return timeTracker.startTracking(tracker.id);
    },
    [timeTracker, tracker.id],
  );

  const onStop = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      return timeTracker.stopTracking();
    },
    [timeTracker],
  );

  const onDelete = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();

      try {
        await confirm({
          title: "Delete Tracker",
          description: "Are you sure you want to delete this tracker?",
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          confirmButtonVariant: "danger",
        });
        if (isActive) {
          await timeTracker.stopTracking();
        }
        return deleteTracker.mutate(tracker);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        /* empty */
      }
    },
    [deleteTracker, isActive, timeTracker, tracker],
  );

  const onEdit = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      navigate(`/trackers/${tracker.id}/edit`);
    },
    [navigate, tracker.id],
  );

  return (
    <div>
      <div
        className={clsx(styles.tracker, {
          [styles["tracker--active"]]: isActive,
          [styles["tracker--expanded"]]: expanded,
        })}
      >
        <header
          role="button"
          className={styles.tracker__header}
          onClick={onToggle}
        >
          {expanded ? <CaretDownIcon /> : <CaretRightIcon />}
          <div className={styles.tracker__title}>
            <h3 className={styles.tracker__name}>{tracker.name}</h3>
            {tracker.description && (
              <span className={styles.tracker__description}>
                {tracker.description}
              </span>
            )}
          </div>
          <span className={styles.tracker__time}>
            {durationMillsToString(
              instances.reduce(
                (total, instance) => total + instance.duration,
                0,
              ),
            )}
          </span>
          <div>
            {!isActive && (
              <Button.Icon size="sm" onClick={onStart}>
                <PlayIcon />
              </Button.Icon>
            )}
            {isActive && (
              <Button.Icon size="sm" onClick={onStop} variant="danger">
                <StopIcon />
              </Button.Icon>
            )}
          </div>
        </header>
        {expanded && (
          <div className={styles.tracker__content}>
            {instances.length === 0 ? (
              <div className={styles.tracker__empty}>
                No tracker data available yet. Start tracking to see your time.
                <Button variant="primary" onClick={onStart}>
                  Start Tracking
                </Button>
              </div>
            ) : (
              <div className={styles.tracker__instances}>
                {instances.map((instance, index, self) => (
                  <div key={instance.id} className={styles.tracker__instance}>
                    <span>#{self.length - index}</span>
                    <span className={styles.date}>
                      {DateFormatter.format(instance.startTime)}
                    </span>
                    {instance.endTime && (
                      <>
                        <ArrowRightIcon size={12} />
                        <span className={styles.date}>
                          {DateFormatter.format(instance.endTime)}
                        </span>
                      </>
                    )}
                    <span className={styles.time}>
                      {durationMillsToString(instance.duration)}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <footer className={styles.tracker__footer}>
              <Button size="sm" variant="secondary" onClick={onEdit}>
                Edit
              </Button>
              <Button size="sm" variant="danger" onClick={onDelete}>
                Delete
              </Button>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
}
