import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Package, Bike, ChevronDown, ChevronUp, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function AdminOrders() {
  const [expandedOrder, setExpandedOrder] = useState(null);

  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await fetch('http://localhost:5000/api/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      return res.json();
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-400 py-12">
        Error cargando las órdenes. Asegúrate de que el backend esté ejecutándose.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
          <Package className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
          <p className="text-gray-400">Historial completo de órdenes recibidas</p>
        </div>
      </div>

      <div className="bg-[#2a2a2c]/50 border border-white/5 rounded-2xl overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            Aún no hay órdenes registradas en la tienda.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {orders.map((order) => (
              <div key={order.id} className="bg-[#1c1c1e]/50 hover:bg-[#2a2a2c]/50 transition-colors">
                <div 
                  className="p-6 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Orden</p>
                      <p className="font-mono font-bold text-blue-400">#{order.id.toString().padStart(6, '0')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Cliente</p>
                      <p className="font-medium text-white">{order.customerName} {order.customerLastName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Fecha</p>
                      <p className="text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Total</p>
                      <p className="font-bold text-white">${order.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-medium inline-flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    {expandedOrder === order.id ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="px-6 pb-6 pt-2 border-t border-white/5 animate-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 space-y-4">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Productos comprados</h4>
                        <div className="space-y-3">
                          {order.OrderItems.map(item => (
                            <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-[#2a2a2c]/50">
                              <div className="w-12 h-12 bg-[#1c1c1e] rounded-lg flex items-center justify-center">
                                <Bike className="w-6 h-6 text-gray-400" />
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium text-white">{item.Product.name}</h5>
                                <p className="text-xs text-gray-400">
                                  Talla: {item.size || 'N/A'} • Categoría: {item.Product.category}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-white">${item.priceAtPurchase.toLocaleString()}</p>
                                <p className="text-xs text-gray-400">Cant: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Información de Envío</h4>
                          <div className="space-y-2 text-sm text-gray-300 bg-[#2a2a2c]/30 p-4 rounded-xl border border-white/5">
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                              <span>{order.shippingAddress}, {order.shippingCity}, {order.shippingState}, {order.shippingZip}, {order.shippingCountry}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-3 text-gray-400 border-t border-white/5 pt-3">
                              <Package className="w-4 h-4" />
                              <span>Método: <span className="text-white capitalize">{order.shippingMethod}</span></span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Contacto</h4>
                          <div className="space-y-2 text-sm text-gray-300 bg-[#2a2a2c]/30 p-4 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <a href={`mailto:${order.customerEmail}`} className="hover:text-blue-400 transition-colors">{order.customerEmail}</a>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span>{order.customerPhone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
