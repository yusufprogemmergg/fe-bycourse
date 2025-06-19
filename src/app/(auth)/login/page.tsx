'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { post } from '@/lib/api';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import clsx from 'clsx';

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
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // LOGIN
  const loginSchema = Yup.object().shape({
    email: Yup.string().email('Email tidak valid').required('Email wajib diisi'),
    password: Yup.string().required('Password wajib diisi'),
  });

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoggingIn },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      const result = await post('/auth/login', data, '');

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
    } catch (error) {
      console.error(error);
      setMessage('Terjadi kesalahan saat login');
    }
  };

  // REGISTER
  const registerSchema = Yup.object().shape({
    name: Yup.string().required('Nama wajib diisi'),
    username: Yup.string().required('Username wajib diisi'),
    email: Yup.string().email('Email tidak valid').required('Email wajib diisi'),
    password: Yup.string().min(8, 'Minimal 8 karakter').required('Password wajib diisi'),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref('password')], 'Konfirmasi password tidak cocok')
      .required('Konfirmasi password wajib diisi'),
  });

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors, isSubmitting: isRegistering },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const handleRegister = async (data: RegisterFormData) => {
    try {
      const result = await post('/auth/register', data, '');
      if (result.status) {
        setMessage('Berhasil register. Mengarahkan ke login...');
        setTimeout(() => setIsRegister(false), 2000);
      } else {
        setMessage(result.message || 'Gagal register');
      }
    } catch (error) {
      console.error(error);
      setMessage('Terjadi kesalahan saat registrasi');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <div className="flex justify-center mb-4">
          <button
            className={clsx(
              'w-1/2 py-2 font-semibold',
              !isRegister ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            )}
            onClick={() => {
              setMessage('');
              setIsRegister(false);
            }}
          >
            Login
          </button>
          <button
            className={clsx(
              'w-1/2 py-2 font-semibold',
              isRegister ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            )}
            onClick={() => {
              setMessage('');
              setIsRegister(true);
            }}
          >
            Register
          </button>
        </div>

        {/* FORM AREA */}
        <div className="transition-all duration-300">
          {isRegister ? (
            <form onSubmit={handleRegisterSubmit(handleRegister)} className="space-y-4">
              <h2 className="text-xl font-bold text-center">Buat Akun</h2>

              <input {...registerRegister('name')} placeholder="Nama" className="input" />
              {registerErrors.name && <p className="text-sm text-red-500">{registerErrors.name.message}</p>}

              <input {...registerRegister('username')} placeholder="Username" className="input" />
              {registerErrors.username && <p className="text-sm text-red-500">{registerErrors.username.message}</p>}

              <input {...registerRegister('email')} type="email" placeholder="Email" className="input" />
              {registerErrors.email && <p className="text-sm text-red-500">{registerErrors.email.message}</p>}

              <div className="relative">
                <input
                  {...registerRegister('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="input pr-10"
                />
                <div className="icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
              {registerErrors.password && <p className="text-sm text-red-500">{registerErrors.password.message}</p>}

              <div className="relative">
                <input
                  {...registerRegister('passwordConfirm')}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Konfirmasi Password"
                  className="input pr-10"
                />
                <div className="icon" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
              {registerErrors.passwordConfirm && (
                <p className="text-sm text-red-500">{registerErrors.passwordConfirm.message}</p>
              )}

              <button type="submit" disabled={isRegistering} className="btn-primary">
                {isRegistering ? 'Mendaftarkan...' : 'Daftar'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit(handleLogin)} className="space-y-4">
              <h2 className="text-xl font-bold text-center">Masuk</h2>

              <input {...loginRegister('email')} type="email" placeholder="Email" className="input" />
              {loginErrors.email && <p className="text-sm text-red-500">{loginErrors.email.message}</p>}

              <div className="relative">
                <input
                  {...loginRegister('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="input pr-10"
                />
                <div className="icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
              {loginErrors.password && <p className="text-sm text-red-500">{loginErrors.password.message}</p>}

              <button type="submit" disabled={isLoggingIn} className="btn-primary">
                {isLoggingIn ? 'Memproses...' : 'Login'}
              </button>
            </form>
          )}
          {message && <p className="text-center text-sm text-red-500 mt-4">{message}</p>}
        </div>
      </div>
    </div>
  );
}
