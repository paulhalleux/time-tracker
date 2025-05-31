import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";

import { Button, Modal } from "../../components";
import { useUpdateTracker } from "../../hooks/mutation";
import { useQueryTracker } from "../../hooks/query";
import {
  TRACKER_FORM_ID,
  TrackerForm,
  type TrackerFormData,
} from "./TrackerForm/TrackerForm.tsx";

export function EditTrackerModal() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const updateTracker = useUpdateTracker();
  const tracker = useQueryTracker({ id });

  const onCloseModal = useCallback(() => {
    navigate("..");
  }, [navigate]);

  const onSubmit = useCallback(
    async (data: TrackerFormData) => {
      if (!id) {
        return;
      }

      await updateTracker.mutateAsync({
        tracker: {
          ...data,
          categoryId:
            data.categoryId === "uncategorized" ? undefined : data.categoryId,
        },
        id,
      });
      onCloseModal();
    },
    [updateTracker, id, onCloseModal],
  );

  return (
    <Modal size="md" onClose={onCloseModal}>
      <Modal.Header
        title={t("page.trackers.edit.label")}
        description={t("page.trackers.edit.description")}
        closeButton
      />
      <Modal.Body>
        {tracker.data && (
          <TrackerForm
            onSubmit={onSubmit}
            trackerId={id}
            disabled={updateTracker.isPending}
            defaultValues={tracker.data}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onCloseModal}>{t("cancel")}</Button>
        <Button
          type="submit"
          variant="primary"
          form={TRACKER_FORM_ID}
          disabled={updateTracker.isPending}
        >
          {t("save")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
