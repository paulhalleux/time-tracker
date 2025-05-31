import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";

import { Button, Modal } from "../../components";
import { useCreateTracker } from "../../hooks/mutation";
import {
  TRACKER_FORM_ID,
  TrackerForm,
  type TrackerFormData,
} from "./TrackerForm/TrackerForm.tsx";

export function CreateTrackerModal() {
  const { t } = useTranslation();
  const [search] = useSearchParams();

  const navigate = useNavigate();
  const createTracker = useCreateTracker();

  const onCloseModal = useCallback(() => {
    navigate("..");
  }, [navigate]);

  const onSubmit = useCallback(
    async (data: TrackerFormData) => {
      await createTracker.mutateAsync({
        tracker: {
          ...data,
          categoryId:
            data.categoryId === "uncategorized" ? undefined : data.categoryId,
        },
      });
      onCloseModal();
    },
    [createTracker, onCloseModal],
  );

  return (
    <Modal size="md" onClose={onCloseModal}>
      <Modal.Header
        title={t("page.trackers.create.label")}
        description={t("page.trackers.create.description")}
        closeButton
      />
      <Modal.Body>
        <TrackerForm
          onSubmit={onSubmit}
          trackerId={undefined}
          disabled={createTracker.isPending}
          defaultValues={{
            name: "",
            description: "",
            categoryId: search.get("categoryId") || undefined,
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onCloseModal}>{t("cancel")}</Button>
        <Button
          type="submit"
          variant="primary"
          form={TRACKER_FORM_ID}
          disabled={createTracker.isPending}
        >
          {t("save")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
