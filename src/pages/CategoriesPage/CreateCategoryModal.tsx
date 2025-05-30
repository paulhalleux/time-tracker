import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { Button, Modal } from "../../components";
import { useCreateCategory } from "../../hooks/mutation";
import {
  CATEGORY_FORM_ID,
  CategoryForm,
  type CategoryFormData,
} from "./CategoryForm.tsx";

export function CreateCategoryModal() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const createCategory = useCreateCategory();

  const onCloseModal = useCallback(() => {
    navigate("..");
  }, [navigate]);

  const onSubmit = useCallback(
    async (data: CategoryFormData) => {
      await createCategory.mutateAsync({ category: data });
      onCloseModal();
    },
    [createCategory, onCloseModal],
  );

  return (
    <Modal size="md" onClose={onCloseModal}>
      <Modal.Header
        title={t("page.categories.create.label")}
        description={t("page.categories.create.description")}
        closeButton
      />
      <Modal.Body>
        <CategoryForm
          onSubmit={onSubmit}
          categoryId={undefined}
          disabled={createCategory.isPending}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onCloseModal}>{t("cancel")}</Button>
        <Button
          type="submit"
          variant="primary"
          form={CATEGORY_FORM_ID}
          disabled={createCategory.isPending}
        >
          {t("save")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
