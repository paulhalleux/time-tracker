import styles from "./Keybind.module.css";

type KeybindProps = {
  binding?: string;
};

export function Keybind({ binding }: KeybindProps) {
  return <kbd className={styles.kbd}>{binding}</kbd>;
}
