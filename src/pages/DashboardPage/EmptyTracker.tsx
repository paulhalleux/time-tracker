import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "../../components";
import { useCreateTracker } from "../../hooks/mutation/use-create-tracker.ts";
import { useTimeTracker } from "../../store/context.tsx";
import styles from "./EmptyTracker.module.css";

export function EmptyTracker() {
  const { t } = useTranslation();
  const tracker = useTimeTracker();

  const createTracker = useCreateTracker();

  const onStartNewTracking = useCallback(async () => {
    const newTracker = await createTracker.mutateAsync({
      tracker: {
        name: "New Tracking",
      },
    });

    await tracker.startTracking(newTracker.id);
  }, [createTracker, tracker]);

  return (
    <div className={styles["empty-tracking"]}>
      {t("page.dashboard.noCurrentTracking")}
      <Button
        disabled={createTracker.isPending}
        onClick={onStartNewTracking}
        variant="primary"
      >
        {t("page.dashboard.newTracking")}
      </Button>
    </div>
  );
}
