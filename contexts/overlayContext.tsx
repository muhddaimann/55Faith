import React, { createContext, useContext, useState, useCallback } from "react";
import { OverlayAlert } from "../components/alert";
import { OverlayConfirm } from "../components/confirm";
import { OverlayToast, ToastVariant } from "../components/toast";
import { OverlayModal } from "../components/modal";

type AlertOptions = {
  title: string;
  message: string;
  buttonText?: string;
  onPress?: () => void;
};

type ConfirmOptions = {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isDestructive?: boolean;
};

type ToastOptions = {
  message: string;
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
  variant?: ToastVariant;
  icon?: string;
};

type ModalOptions = {
  content: React.ReactNode;
  onDismiss?: () => void;
  dismissable?: boolean;
};

type OverlayContextType = {
  alert: (options: AlertOptions) => void;
  confirm: (options: ConfirmOptions) => void;
  toast: (options: ToastOptions | string) => void;
  showModal: (options: ModalOptions) => void;
  hideModal: () => void;
};

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  // Alert State
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<AlertOptions | null>(null);

  // Confirm State
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<ConfirmOptions | null>(null);

  // Toast State
  const [toastVisible, setToastVisible] = useState(false);
  const [toastConfig, setToastConfig] = useState<ToastOptions | null>(null);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalOptions | null>(null);

  const alert = useCallback((options: AlertOptions) => {
    setAlertConfig(options);
    setAlertVisible(true);
  }, []);

  const confirm = useCallback((options: ConfirmOptions) => {
    setConfirmConfig(options);
    setConfirmVisible(true);
  }, []);

  const toast = useCallback((options: ToastOptions | string) => {
    if (typeof options === "string") {
      setToastConfig({ message: options });
    } else {
      setToastConfig(options);
    }
    setToastVisible(true);
  }, []);

  const showModal = useCallback((options: ModalOptions) => {
    setModalConfig(options);
    setModalVisible(true);
  }, []);

  const hideModal = useCallback(() => {
    setModalVisible(false);
    modalConfig?.onDismiss?.();
  }, [modalConfig]);

  const handleAlertClose = () => {
    setAlertVisible(false);
    alertConfig?.onPress?.();
  };

  const handleConfirmAction = () => {
    setConfirmVisible(false);
    confirmConfig?.onConfirm();
  };

  const handleConfirmCancel = () => {
    setConfirmVisible(false);
    confirmConfig?.onCancel?.();
  };

  return (
    <OverlayContext.Provider value={{ alert, confirm, toast, showModal, hideModal }}>
      {children}
      
      <OverlayAlert 
        visible={alertVisible}
        title={alertConfig?.title}
        message={alertConfig?.message}
        buttonText={alertConfig?.buttonText}
        onClose={handleAlertClose}
      />

      <OverlayConfirm 
        visible={confirmVisible}
        title={confirmConfig?.title}
        message={confirmConfig?.message}
        confirmText={confirmConfig?.confirmText}
        cancelText={confirmConfig?.cancelText}
        onConfirm={handleConfirmAction}
        onCancel={handleConfirmCancel}
        isDestructive={confirmConfig?.isDestructive}
      />

      <OverlayModal 
        visible={modalVisible}
        content={modalConfig?.content}
        onDismiss={hideModal}
        dismissable={modalConfig?.dismissable}
      />

      <OverlayToast 
        visible={toastVisible}
        message={toastConfig?.message || ''}
        actionLabel={toastConfig?.actionLabel}
        onAction={toastConfig?.onAction}
        onDismiss={() => setToastVisible(false)}
        duration={toastConfig?.duration}
        variant={toastConfig?.variant}
        icon={toastConfig?.icon}
      />

    </OverlayContext.Provider>
  );
}

export const useOverlay = () => {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error("useOverlay must be used within an OverlayProvider");
  }
  return context;
};
