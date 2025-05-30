import { clsx } from "clsx";
import * as React from "react";

import styles from "./Table.module.css";

type TableProps = React.PropsWithChildren<{
  containerRef?: React.RefObject<HTMLDivElement | null>;
}>;

export function Table({ children, containerRef }: TableProps) {
  return (
    <div className={styles.table__container} ref={containerRef}>
      <table className={styles.table}>{children}</table>
    </div>
  );
}

Table.Header = function TableHeader({ children }: React.PropsWithChildren) {
  return <thead className={styles.table__header}>{children}</thead>;
};

Table.Body = function TableBody({
  children,
  style,
}: React.PropsWithChildren<{
  style?: React.CSSProperties;
}>) {
  return (
    <tbody className={styles.table__body} style={style}>
      {children}
    </tbody>
  );
};

Table.Row = function TableRow({
  children,
  style,
}: React.PropsWithChildren<{
  style?: React.CSSProperties;
}>) {
  return (
    <tr className={styles.table__row} style={style}>
      {children}
    </tr>
  );
};

Table.HeaderCell = function TableHeaderCell({
  children,
  align,
}: React.PropsWithChildren<{
  align?: "left" | "center" | "right";
}>) {
  return (
    <th
      className={clsx(styles["table__header-cell"], styles[`align--${align}`])}
    >
      {children}
    </th>
  );
};

Table.Cell = function TableCell({
  children,
  align = "left",
}: React.PropsWithChildren<{
  align?: "left" | "center" | "right";
}>) {
  return (
    <td className={clsx(styles.table__cell, styles[`align--${align}`])}>
      {children}
    </td>
  );
};

Table.Actions = function TableActions({ children }: React.PropsWithChildren) {
  return <div className={styles.table__actions}>{children}</div>;
};

Table.Action = function TableAction({
  children,
  className,
  ...rest
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={clsx(styles.table__action, className)}
      {...rest}
    >
      {children}
    </button>
  );
};
