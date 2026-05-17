import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingCart, Bike, Package, LogOut, User } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useAuthStore } from '../../store/useAuthStore';

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const toggleCart = useCartStore(state => state.toggleCart);
  const cartCount = useCartStore(state => state.getCartCount());
  const { toggleFavorites, getFavoritesCount } = useFavoritesStore();
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#1c1c1e]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        
        {/* Logo and Main Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
              <Bike className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              AdventureWorks<span className="font-normal text-gray-400">Catálogo</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
            <Link to="/?category=Bicicletas" className="hover:text-white transition-colors">Bicicletas</Link>
            <Link to="/?category=Componentes" className="hover:text-white transition-colors">Componentes</Link>
            <Link to="/?category=Ropa" className="hover:text-white transition-colors">Ropa</Link>
            <Link to="/?category=Accesorios" className="hover:text-white transition-colors">Accesorios</Link>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
            <Search className="h-5 w-5" />
          </button>
          <button 
            onClick={toggleFavorites}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            <Heart className="h-5 w-5" />
            {getFavoritesCount() > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {getFavoritesCount()}
              </span>
            )}
          </button>
          <Link 
            to="/admin/orders"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-colors"
            title="Panel de Administración"
          >
            <Package className="h-5 w-5" />
          </Link>
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
              title="Mi Cuenta"
            >
              <User className="h-5 w-5" />
            </button>

            {isProfileOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsProfileOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#1c1c1e] shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                  {user && (
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm font-medium text-white truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                  )}
                  <div className="p-1">
                    <button 
                      onClick={() => {
                        setIsProfileOpen(false);
                        logout();
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          <button 
            onClick={toggleCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </nav>
  );
}
