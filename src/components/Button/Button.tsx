import { clsx } from "clsx";
import * as React from "react";
import { Link } from "react-router";

import styles from "./Button.module.css";

type ButtonProps = Omit<React.ComponentProps<"button">, "size"> & {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "secondary" | "primary" | "danger";
};

export function Button({
  size = "md",
  className,
  variant,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        styles.button,
        styles[`button--${size}`],
        styles[`button--${variant}`],
        className,
      )}
      {...props}
    />
  );
}

Button.Icon = function ButtonIcon({ className, ...props }: ButtonProps) {
  return <Button className={clsx(styles.icon, className)} {...props} />;
};

Button.Link = function ButtonLink({
  className,
  to,
  size = "md",
  variant,
  ...props
}: React.ComponentProps<"a"> & {
  to: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "secondary" | "primary";
}) {
  return (
    <Link
      to={to}
      className={clsx(
        styles.button,
        styles[`button--${size}`],
        styles[`button--${variant}`],
        className,
      )}
      {...props}
    />
  );
};
