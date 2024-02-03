import { ChannelType, Server } from '@prisma/client';
import { create } from 'zustand'

export type ModalType = "createServer" | "editServer" | "invite" | "members" | "createChannel" | "leaveServer" | "deleteServer";

interface ModalData {
  server?: Server,
  channelType?: ChannelType;
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