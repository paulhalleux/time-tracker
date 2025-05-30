import { zodResolver } from "@hookform/resolvers/zod";
import type { TFunction } from "i18next";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";

import { Field, Input } from "../../components";
import { useQueryCategories } from "../../hooks/query";
import type { TrackerCategory } from "../../types/tracker.ts";
import styles from "./CategoryForm.module.css";

export const CATEGORY_FORM_ID = "category-form";

const CategorySchema = (
  t: TFunction,
  currentCategory: string | undefined,
  existingCategories: TrackerCategory[],
) => {
  return z
    .object({
      name: z.string().min(1, t("validation.category.name.required")),
      description: z.string().optional(),
    })
    .refine(
      (data) => {
        return existingCategories.every(
          (category) =>
            category.name !== data.name || category.id === currentCategory,
        );
      },
      {
        path: ["name"],
        message: t("validation.category.name.unique"),
      },
    );
};

export type CategoryFormData = z.infer<ReturnType<typeof CategorySchema>>;

type CategoryFormProps = {
  disabled: boolean;
  categoryId: string | undefined;
  defaultValues?: CategoryFormData;
  onSubmit: (data: CategoryFormData) => void;
};

export function CategoryForm({
  disabled,
  defaultValues,
  categoryId,
  onSubmit,
}: CategoryFormProps) {
  const { t } = useTranslation();
  const { data: categories = [] } = useQueryCategories();

  const form = useForm({
    resolver: zodResolver(CategorySchema(t, categoryId, categories)),
    defaultValues,
  });

  return (
    <form
      className={styles.form}
      id={CATEGORY_FORM_ID}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Field control={form.control} name="name" label="Name" required>
        <Input
          type="text"
          disabled={disabled}
          id="name"
          autoFocus
          {...form.register("name")}
        />
      </Field>
      <Field control={form.control} name="description" label="Description">
        <Input
          type="text"
          disabled={disabled}
          id="description"
          {...form.register("description")}
        />
      </Field>
    </form>
  );
}
