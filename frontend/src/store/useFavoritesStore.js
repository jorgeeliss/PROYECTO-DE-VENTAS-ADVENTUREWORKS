import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      isOpen: false,
      items: [],

      toggleFavorites: () => set((state) => ({ isOpen: !state.isOpen })),
      openFavorites: () => set({ isOpen: true }),
      closeFavorites: () => set({ isOpen: false }),

      addFavorite: (product) => set((state) => {
        const existing = state.items.find((item) => item.id === product.id);
        if (existing) {
          return { isOpen: true }; // Ya está en favoritos
        }
        return {
          items: [...state.items, product],
          isOpen: true
        };
      }),

      removeFavorite: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id)
      })),

      toggleFavoriteStatus: (product) => set((state) => {
        const existing = state.items.find((item) => item.id === product.id);
        if (existing) {
          return { items: state.items.filter((item) => item.id !== product.id) };
        } else {
          return { items: [...state.items, product] };
        }
      }),

      isFavorite: (id) => {
        return get().items.some((item) => item.id === id);
      },

      getFavoritesCount: () => {
        return get().items.length;
      }
    }),
    {
      name: 'adventureworks-favorites', // Nombre para localStorage
      partialize: (state) => ({ items: state.items }) // Solo guardar los items, no el estado del panel (isOpen)
    }
  )
);
