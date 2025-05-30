import * as React from "react";

import styles from "./Input.module.css";

type InputProps = Omit<React.ComponentProps<"input">, "any">;

export function Input(props: InputProps) {
  return <input type="text" className={styles.input} {...props} />;
}
