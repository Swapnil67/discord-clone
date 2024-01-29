import { Server } from '@prisma/client';
import { create } from 'zustand'

export type ModalType = "createServer" | "editServer" | "invite";

interface ModalData {
  server?: Server
}

interface ModalStore {
  data: ModalData;
  isOpen: boolean;
  type: ModalType | null;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  data: {},
  type: null,
  isOpen: false,
  onOpen: (type, data={}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null })
}))