'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { post } from '@/lib/api'

export default function AuthPage() {
  const router = useRouter()
  const [formMode, setFormMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await post('/auth/login', { email, password }, '')
      if (result.token) {
        localStorage.setItem('token', result.token)
        router.push('/dashboard')
      } else {
        setMessage(result.message || 'Login gagal.')
      }
    } catch {
      setMessage('Terjadi kesalahan saat login.')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await post('/auth/register', { name, email, password }, '')
      if (result.token) {
        localStorage.setItem('token', result.token)
        router.push('/dashboard')
      } else {
        setMessage(result.message || 'Gagal register.')
      }
    } catch {
      setMessage('Terjadi kesalahan saat register.')
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const result = await post('/auth/oauth/google', {}, '')
      if (result.url) {
        window.location.href = result.url
      }
    } catch {
      setMessage('Gagal login dengan Google.')
    }
  }

  const handleMagicLink = async () => {
    try {
      const result = await post('/auth/magiclink', { email }, '')
      setMessage(result.message || 'Cek email kamu untuk login.')
    } catch {
      setMessage('Gagal mengirim magic link.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-8 transition-all">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {formMode === 'login' ? 'Login' : 'Register'}
        </h2>

        {message && (
          <div className="text-sm text-red-500 text-center mb-2">{message}</div>
        )}

        <form onSubmit={formMode === 'login' ? handleLogin : handleRegister} className="space-y-4">
          {formMode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            />
          </div>

          {formMode === 'login' || formMode === 'register' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              />
            </div>
          ) : null}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {formMode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>

        {formMode === 'login' && (
          <>
            <button
              onClick={handleGoogleLogin}
              className="mt-3 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Login dengan Google
            </button>
            <button
              onClick={handleMagicLink}
              className="mt-2 w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700"
            >
              Kirim Magic Link ke Email
            </button>
          </>
        )}

        <p className="mt-4 text-sm text-center">
          {formMode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
          <button
            type="button"
            className="text-blue-600 underline"
            onClick={() =>
              setFormMode((prev) => (prev === 'login' ? 'register' : 'login'))
            }
          >
            {formMode === 'login' ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
}
