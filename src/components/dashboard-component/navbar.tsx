'use client';
import { useState, useEffect } from 'react';
import { FaHeart, FaChartBar } from 'react-icons/fa';
import { CiShoppingCart } from 'react-icons/ci';
import Image from 'next/image';
import Link from 'next/link';
import { get } from '@/lib/api';

export default function Navbar() {
  const [search, setSearch] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const data = await get('/profile/me', token);
      if (data && data.avatar) setAvatarUrl(data.avatar);
    };
    fetchProfile();
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
        <FaChartBar className="text-blue-600" />
        MyCourse
      </Link>

      {/* Search Bar */}
      <div className="flex-1 mx-6 max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari course atau materi..."
          className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Menu Group */}
      <div className="flex items-center gap-3 text-gray-600 text-sm font-medium">
        <NavButton href="/dashboard" label="Beranda" />
        <IconButton href="/dashboard/wishlist" icon={<FaHeart size={18} />} />
        <IconButton href="/dashboard/cart" icon={<CiShoppingCart size={20} />} />
        <IconButton href="/dashboard/mycourse" icon={<FaChartBar size={18} />} />
        <NavButton href="/dashboard/coursesaya" label="Course Saya" />

        {/* Profile Avatar */}
        <Link href="/dashboard/profile">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 hover:ring-2 hover:ring-blue-400 transition-all">
            <Image
              src={avatarUrl || 'https://ui-avatars.com/api/?name=User&background=random'}
              alt="Profile"
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>
        </Link>
      </div>
    </nav>
  );
}

function NavButton({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href}>
      <span className="px-3 py-1 rounded hover:bg-blue-50 transition text-gray-700">
        {label}
      </span>
    </Link>
  );
}

function IconButton({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link href={href}>
      <span className="p-2 rounded hover:bg-blue-50 transition text-gray-600">
        {icon}
      </span>
    </Link>
  );
}
