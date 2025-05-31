import { AnimatePresence } from "motion/react";
import * as React from "react";
import { useCallback, useState } from "react";

import { Button } from "../Button";
import { Modal } from "../Modal";

type Confirmation = {
  title: string;
  description?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonVariant?: "primary" | "danger" | "secondary";
};

type ConfirmFn = (payload: Confirmation) => Promise<void>;

const confirmRef: {
  current: ConfirmFn;
} = { current: () => Promise.resolve() };

export function ConfirmModalProvider({ children }: React.PropsWithChildren) {
  const confirmPromiseResolveRef = React.useRef<() => void>(null);
  const confirmPromiseRejectRef = React.useRef<() => void>(null);

  const [currentConfirmation, setCurrentConfirmation] =
    useState<Confirmation>();

  confirmRef.current = async (payload) => {
    setCurrentConfirmation(payload);
    await new Promise<void>((resolve, reject) => {
      confirmPromiseResolveRef.current = resolve;
      confirmPromiseRejectRef.current = reject;
    });
  };

  const onClose = useCallback(() => {
    setCurrentConfirmation(undefined);
    confirmPromiseRejectRef.current?.();
    confirmPromiseResolveRef.current = null;
    confirmPromiseRejectRef.current = null;
  }, []);

  const onConfirm = useCallback(() => {
    confirmPromiseResolveRef.current?.();
    confirmPromiseResolveRef.current = null;
    confirmPromiseRejectRef.current = null;
    setCurrentConfirmation(undefined);
  }, []);

  return (
    <>
      <AnimatePresence>
        {currentConfirmation && (
          <Modal size="sm" onClose={onClose}>
            <Modal.Header
              title={currentConfirmation.title}
              description={currentConfirmation.description}
              closeButton
            />
            <Modal.Footer>
              <Button type="button" onClick={onClose}>
                {currentConfirmation.cancelButtonText ?? "Cancel"}
              </Button>
              <Button
                type="button"
                variant={currentConfirmation.confirmButtonVariant ?? "primary"}
                onClick={onConfirm}
              >
                {currentConfirmation.confirmButtonText ?? "Confirm"}
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}

export function confirm(payload: Confirmation): Promise<void> {
  return confirmRef.current(payload);
}
