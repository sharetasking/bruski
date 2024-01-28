import { create } from 'zustand';

interface usePostModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const usePostModal = create<usePostModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
