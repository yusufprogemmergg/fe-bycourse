'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { del } from '@/lib/api'

export default function SuccessPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Kamu belum login')
      router.push('/login')
      return
    }

    const resetCart = async () => {
      try {
        await del('/cart-wishlist/reset', token)
        toast.success('Checkout berhasil! Cart dikosongkan.')
      } catch (error) {
        console.error('Reset cart error:', error)
        toast.error('Gagal mengosongkan cart.')
      } finally {
        setLoading(false)
      }
    }

    resetCart()
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      {loading ? (
        <p className="text-lg text-gray-600">Memproses...</p>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-green-600 mb-4">Pembayaran Berhasil!</h1>
          <p className="text-gray-700 mb-6">Terima kasih! Anda sudah berhasil membeli course.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700 transition"
          >
            Lihat Course Saya
          </button>
        </>
      )}
    </div>
  )
}
