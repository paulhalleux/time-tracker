import { zodResolver } from "@hookform/resolvers/zod";
import type { TFunction } from "i18next";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";

import { Field, Input } from "../../../components";
import { useQueryCategories, useQueryTrackers } from "../../../hooks/query";
import type { Tracker } from "../../../types/tracker.ts";
import styles from "./TrackerForm.module.css";

export const TRACKER_FORM_ID = "tracker-form";

const TrackerSchema = (
  t: TFunction,
  currentTracker: string | undefined,
  existingTrackers: Tracker[],
) => {
  return z
    .object({
      name: z.string().min(1, t("validation.tracker.name.required")),
      description: z.string().optional(),
      categoryId: z.string().optional(),
    })
    .refine(
      (data) => {
        return existingTrackers.every(
          (tracker) =>
            tracker.name !== data.name || tracker.id === currentTracker,
        );
      },
      {
        path: ["name"],
        message: t("validation.tracker.name.unique"),
      },
    );
};

export type TrackerFormData = z.infer<ReturnType<typeof TrackerSchema>>;

type TrackerFormProps = {
  disabled: boolean;
  trackerId: string | undefined;
  defaultValues?: TrackerFormData;
  onSubmit: (data: TrackerFormData) => void;
};

export function TrackerForm({
  disabled,
  defaultValues,
  trackerId,
  onSubmit,
}: TrackerFormProps) {
  const { t } = useTranslation();

  const { data: trackers = [] } = useQueryTrackers();
  const { data: categories = [] } = useQueryCategories();

  const form = useForm({
    resolver: zodResolver(TrackerSchema(t, trackerId, trackers)),
    defaultValues,
  });

  return (
    <form
      className={styles.form}
      id={TRACKER_FORM_ID}
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
      <Field control={form.control} name="categoryId" label="Description">
        <select
          id="categoryId"
          disabled={disabled}
          {...form.register("categoryId", {
            value: defaultValues?.categoryId || "uncategorized",
          })}
        >
          <option value="uncategorized">Uncategorized</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </Field>
    </form>
  );
}
