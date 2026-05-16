import { create } from 'zustand';

export const useCartStore = create((set) => ({
  isOpen: false,
  items: [],
  
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  
  addItem: (product, size, quantity = 1) => set((state) => {
    const existingItem = state.items.find(item => item.id === product.id && item.size === size);
    
    if (existingItem) {
      return {
        items: state.items.map(item => 
          item.id === product.id && item.size === size 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ),
        isOpen: true
      };
    }
    
    return {
      items: [...state.items, { ...product, size, quantity }],
      isOpen: true
    };
  }),
  
  removeItem: (id, size) => set((state) => ({
    items: state.items.filter(item => !(item.id === id && item.size === size))
  })),
  
  updateQuantity: (id, size, quantity) => set((state) => ({
    items: state.items.map(item => 
      item.id === id && item.size === size 
        ? { ...item, quantity: Math.max(1, quantity) }
        : item
    )
  })),
  
  getCartTotal: () => {
    return useCartStore.getState().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  
  getCartCount: () => {
    return useCartStore.getState().items.reduce((count, item) => count + item.quantity, 0);
  }
}));
