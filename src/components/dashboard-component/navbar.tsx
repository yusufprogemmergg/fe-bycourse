'use client';
import { useState, useEffect } from 'react';
import { FaHeart, FaChartBar } from 'react-icons/fa';
import Image from 'next/image';
import { get } from '@/lib/api';
import Link from 'next/link';

export default function Navbar() {
  const [search, setSearch] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

useEffect(() => {
  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const data = await get('/profile/me', token);
    if (data && data.avatar) {
      setAvatarUrl(data.avatar); // langsung pakai
    }
  };

  fetchProfile();
}, []);useEffect(() => {
  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const data = await get('/profile/me', token);
    if (data && data.avatar) {
      setAvatarUrl(data.avatar); // langsung pakai
    }
  };

  fetchProfile();
}, []);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md sticky top-0 z-50">
      {/* Logo or App Name */}
      <div className="text-2xl font-bold text-green-600 flex items-center gap-2">
        <FaChartBar className="text-green-600" />
        MyApp
      </div>

      {/* Search bar */}
      <div className="flex-1 mx-6 max-w-xl">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Icons and Profile */}
      <div className="flex items-center gap-4">
        <Link href={'/dashboard/wishlist'}>
        <button className="text-gray-600 hover:text-red-500 transition">
          
          <FaHeart size={20} />
        </button>
        </Link>

        <Link href={'/dashboard/cart'}>
        <button className="text-gray-600 hover:text-blue-600 transition">
          <FaChartBar size={20} />
        </button>
        </Link>

        {/* Profile image */}
        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
          <Image
            src={avatarUrl || 'https://ui-avatars.com/api/?name=User&background=random'}
            alt="Profile"
            width={40}
            height={40}
            className="object-cover w-full h-full"
/>
        </div>
      </div>
    </nav>
  );
}
