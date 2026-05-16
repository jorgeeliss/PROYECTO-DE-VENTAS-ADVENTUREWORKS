import React from 'react';
import { useCartStore } from '../../store/useCartStore';
import { X, Minus, Plus, Bike } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CartSidebar() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, getCartTotal, getCartCount } = useCartStore();

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={closeCart}
      />
      
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[#1c1c1e] shadow-2xl z-50 flex flex-col border-l border-white/10 animate-in slide-in-from-right duration-300">
        
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">Carrito</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
              {getCartCount()} items
            </span>
          </div>
          <button 
            onClick={closeCart}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
              <Bike className="w-16 h-16 opacity-20" />
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-4 p-4 rounded-xl border border-white/10 bg-[#2a2a2c]/50">
                <div className="w-16 h-16 bg-[#1c1c1e] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bike className="w-8 h-8 text-blue-400" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">{item.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">Talla {item.size} · x{item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-white whitespace-nowrap ml-2">
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-white/10 rounded-lg bg-[#1c1c1e]">
                      <button 
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.id, item.size)}
                      className="text-xs text-red-400 hover:text-red-300 font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-[#1c1c1e] space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-white font-medium">${getCartTotal().toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Envío</span>
              <span className="text-green-400 font-medium">Gratis</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-white/5">
              <span className="text-white">Total</span>
              <span className="text-white">${getCartTotal().toLocaleString()}</span>
            </div>
            
            <Link 
              to="/checkout" 
              onClick={closeCart}
              className="w-full flex items-center justify-center py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors mt-4"
            >
              Proceder al pago
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
