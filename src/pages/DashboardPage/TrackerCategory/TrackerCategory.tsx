import { CaretDownIcon, CaretRightIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { Button } from "../../../components";
import type {
  Tracker as TrackerType,
  TrackerCategory as TrackerCategoryType,
} from "../../../types/tracker.ts";
import { Tracker } from "../Tracker/Tracker.tsx";
import styles from "./TrackerCategory.module.css";

type TrackerCategoryProps = {
  category: TrackerCategoryType;
  trackers: TrackerType[];
};

export function TrackerCategory({ category, trackers }: TrackerCategoryProps) {
  const [expanded, setExpanded] = useState(trackers.length > 0);
  const [expandedTracker, setExpandedTracker] = useState<string>();

  return (
    <div className={styles.category}>
      <header
        role="button"
        onClick={() => setExpanded(!expanded)}
        className={styles.category__header}
      >
        {expanded ? <CaretDownIcon /> : <CaretRightIcon />}
        <span>{category.name}</span>
      </header>
      {expanded && (
        <div className={styles.category__content}>
          {!trackers.length ? (
            <div className={styles.category__empty}>
              No trackers in this category
              <Button variant="primary">Add Tracker</Button>
            </div>
          ) : (
            trackers.map((tracker) => (
              <Tracker
                key={tracker.id}
                tracker={tracker}
                expanded={expandedTracker === tracker.id}
                onToggle={() => {
                  setExpandedTracker((prev) =>
                    prev === tracker.id ? undefined : tracker.id,
                  );
                }}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
