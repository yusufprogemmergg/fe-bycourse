'use client'

import { useEffect, useState } from 'react'
import { get } from '@/lib/api'
import { toast } from 'sonner'

interface Course {
  id: number
  title: string
  price: number
  discount: number
  finalPrice: number
}

export default function WishlistPage() {
  const [wishlistCourses, setWishlistCourses] = useState<Course[]>([])

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) fetchWishlist(storedToken)
  }, [])

  const fetchWishlist = async (token: string) => {
    try {
      const res = await get('/cart-wishlist/wishlist', token)

      interface WishlistItem {
        course: {
          id: number
          title: string
          price: number
          discount: number
        }
      }

      const courses = res?.wishlistItems?.map((item: WishlistItem) => {
        const course = item.course
        const finalPrice = course.price - (course.price * course.discount) / 100
        return {
          id: course.id,
          title: course.title,
          price: course.price,
          discount: course.discount,
          finalPrice,
        }
      }) || []

      setWishlistCourses(courses)
    } catch (error) {
      console.error('Fetch wishlist error:', error)
      toast.error('Gagal memuat wishlist.')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Wishlist Anda</h1>
      {wishlistCourses.length === 0 ? (
        <p>Belum ada course di wishlist.</p>
      ) : (
        <ul className="mb-4">
          {wishlistCourses.map(course => (
            <li key={course.id} className="mb-4 p-4 border rounded-md shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">{course.title}</span>
                <div className="text-right">
                  <p className="text-sm text-gray-500 line-through">Rp{course.price.toLocaleString()}</p>
                  <p className="text-lg font-bold text-green-600">Rp{course.finalPrice.toLocaleString()}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
