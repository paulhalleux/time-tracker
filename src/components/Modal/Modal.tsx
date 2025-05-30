import { XIcon } from "@phosphor-icons/react";
import { clsx } from "clsx";
import { motion } from "motion/react";
import * as React from "react";

import { Button } from "../Button";
import styles from "./Modal.module.css";

type ModalProps = React.PropsWithChildren<{
  onClose?: () => void;
  size?: "sm" | "md" | "lg";
}>;

const ModalContext = React.createContext<{
  onClose?: () => void;
}>({});

export function Modal({ children, onClose, size }: ModalProps) {
  return (
    <ModalContext value={{ onClose }}>
      <div className={styles.modal__container}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={styles.modal__backdrop}
          onClick={onClose}
        />
        <motion.div
          initial={{ y: 25, opacity: 0, scale: 0.9, transformOrigin: "top" }}
          animate={{ y: 50, scale: 1, opacity: 1, transformOrigin: "top" }}
          exit={{ y: 25, scale: 0.95, opacity: 0, transformOrigin: "top" }}
          transition={{ duration: 0.2 }}
          className={clsx(styles.modal__content, styles[`modal--${size}`])}
        >
          {children}
        </motion.div>
      </div>
    </ModalContext>
  );
}

type ModalHeaderProps = {
  title?: string;
  description?: string;
  closeButton?: boolean;
};

Modal.Header = function ModalHeader({
  title,
  description,
  closeButton,
}: ModalHeaderProps) {
  const { onClose } = React.useContext(ModalContext);
  return (
    <header className={styles.modal__content__header}>
      <div className={styles.modal__content__header__title_container}>
        <h2 className={styles.modal__content__header__title}>{title}</h2>
        {description && (
          <p className={styles.modal__content__header__subtitle}>
            {description}
          </p>
        )}
      </div>
      {closeButton && (
        <Button.Icon
          type="button"
          className={styles.modal__close_button}
          onClick={onClose}
        >
          <XIcon />
        </Button.Icon>
      )}
    </header>
  );
};

type ModalBodyProps = React.PropsWithChildren;

Modal.Body = function ModalBody({ children }: ModalBodyProps) {
  return <div className={styles.modal__content__body}>{children}</div>;
};

type ModalFooterProps = React.PropsWithChildren;

Modal.Footer = function ModalFooter({ children }: ModalFooterProps) {
  return <div className={styles.modal__content__footer}>{children}</div>;
};
