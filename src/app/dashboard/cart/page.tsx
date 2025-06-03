'use client'

import { useEffect, useState } from 'react'
import { get, del, post } from '@/lib/api'
import { toast } from 'sonner'

interface Course {
  cartId: number
  id: number
  title: string
  price: number
  discount: number
  finalPrice: number
}

export default function CartPage() {
  const [token, setToken] = useState<string | null>(null)
  const [cartCourses, setCartCourses] = useState<Course[]>([])

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    setToken(storedToken)
    if (storedToken) fetchCart(storedToken)
  }, [])

  const fetchCart = async (token: string) => {
    try {
      const res = await get('/cart-wishlist/cart', token)

      interface CartItem {
        id: number // cart.id
        course: {
          id: number
          title: string
          price: number
          discount: number
        }
      }

      const courses = res?.cartItems?.map((item: CartItem) => {
        const course = item.course
        const finalPrice = Math.round(course.price - (course.price * course.discount) / 100)
        return {
          cartId: item.id,
          id: course.id,
          title: course.title,
          price: course.price,
          discount: course.discount,
          finalPrice,
        }
      }) || []

      setCartCourses(courses)
    } catch (error) {
      console.error('Fetch cart error:', error)
      toast.error('Gagal memuat cart.')
    }
  }

const removeItem = async (cartId: number) => {
  try {
    const res = await del(`/cart-wishlist/cart/item/${cartId}`, token!)

    if (res?.message === 'Item berhasil dihapus dari cart.') {
      setCartCourses(prev => prev.filter(item => item.cartId !== cartId))
      toast.success('Item dihapus dari cart.')
    } else {
      toast.error('Gagal menghapus item.')
    }
  } catch {
    toast.error('Terjadi kesalahan saat menghapus item.')
  }
}


const handleCheckout = async () => {
  const courseIds = cartCourses.map(course => course.id)
  try {
    const res = await post('/api/order/checkout', { courseIds }, token!)

    if (res.redirectUrl) {
      toast.success('Mengalihkan ke pembayaran...')
      window.location.href = res.redirectUrl
    } else {
      toast.error('Checkout gagal.')
    }
  } catch (error) {
    console.error('Checkout error:', error)
    toast.error('Terjadi kesalahan saat checkout.')
  }
}


  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Keranjang Anda</h1>
      {cartCourses.length === 0 ? (
        <p>Tidak ada item di keranjang.</p>
      ) : (
        <>
          <ul className="mb-4">
            {cartCourses.map(course => (
              <li key={course.cartId} className="mb-4 p-4 border rounded-md shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">{course.title}</span>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 line-through">Rp{course.price.toLocaleString()}</p>
                    <p className="text-lg font-bold text-blue-600">Rp{course.finalPrice.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-2 text-right">
                  <button
                    onClick={() => removeItem(course.cartId)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={handleCheckout}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
          >
            Checkout & Bayar
          </button>
        </>
      )}
    </div>
  )
}
