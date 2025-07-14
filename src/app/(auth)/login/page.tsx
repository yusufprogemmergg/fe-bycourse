'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { post } from '@/lib/api';

// ✅ Type Definitions
type LoginFormData = {
  email: string;
  password: string;
};

type RegisterFormData = {
  name: string;
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export default function AuthPage() {
  const [formMode, setFormMode] = useState<'login' | 'register'>('register');
  const [message, setMessage] = useState('');
  const router = useRouter();

  // ✅ Login Schema
  const loginSchema = Yup.object().shape({
    email: Yup.string().email('Email tidak valid').required('Email wajib diisi'),
    password: Yup.string().required('Password wajib diisi'),
  });

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
  } = useForm<LoginFormData>({ resolver: yupResolver(loginSchema) });

  const handleLogin = async (data: LoginFormData) => {
    try {
      const result = await post('/auth/login', data, '');
      if (result.token) {
        localStorage.setItem('token', result.token);
        router.push(result.user?.profile ? '/dashboard' : '/addprofile');
      } else {
        setMessage(result.message || 'Gagal login');
      }
    } catch {
      setMessage('Terjadi kesalahan saat login');
    }
  };

  // ✅ Register Schema
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
    register: regRegister,
    handleSubmit: handleRegSubmit,
    formState: { errors: regErrors, isSubmitting: isRegSubmitting },
  } = useForm<RegisterFormData>({ resolver: yupResolver(registerSchema) });

  const handleRegister = async (data: RegisterFormData) => {
    try {
      const result = await post('/auth/register', data, '');
      if (result.status) {
        setMessage('Berhasil daftar. Silakan login...');
        setTimeout(() => setFormMode('login'), 1000);
      } else {
        setMessage(result.message || 'Gagal daftar');
      }
    } catch {
      setMessage('Terjadi kesalahan saat daftar');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/oauth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-900 px-4">
      <div className="relative w-full max-w-4xl h-[550px] overflow-hidden rounded-3xl shadow-2xl bg-white flex">
        <div
          className={`absolute top-0 left-0 w-[200%] h-full flex transition-transform duration-700 ease-in-out ${
            formMode === 'login' ? '-translate-x-1/2' : 'translate-x-0'
          }`}
        >
          {/* REGISTER FORM */}
          <div className="w-1/2 p-10 flex flex-col justify-center bg-white">
            <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Daftar</h2>
            <form onSubmit={handleRegSubmit(handleRegister)} className="space-y-4">
              <input {...regRegister('name')} placeholder="Nama" className="input-style" />
              <p className="error-text">{regErrors.name?.message}</p>

              <input {...regRegister('username')} placeholder="Username" className="input-style" />
              <p className="error-text">{regErrors.username?.message}</p>

              <input type="email" {...regRegister('email')} placeholder="Email" className="input-style" />
              <p className="error-text">{regErrors.email?.message}</p>

              <input type="password" {...regRegister('password')} placeholder="Password" className="input-style" />
              <p className="error-text">{regErrors.password?.message}</p>

              <input
                type="password"
                {...regRegister('passwordConfirm')}
                placeholder="Konfirmasi Password"
                className="input-style"
              />
              <p className="error-text">{regErrors.passwordConfirm?.message}</p>

              <button type="submit" disabled={isRegSubmitting} className="submit-button">
                {isRegSubmitting ? 'Mendaftarkan...' : 'DAFTAR'}
              </button>
              {message && <p className="text-center text-red-500 text-sm">{message}</p>}
            </form>
          </div>

          {/* LOGIN FORM */}
          <div className="w-1/2 p-10 flex flex-col justify-center bg-white">
            <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Masuk</h2>
            <form onSubmit={handleLoginSubmit(handleLogin)} className="space-y-4">
              <input type="email" {...loginRegister('email')} placeholder="Email" className="input-style" />
              <p className="error-text">{loginErrors.email?.message}</p>

              <input type="password" {...loginRegister('password')} placeholder="Password" className="input-style" />
              <p className="error-text">{loginErrors.password?.message}</p>

              <button type="submit" disabled={isLoginSubmitting} className="submit-button">
                {isLoginSubmitting ? 'Memproses...' : 'MASUK'}
              </button>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="submit-button bg-red-600 hover:bg-red-700 mt-2"
              >
                Login dengan Google
              </button>

              <p className="text-center text-sm text-blue-700">Lupa password?</p>
              {message && <p className="text-center text-red-500 text-sm">{message}</p>}
            </form>
          </div>
        </div>

        {/* SLIDE PANEL */}
        <div
          className="absolute top-0 h-full w-1/2 bg-blue-700 text-white z-10 transition-all duration-700 ease-in-out flex items-center justify-center rounded-3xl"
          style={{
            transform: formMode === 'login' ? 'translateX(100%)' : 'translateX(0%)',
          }}
        >
          <div className="text-center px-8 space-y-4">
            <h2 className="text-2xl font-bold">
              {formMode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}
            </h2>
            <button
              onClick={() => setFormMode(formMode === 'login' ? 'register' : 'login')}
              className="bg-white text-blue-700 font-semibold px-6 py-2 rounded-full shadow hover:bg-gray-100 transition"
            >
              {formMode === 'login' ? 'Daftar' : 'Masuk'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
