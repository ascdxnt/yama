import { create } from 'zustand';

interface UIState {
  mobileMenuOpen: boolean;
  activeMegaMenu: string | null;
  setMobileMenuOpen: (open: boolean) => void;
  setActiveMegaMenu: (key: string | null) => void;
  closeAll: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  mobileMenuOpen: false,
  activeMegaMenu: null,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open, activeMegaMenu: null }),
  setActiveMegaMenu: (key) => set({ activeMegaMenu: key }),
  closeAll: () => set({ mobileMenuOpen: false, activeMegaMenu: null }),
}));
