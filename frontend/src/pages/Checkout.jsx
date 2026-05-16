import React, { useState, useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';
import { Check, Bike, Lock, RotateCcw, Loader2, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

export default function Checkout() {
  const { items, getCartTotal } = useCartStore();
  const [shippingMethod, setShippingMethod] = useState('standard');
  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const taxes = subtotal * 0.19; // 19% tax example
  const shippingCost = shippingMethod === 'standard' ? 0 : 12;
  const total = subtotal + taxes + shippingCost;

  const createOrderMutation = useMutation({
    mutationFn: async (orderData) => {
      // Retraso artificial para que el usuario pueda ver la animación de "Procesando..."
      await new Promise(resolve => setTimeout(resolve, 1500));

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) {
        throw new Error('Error al procesar la orden');
      }
      return response.json();
    },
    onSuccess: (data) => {
      useCartStore.setState({ items: [] });
      // No redirigimos inmediatamente para mostrar la pantalla de éxito
    },
    onError: (error) => {
      alert('Hubo un problema al procesar tu pedido. Por favor intenta de nuevo.');
      console.error(error);
    }
  });

  const handlePayment = (e) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    const formData = new FormData(e.target);

    const orderData = {
      contactInfo: {
        name: formData.get('name'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone')
      },
      shippingInfo: {
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state'),
        zip: formData.get('zip'),
        country: formData.get('country'),
        method: shippingMethod
      },
      items: items,
      totals: {
        subtotal,
        taxes,
        shippingCost,
        total
      }
    };

    createOrderMutation.mutate(orderData);
  };

  const handleFinish = () => {
    navigate('/');
  };

  if (createOrderMutation.isSuccess) {
    return (
      <div className="max-w-2xl mx-auto mt-20 animate-in fade-in zoom-in duration-500 text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">¡Gracias por tu compra!</h1>
          <p className="text-gray-400 text-lg">Tu orden ha sido procesada.</p>
        </div>
        <div className="bg-[#2a2a2c]/50 border border-white/10 rounded-2xl p-8 max-w-sm mx-auto">
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Número de orden</p>
          <p className="text-3xl font-mono font-bold text-blue-400">
            #{createOrderMutation.data.orderId.toString().padStart(6, '0')}
          </p>
        </div>
        <button
          onClick={handleFinish}
          className="mt-8 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors"
        >
          Volver al catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Stepper */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#10b981]/20 flex items-center justify-center text-[#10b981]">
              <Check className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-gray-300">Carrito</span>
          </div>
          <div className="w-12 h-px bg-white/20"></div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
              2
            </div>
            <span className="text-sm font-medium text-white">Envío</span>
          </div>
          <div className="w-12 h-px bg-white/20"></div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-gray-400 text-xs font-bold border border-white/10">
              3
            </div>
            <span className="text-sm font-medium text-gray-400">Pago</span>
          </div>
          <div className="w-12 h-px bg-white/20"></div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-gray-400 text-xs font-bold border border-white/10">
              4
            </div>
            <span className="text-sm font-medium text-gray-400">Confirmación</span>
          </div>
        </div>
      </div>

      <form onSubmit={handlePayment} className="grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* Left Column - Forms */}
        <div className="lg:col-span-7 space-y-10">

          {/* Contact Info */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">Información de contacto</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm text-gray-400">Nombre</label>
                <input name="name" type="text" defaultValue="Juan" required className="w-full bg-[#2a2a2c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-gray-400">Apellido</label>
                <input name="lastName" type="text" defaultValue="Díaz" required className="w-full bg-[#2a2a2c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="text-sm text-gray-400">Correo electrónico</label>
                <input name="email" type="email" defaultValue="juan@example.com" required className="w-full bg-[#2a2a2c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="text-sm text-gray-400">Teléfono</label>
                <input name="phone" type="tel" defaultValue="+57 " required className="w-full bg-[#2a2a2c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
            </div>
          </section>

          {/* Shipping Address */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">Dirección de envío</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <label className="text-sm text-gray-400">Dirección</label>
                <input name="address" type="text" defaultValue="Calle 10 # 43E-31" required className="w-full bg-[#2a2a2c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-gray-400">Ciudad</label>
                <input name="city" type="text" defaultValue="Medellín" required className="w-full bg-[#2a2a2c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-gray-400">Departamento</label>
                <input name="state" type="text" defaultValue="Antioquia" required className="w-full bg-[#2a2a2c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-gray-400">Código postal</label>
                <input name="zip" type="text" defaultValue="050001" required className="w-full bg-[#2a2a2c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-gray-400">País</label>
                <input name="country" type="text" defaultValue="Colombia" required className="w-full bg-[#2a2a2c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
            </div>
          </section>

          {/* Shipping Method */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">Método de envío</h2>
            <div className="space-y-3">
              <div
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${shippingMethod === 'standard' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-[#2a2a2c] hover:border-white/30'
                  }`}
                onClick={() => setShippingMethod('standard')}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${shippingMethod === 'standard' ? 'border-blue-500' : 'border-gray-500'
                    }`}>
                    {shippingMethod === 'standard' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Estándar</h4>
                    <p className="text-xs text-blue-400">5-7 días hábiles</p>
                  </div>
                </div>
                <span className="font-bold text-white">Gratis</span>
              </div>

              <div
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${shippingMethod === 'express' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-[#2a2a2c] hover:border-white/30'
                  }`}
                onClick={() => setShippingMethod('express')}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${shippingMethod === 'express' ? 'border-blue-500' : 'border-gray-500'
                    }`}>
                    {shippingMethod === 'express' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Express</h4>
                    <p className="text-xs text-gray-400">2-3 días hábiles</p>
                  </div>
                </div>
                <span className="font-bold text-white">$12</span>
              </div>
            </div>
          </section>

          <button
            type="submit"
            disabled={createOrderMutation.isPending}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {createOrderMutation.isPending && <Loader2 className="w-5 h-5 animate-spin" />}
            {createOrderMutation.isPending ? 'Procesando...' : 'Continuar al pago'}
          </button>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 space-y-6">
            <h2 className="text-xl font-bold text-white">Resumen del pedido</h2>

            <div className="bg-[#2a2a2c]/50 border border-white/5 rounded-2xl p-6 space-y-4">
              {items.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No hay ítems en tu pedido</p>
              ) : (
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex gap-4 p-3 rounded-xl border border-white/5 bg-[#1c1c1e]">
                      <div className="w-12 h-12 bg-[#2a2a2c] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Bike className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h3 className="text-sm font-bold text-white">{item.name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">x{item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold text-white self-center">
                        ${(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-[#2a2a2c]/50 border border-white/5 rounded-2xl p-6 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                <span className="text-white font-medium">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Envío</span>
                <span className={shippingCost === 0 ? "text-green-400 font-medium" : "text-white font-medium"}>
                  {shippingCost === 0 ? 'Gratis' : `$${shippingCost.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Impuestos (19%)</span>
                <span className="text-white font-medium">${Math.round(taxes).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xl font-bold pt-4 border-t border-white/10 mt-2">
                <span className="text-white">Total</span>
                <span className="text-white">${Math.round(total).toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-[#2a2a2c]/50 border border-white/5 rounded-2xl p-6">
              <label className="text-sm text-gray-400 mb-2 block">Código de descuento</label>
              <div className="flex gap-2">
                <input type="text" placeholder="PROMO2024" className="flex-1 bg-[#1c1c1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors uppercase" />
                <button className="px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors">
                  Aplicar
                </button>
              </div>
            </div>

            <div className="space-y-3 pl-2">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Pago 100% seguro</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Devoluciones gratis 30 días</span>
              </div>
            </div>

          </div>
        </div>

      </form>
    </div>
  );
}
