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
export const UNCATEGORIZED_TRACKER_ID = "uncategorized";

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
      <Field
        control={form.control}
        name="name"
        label={t("page.trackers.form.name")}
        required
      >
        <Input
          type="text"
          disabled={disabled}
          id="name"
          autoFocus
          {...form.register("name")}
        />
      </Field>
      <Field
        control={form.control}
        name="description"
        label={t("page.trackers.form.description")}
      >
        <Input
          type="text"
          disabled={disabled}
          id="description"
          {...form.register("description")}
        />
      </Field>
      <Field
        control={form.control}
        name="categoryId"
        label={t("page.trackers.form.category")}
      >
        <select
          id="categoryId"
          disabled={disabled}
          {...form.register("categoryId", {
            value: defaultValues?.categoryId || UNCATEGORIZED_TRACKER_ID,
          })}
        >
          <option value={UNCATEGORIZED_TRACKER_ID}>
            {t("page.trackers.uncategorized")}
          </option>
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
