import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Bike, Star, Minus, Plus, Heart, Truck, RotateCcw } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useFavoritesStore } from '../store/useFavoritesStore';

export default function ProductDetail() {
  const { id } = useParams();
  
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/api/products/${id}`);
      if (!res.ok) throw new Error('Product not found');
      return res.json();
    }
  });
  
  const [selectedSize, setSelectedSize] = useState(44);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(state => state.addItem);
  const { toggleFavoriteStatus, isFavorite } = useFavoritesStore();

  const handleAddToCart = () => {
    if (product) {
      addItem(product, selectedSize, quantity);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Bike className="w-12 h-12 text-blue-500 animate-pulse" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="text-center text-red-400 py-12">
        Error cargando el producto o producto no encontrado.
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link to="/" className="hover:text-white transition-colors">Catálogo</Link>
        <span>/</span>
        <Link to={`/?category=${product.category}`} className="hover:text-white transition-colors">{product.category}</Link>
        <span>/</span>
        <span className="text-white font-medium">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Column - Images */}
        <div className="space-y-4">
          <div className="w-full aspect-square bg-[#2a2a2c] rounded-3xl flex items-center justify-center border border-white/5 overflow-hidden">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <Bike className="w-48 h-48 text-blue-400/50" />
            )}
          </div>
          <div className="flex gap-4">
            {[...Array(3)].map((_, i) => (
              <button 
                key={i} 
                className={`w-24 h-24 rounded-2xl flex items-center justify-center border overflow-hidden transition-colors ${
                  i === 0 ? 'bg-[#2a2a2c] border-blue-500' : 'bg-[#1c1c1e] border-white/10 hover:border-white/30'
                }`}
              >
                {product.image && i === 0 ? (
                  <img src={product.image} alt="Thumbnail" className="w-full h-full object-cover" />
                ) : (
                  <Bike className={`w-8 h-8 ${i === 0 ? 'text-blue-400' : 'text-gray-600'}`} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-white/10 text-blue-400 rounded-full text-xs font-bold border border-white/10">
                {product.subCategory}
              </span>
              <span className="px-3 py-1 bg-[#10b981]/20 text-[#10b981] rounded-full text-xs font-bold">
                En stock
              </span>
            </div>
            
            <h1 className="text-4xl font-bold text-white tracking-tight">{product.name}</h1>
            
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-orange-400 fill-orange-400' : 'text-gray-600'}`} />
                ))}
              </div>
              <span className="text-sm font-medium text-white">{product.rating}</span>
              <span className="text-sm text-gray-400">· {product.reviews} reseñas</span>
            </div>
            
            <div className="flex items-end gap-3 pt-2">
              <span className="text-4xl font-bold text-white">${product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through mb-1">${product.originalPrice.toLocaleString()}</span>
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded-md text-sm font-bold mb-1">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="font-medium text-white">Talla</h3>
            <div className="flex flex-wrap gap-3">
              {[42, 44, 48, 52].map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-14 h-12 rounded-xl border flex items-center justify-center font-medium transition-colors ${
                    selectedSize === size 
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400' 
                      : 'border-white/10 text-gray-300 hover:border-white/30'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-white">Cantidad</h3>
            <div className="flex items-center w-32 border border-white/20 rounded-xl bg-[#1c1c1e]">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-12 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="flex-1 text-center font-bold">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-12 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <button 
              onClick={handleAddToCart}
              className="w-full py-4 bg-white hover:bg-gray-200 text-black rounded-xl font-bold transition-colors"
            >
              Agregar al carrito
            </button>
            <button 
              onClick={() => toggleFavoriteStatus(product)}
              className={`w-full py-4 border rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${
                isFavorite(product?.id) 
                  ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20' 
                  : 'bg-transparent border-white/20 text-white hover:bg-white/5'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite(product?.id) ? 'fill-red-400' : ''}`} /> 
              {isFavorite(product?.id) ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            </button>
          </div>

          <div className="bg-[#2a2a2c]/50 border border-white/5 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-300">Envío gratis en órdenes +$500</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-300">Devoluciones gratis 30 días</span>
            </div>
          </div>

          <div className="pt-8 space-y-6">
            <h3 className="font-bold text-lg text-white">Especificaciones</h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Categoría</span>
                <span className="font-medium text-white">{product.subCategory}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Color</span>
                <span className="font-medium text-white">Red</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
