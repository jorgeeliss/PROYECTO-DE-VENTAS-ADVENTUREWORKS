import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingCart, Bike, Package } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';

export default function Navbar() {
  const toggleCart = useCartStore(state => state.toggleCart);
  const cartCount = useCartStore(state => state.getCartCount());
  const { toggleFavorites, getFavoritesCount } = useFavoritesStore();
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
