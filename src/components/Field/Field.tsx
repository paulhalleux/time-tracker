import * as React from "react";
import {
  type Control,
  type FieldPath,
  type FieldValues,
  useController,
} from "react-hook-form";

import styles from "./Field.module.css";

type FieldProps<TFieldValues extends FieldValues = FieldValues> =
  React.PropsWithChildren<{
    control: Control<TFieldValues>;
    name: FieldPath<TFieldValues>;
    label?: string;
    required?: boolean;
  }>;

export function Field<TFieldValues extends FieldValues = FieldValues>({
  children,
  control,
  name,
  label,
  required,
}: FieldProps<TFieldValues>) {
  const { fieldState } = useController<TFieldValues>({
    control,
    name: name,
  });

  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={name} className={styles.field__label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      {children}
      {fieldState.error && (
        <div className={styles.field_error}>{fieldState.error.message}</div>
      )}
    </div>
  );
}
