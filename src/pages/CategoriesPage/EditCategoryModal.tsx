import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";

import { Button, Modal } from "../../components";
import { useUpdateCategory } from "../../hooks/mutation";
import { useQueryCategory } from "../../hooks/query/use-query-category.ts";
import {
  CATEGORY_FORM_ID,
  CategoryForm,
  type CategoryFormData,
} from "./CategoryForm.tsx";

export function EditCategoryModal() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const updateCategory = useUpdateCategory();
  const category = useQueryCategory({ id });

  const onCloseModal = useCallback(() => {
    navigate("..");
  }, [navigate]);

  const onSubmit = useCallback(
    async (data: CategoryFormData) => {
      if (!id) {
        return;
      }

      await updateCategory.mutateAsync({ category: data, id });
      onCloseModal();
    },
    [updateCategory, id, onCloseModal],
  );

  return (
    <Modal size="md" onClose={onCloseModal}>
      <Modal.Header
        title={t("page.categories.edit.label")}
        description={t("page.categories.edit.description")}
        closeButton
      />
      <Modal.Body>
        {category.data && (
          <CategoryForm
            onSubmit={onSubmit}
            categoryId={id}
            disabled={updateCategory.isPending}
            defaultValues={category.data}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onCloseModal}>{t("cancel")}</Button>
        <Button
          type="submit"
          variant="primary"
          form={CATEGORY_FORM_ID}
          disabled={updateCategory.isPending}
        >
          {t("save")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
