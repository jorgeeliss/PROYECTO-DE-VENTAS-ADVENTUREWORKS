import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import CartSidebar from '../Cart/CartSidebar';
import FavoritesSidebar from '../Favorites/FavoritesSidebar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#1c1c1e] text-zinc-100 flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <CartSidebar />
      <FavoritesSidebar />
    </div>
  );
}
