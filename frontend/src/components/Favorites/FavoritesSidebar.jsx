import React from 'react';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useCartStore } from '../../store/useCartStore';
import { X, Heart, Bike, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FavoritesSidebar() {
  const { isOpen, closeFavorites, items, removeFavorite, getFavoritesCount } = useFavoritesStore();
  const addItem = useCartStore(state => state.addItem);

  if (!isOpen) return null;

  const handleAddToCart = (product) => {
    // Añadir con cantidad 1, usando la primera talla disponible o una por defecto (44)
    addItem(product, 44, 1);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity"
        onClick={closeFavorites}
      />
      
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[#1c1c1e] shadow-2xl z-[60] flex flex-col border-l border-white/10 animate-in slide-in-from-right duration-300">
        
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" /> Mis Favoritos
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 text-xs font-semibold border border-red-500/20">
              {getFavoritesCount()} items
            </span>
          </div>
          <button 
            onClick={closeFavorites}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
              <Heart className="w-16 h-16 opacity-20" />
              <p>No tienes productos favoritos aún</p>
              <button 
                onClick={closeFavorites}
                className="px-6 py-2 mt-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-sm"
              >
                Explorar catálogo
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 rounded-xl border border-white/10 bg-[#2a2a2c]/50 group relative">
                <Link 
                  to={`/product/${item.id}`} 
                  onClick={closeFavorites}
                  className="w-20 h-20 bg-[#1c1c1e] rounded-lg flex items-center justify-center flex-shrink-0 border border-white/5 overflow-hidden"
                >
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  ) : (
                    <Bike className="w-8 h-8 text-blue-400" />
                  )}
                </Link>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <Link to={`/product/${item.id}`} onClick={closeFavorites} className="hover:text-blue-400 transition-colors">
                      <h3 className="text-sm font-bold text-white leading-tight">{item.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">{item.subCategory}</p>
                    </Link>
                    <span className="text-sm font-bold text-white whitespace-nowrap ml-2">
                      ${item.price.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 hover:text-blue-300 border border-blue-500/30 rounded-lg text-xs font-medium transition-colors"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Al carrito
                    </button>
                    
                    <button 
                      onClick={() => removeFavorite(item.id)}
                      className="text-gray-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all"
                      title="Eliminar de favoritos"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-[#1c1c1e]">
             <button 
                onClick={closeFavorites}
                className="w-full flex items-center justify-center py-3.5 px-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl font-medium transition-colors"
              >
                Seguir comprando
              </button>
          </div>
        )}
      </div>
    </>
  );
}
