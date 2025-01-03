import { useAppStore } from '@/stores/app-store';
import { MessageType } from '@/types/message-type';

export interface MessageData {
  type: MessageType;
  title: string;
  message: string;
}

const showMessage = (type: MessageType, title: string, message: string): void => {
  const appStore = useAppStore();

  appStore.messageData = {
    message: message,
    title: title,
    type: type
  };
};

export const clearMessage = (): void => {
  const appStore = useAppStore();
  appStore.messageData = undefined;
};

export const showErrorMessage = (message: string): void => {
  showMessage(MessageType.Error, 'Error', message);
};

export const showWarningMessage = (message: string): void => {
  showMessage(MessageType.Warn, 'Warning', message);
};

export const showSuccessMessage = (message: string): void => {
  showMessage(MessageType.Success, 'Success', message);
};

export const showInfoMessage = (message: string): void => {
  showMessage(MessageType.Info, 'Information', message);
};
