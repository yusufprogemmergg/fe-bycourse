'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { post } from '@/lib/api';

type FormMode = 'login' | 'register';

export default function AuthPage() {
  const [formMode, setFormMode] = useState<FormMode>('login');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const loginSchema = Yup.object().shape({
    email: Yup.string().email('Email tidak valid').required('Email wajib diisi'),
    password: Yup.string().required('Password wajib diisi'),
  });

  const registerSchema = Yup.object().shape({
    name: Yup.string().required('Nama wajib diisi'),
    username: Yup.string().required('Username wajib diisi'),
    email: Yup.string().email('Email tidak valid').required('Email wajib diisi'),
    password: Yup.string().min(8, 'Minimal 8 karakter').required('Password wajib diisi'),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref('password')], 'Konfirmasi password tidak cocok')
      .required('Konfirmasi wajib diisi'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{
    name?: string;
    username?: string;
    email: string;
    password: string;
    passwordConfirm?: string;
  }>({
    resolver: yupResolver(formMode === 'login' ? loginSchema : registerSchema),
  });

  const onSubmit = async (data: {
    name?: string;
    username?: string;
    email: string;
    password: string;
    passwordConfirm?: string;
  }) => {
    try {
      const endpoint = formMode === 'login' ? '/auth/login' : '/auth/register';
      const result = await post(endpoint, data, '');

      if (formMode === 'login') {
        if (result.token) {
          localStorage.setItem('token', result.token);
          if (result.user?.profile) {
            router.push('/dashboard');
          } else {
            router.push('/addprofile');
          }
        } else {
          setMessage(result.message || 'Gagal login');
        }
      } else {
        if (result.status) {
          setMessage('Berhasil daftar. Silakan login...');
          setFormMode('login');
        } else {
          setMessage(result.message || 'Gagal daftar');
        }
      }
    } catch {
      setMessage('Terjadi kesalahan');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-900 px-4">
      <div className="relative w-full max-w-4xl h-[500px] overflow-hidden rounded-2xl shadow-xl">
        <div
          className={`absolute top-0 left-0 w-[200%] h-full flex transition-transform duration-500 ease-in-out ${
            formMode === 'login' ? '-translate-x-1/2' : 'translate-x-0'
          }`}
        >
          {/* Register Form */}
          <div className="w-1/2 bg-white p-10">
            <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">Daftar Akun</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input {...register('name')} placeholder="Nama" className="w-full px-4 py-2 border rounded-lg" />
              <p className="text-red-500 text-sm">{errors.name?.message}</p>

              <input {...register('username')} placeholder="Username" className="w-full px-4 py-2 border rounded-lg" />
              <p className="text-red-500 text-sm">{errors.username?.message}</p>

              <input type="email" {...register('email')} placeholder="Email" className="w-full px-4 py-2 border rounded-lg" />
              <p className="text-red-500 text-sm">{errors.email?.message}</p>

              <input type="password" {...register('password')} placeholder="Password" className="w-full px-4 py-2 border rounded-lg" />
              <p className="text-red-500 text-sm">{errors.password?.message}</p>

              <input
                type="password"
                {...register('passwordConfirm')}
                placeholder="Konfirmasi Password"
                className="w-full px-4 py-2 border rounded-lg"
              />
              <p className="text-red-500 text-sm">{errors.passwordConfirm?.message}</p>

              <button
                type="submit"
                className="w-full py-2 rounded-full text-white font-bold bg-blue-600 hover:bg-blue-800 transition"
              >
                {isSubmitting ? 'Mendaftarkan...' : 'DAFTAR'}
              </button>
              {message && <p className="text-center text-red-500 text-sm">{message}</p>}
            </form>
          </div>

          {/* Login Form */}
          <div className="w-1/2 bg-white p-10">
            <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">GAMER4TK</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input type="email" {...register('email')} placeholder="Email" className="w-full px-4 py-2 border rounded-lg" />
              <p className="text-red-500 text-sm">{errors.email?.message}</p>

              <input type="password" {...register('password')} placeholder="Password" className="w-full px-4 py-2 border rounded-lg" />
              <p className="text-red-500 text-sm">{errors.password?.message}</p>

              <button
                type="submit"
                className="w-full py-2 rounded-full text-white font-bold bg-blue-600 hover:bg-blue-800 transition"
              >
                {isSubmitting ? 'Memproses...' : 'MASUK'}
              </button>
              <p className="text-sm text-blue-800 text-center">Lupa password?</p>
              {message && <p className="text-center text-red-500 text-sm">{message}</p>}
            </form>
          </div>
        </div>

        {/* Panel Tombol */}
        <div className="absolute top-0 left-1/2 w-1/2 h-full bg-cover bg-center text-white p-10 flex flex-col justify-center items-center transition-all duration-500">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">
              {formMode === 'login' ? 'Baru di sini?' : 'Sudah punya akun?'}
            </h2>
            <p>
              {formMode === 'login'
                ? 'Buat akun untuk mendapatkan akses ke fitur kami!'
                : 'Masuk ke akun kamu untuk melanjutkan.'}
            </p>
            <button
              onClick={() => {
                setMessage('');
                setFormMode(formMode === 'login' ? 'register' : 'login');
              }}
              className="border border-white py-1 px-6 rounded-full font-semibold hover:bg-white hover:text-blue-800 transition"
            >
              {formMode === 'login' ? 'DAFTAR' : 'LOGIN'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
