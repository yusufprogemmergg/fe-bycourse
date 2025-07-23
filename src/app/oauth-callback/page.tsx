'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function OAuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleSession = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        console.error('Gagal mendapatkan sesi:', error)
        alert('Gagal login.')
        router.push('/login')
        return
      }

      const access_token = data.session.access_token

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/oauth/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ access_token }),
        })

        const response = await res.json()
        localStorage.setItem('token', response.token) // Simpan token backend kamu
        router.push('/dashboard')
      } catch (err) {
        console.error('Error kirim token ke backend:', err)
        alert('Gagal login.')
        router.push('/login')
      }
    }

    handleSession()
  }, [router])

  return <p className="p-4 text-center">Menyelesaikan login Google...</p>
}
