import { create } from 'zustand';

interface QuoteState {
  productId: string | null;
  productName: string | null;
  name: string;
  phone: string;
  email: string;
  message: string;
  setProduct: (id: string, name: string) => void;
  setField: (field: 'name' | 'phone' | 'email' | 'message', value: string) => void;
  reset: () => void;
}

const initialState = {
  productId: null,
  productName: null,
  name: '',
  phone: '',
  email: '',
  message: '',
};

export const useQuoteStore = create<QuoteState>((set) => ({
  ...initialState,
  setProduct: (id, name) => set({ productId: id, productName: name }),
  setField: (field, value) => set({ [field]: value }),
  reset: () => set(initialState),
}));
