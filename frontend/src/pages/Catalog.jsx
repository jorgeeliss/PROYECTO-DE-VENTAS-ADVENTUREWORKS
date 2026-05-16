import React, { useState } from 'react';
import { Search, Plus, Bike, Star, ArrowDown, Heart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useFavoritesStore } from '../store/useFavoritesStore';

export default function Catalog() {
  const [activeCategory, setActiveCategory] = useState('Todos');

  const categories = ['Todos', 'Bicicletas', 'Componentes', 'Ropa', 'Accesorios'];

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['products', activeCategory],
    queryFn: async () => {
      const url = activeCategory === 'Todos' 
        ? 'http://localhost:5000/api/products'
        : `http://localhost:5000/api/products?category=${activeCategory}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    }
  });

  const filteredProducts = products;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero Banner */}
      <div className="glass-card flex flex-col md:flex-row justify-between items-center p-8 md:p-12">
        <div className="max-w-lg space-y-6">
          <span className="inline-block px-3 py-1 bg-white/10 text-blue-400 rounded-full text-sm font-medium border border-white/10">
            Nueva temporada 2024
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Equipo de alta performance
          </h1>
          <p className="text-gray-400 text-lg">
            Bicicletas, componentes y ropa para cada tipo de ciclista.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button className="px-6 py-3 bg-transparent border border-white/20 text-white rounded-lg font-medium hover:bg-white/5 transition-colors">
              Ver catálogo
            </button>
            <button className="px-6 py-3 bg-transparent border border-white/20 text-white rounded-lg font-medium hover:bg-white/5 transition-colors">
              Ofertas
            </button>
          </div>
        </div>
        <div className="mt-8 md:mt-0 w-full md:w-[450px] h-64 rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden relative group shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
            alt="Bicicleta de alta performance" 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-white">Filtrar:</span>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  activeCategory === cat 
                    ? 'bg-blue-100 text-blue-900 border-blue-100' 
                    : 'border-white/10 text-gray-300 hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex gap-2">
            <button className="px-4 py-1.5 rounded-full border border-white/10 text-sm text-gray-300 hover:bg-white/5 transition-colors">
              Precio: menor
            </button>
            <button className="px-4 py-1.5 rounded-full border border-white/10 text-sm text-gray-300 hover:bg-white/5 transition-colors">
              Más vendidos
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar producto..." 
              className="pl-9 pr-4 py-2 bg-transparent border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 w-full md:w-48 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Bike className="w-12 h-12 text-blue-500 animate-pulse" />
        </div>
      ) : isError ? (
        <div className="text-center text-red-400 py-12">Error cargando los productos.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product }) {
  const { toggleFavoriteStatus, isFavorite } = useFavoritesStore();

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className={`relative h-full p-6 rounded-2xl border transition-all duration-300 ${
        product.isBestSeller 
          ? 'bg-[#2a2a2c] border-blue-500/50 hover:border-blue-500' 
          : 'bg-[#1c1c1e] border-white/10 hover:border-white/20 hover:bg-[#242426]'
      }`}>
        {product.isBestSeller && (
          <div className="absolute top-0 left-0 w-full bg-blue-100 text-blue-900 text-xs font-bold text-center py-1 rounded-t-2xl">
            Más vendido
          </div>
        )}
        
        <div className={`mt-4 mb-6 flex items-center justify-center h-48 rounded-xl overflow-hidden ${
          product.isBestSeller ? 'bg-[#1c1c1e]' : 'bg-[#2a2a2c]'
        }`}>
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <Bike className="w-16 h-16 text-white/20 group-hover:scale-110 transition-transform duration-500" />
          )}
        </div>

        {/* Favorite Button Overlay */}
        <button 
          onClick={(e) => {
            e.preventDefault(); // Prevent navigating to ProductDetail
            toggleFavoriteStatus(product);
          }}
          className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
            isFavorite(product.id) 
              ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' 
              : 'bg-black/20 text-white/70 hover:bg-black/40 hover:text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite(product.id) ? 'fill-red-500' : ''}`} />
        </button>

        <div className="space-y-2">
          <p className="text-xs text-gray-400">{product.category} · {product.subCategory}</p>
          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-orange-400 fill-orange-400' : 'text-gray-600'}`} />
              ))}
            </div>
            <span className="text-xs text-gray-400 ml-1">{product.rating} ({product.reviews})</span>
          </div>
          
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white">${product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">${product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            <button className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
              product.isBestSeller 
                ? 'border-white/20 text-white hover:bg-white/10' 
                : 'border-white/10 text-gray-400 hover:text-white hover:border-white/30'
            }`}>
              {product.isBestSeller ? <ArrowDown className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
