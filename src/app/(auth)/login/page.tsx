'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { post } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await post('/auth/login', { email, password }, '')
      if (result.token) {
        localStorage.setItem('token', result.token)
        router.push('/dashboard') // redirect ke halaman setelah login
      } else {
        setMessage('Login gagal: ' + result.message)
      }
    } catch {
      setMessage('Terjadi kesalahan saat login')
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const result = await post('/auth/oauth/google', {}, '')
      if (result && result.url) {
        window.location.href = result.url
      }
    } catch {
      setMessage('Gagal login dengan Google')
    }
  }

  const handleMagicLink = async () => {
    try {
      const result = await post('/auth/magiclink', { email }, '')
      setMessage(result.message || 'Cek email kamu untuk login.')
    } catch {
      setMessage('Gagal mengirim magic link')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        {message && (
          <div className="text-sm text-red-500 text-center">{message}</div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Login
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Login dengan Google
        </button>

        <button
          type="button"
          onClick={handleMagicLink}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded"
        >
          Kirim Magic Link ke Email
        </button>
      </form>
    </div>
  )
}
