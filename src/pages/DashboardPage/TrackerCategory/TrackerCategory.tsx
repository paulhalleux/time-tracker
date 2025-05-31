import { CaretDownIcon, CaretRightIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

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
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(trackers.length > 0);
  const [expandedTracker, setExpandedTracker] = useState<string>();

  const onAddTracker = () => {
    navigate(`/trackers/new?categoryId=${category.id}`);
  };

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
              {t("page.categories.empty.noTrackers")}
              <Button variant="primary" onClick={onAddTracker}>
                {t("page.categories.addTracker")}
              </Button>
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
