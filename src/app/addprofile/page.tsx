'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { post } from '@/lib/api'; // Ganti sesuai path file axios helper kamu

const CreateProfile: React.FC = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    website: '',
    github: '',
    linkedin: '',
    twitter: '',
    youtube: '',
  });

  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (avatar) {
      formData.append('avatar', avatar);
    }

    const token = localStorage.getItem('token');
    const response = await post('/profile/add', formData, token || '');

    if (response.profile) {
      setMessage('✅ Profile created successfully!');
      setTimeout(() => {
        router.push('/dashboard'); // Ganti dengan path tujuan kamu
      }, 1000); // Delay biar user bisa lihat notifikasi
    } else {
      setMessage(response.message || '❌ Failed to create profile');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4">Create Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        {[
          { name: 'name', label: 'Name', type: 'text' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'phone', label: 'Phone', type: 'text' },
          { name: 'website', label: 'Website', type: 'text' },
          { name: 'github', label: 'GitHub', type: 'text' },
          { name: 'linkedin', label: 'LinkedIn', type: 'text' },
          { name: 'twitter', label: 'Twitter', type: 'text' },
          { name: 'youtube', label: 'YouTube', type: 'text' },
        ].map(({ name, label, type }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={form[name as keyof typeof form]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
              required={name === 'name' || name === 'email'}
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            name="bio"
            rows={3}
            value={form.bio}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? 'Saving...' : 'Create Profile'}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">
          {message}
        </p>
      )}
    </div>
  );
};

export default CreateProfile;
