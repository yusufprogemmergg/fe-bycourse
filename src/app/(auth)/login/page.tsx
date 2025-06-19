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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex overflow-hidden">
        {/* Form Side */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">
            {formMode === 'login' ? 'GAMER4TK' : 'Daftar Akun'}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {formMode === 'register' && (
              <>
                <input
                  {...register('name')}
                  placeholder="Nama"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <p className="text-red-500 text-sm">{typeof errors.name?.message === 'string' ? errors.name.message : ''}</p>

                <input
                  {...register('username')}
                  placeholder="Username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <p className="text-red-500 text-sm">{typeof errors.username?.message === 'string' ? errors.username.message : ''}</p>
              </>
            )}

            <input
              {...register('email')}
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <p className="text-red-500 text-sm">{typeof errors.email?.message === 'string' ? errors.email.message : ''}</p>

            <input
              {...register('password')}
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <p className="text-red-500 text-sm">{typeof errors.password?.message === 'string' ? errors.password.message : ''}</p>

            {formMode === 'register' && (
              <>
                <input
                  {...register('passwordConfirm')}
                  type="password"
                  placeholder="Konfirmasi Password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <p className="text-red-500 text-sm">{typeof errors.passwordConfirm?.message === 'string' ? errors.passwordConfirm.message : ''}</p>
              </>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 rounded-full text-white font-bold bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition"
            >
              {isSubmitting
                ? formMode === 'login'
                  ? 'Memproses...'
                  : 'Mendaftarkan...'
                : formMode === 'login'
                ? 'MASUK'
                : 'DAFTAR'}
            </button>

            {formMode === 'login' && (
              <p className="text-sm text-center mt-2 text-blue-800 hover:underline cursor-pointer">
                Lupa password?
              </p>
            )}
            {message && <p className="text-center text-red-500 text-sm">{message}</p>}
          </form>
        </div>

        {/* Side Panel */}
        <div
          className="w-1/2 hidden md:flex flex-col items-center justify-center bg-cover bg-center text-white p-10 relative"
          style={{ backgroundImage: `url('/your-image.jpg')` }}
        >
          <div className="absolute inset-0 bg-blue-900 bg-opacity-70 rounded-tr-2xl rounded-br-2xl" />
          <div className="z-10 text-center space-y-4">
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
