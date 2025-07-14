'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function OAuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const hash = window.location.hash
    const params = new URLSearchParams(hash.replace('#', ''))

    const access_token = params.get('access_token')

    if (access_token) {
      // Kirim access_token ke backend untuk proses user dan generate JWT
      axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/oauth/callback`, {
        access_token,
      })
      .then((res) => {
        const token = res.data.token
        localStorage.setItem('token', token)
        router.push('/dashboard') // Redirect ke halaman setelah login
      })
      .catch((err) => {
        console.error('OAuth login error:', err)
        alert('Gagal login dengan Google.')
        router.push('/login')
      })
    } else {
      alert('Access token tidak ditemukan di URL.')
      router.push('/login')
    }
  }, [router])

  return <p className="p-4 text-center">Menyelesaikan login Google...</p>
}
