'use client'

import { useEffect, useState } from 'react'
import { get, post } from '@/lib/api'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'

interface Course {
  id: number
  title: string
  description: string
  image: string
  price: number
  discount: number
  finalPrice: number
  category: {
    id: number
    name: string
  }
}

export default function CourseMarketplace() {
  const [courses, setCourses] = useState<Course[]>([])
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token')
      setToken(storedToken)
    }
  }, [])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await get('/course/get/available', token!)
        setCourses(res || [])
      } catch {
        toast.error('Failed to fetch courses')
      }
    }
    if (token) fetchCourses()
  }, [token])

  const addToCart = async (courseId: number) => {
    const res = await post('/cart-wishlist/cart', { courseId }, token!)
    if (res) toast.success('Added to cart!')
    else toast.error('Failed to add to cart')
  }

  const addToWishlist = async (courseId: number) => {
    const res = await post('/cart-wishlist/wishlist', { courseId }, token!)
    if (res) toast.success('Added to wishlist!')
    else toast.error('Failed to add to wishlist')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Explore Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white rounded-xl shadow p-4 flex flex-col">
            <Link href={`/dashboard/course/${course.id}`}>
              <Image
                src={course.image}
                alt="course image"
                width={400}
                height={200}
                className="w-full h-[200px] object-cover rounded-md cursor-pointer"
              />
            </Link>
            <h2 className="text-lg font-semibold mt-2">{course.title}</h2>
            <p className="text-sm text-gray-500 mb-1">{course.category.name}</p>

            <div className="mb-4">
              {course.finalPrice < course.price ? (
                <>
                  <p className="text-sm line-through text-gray-400">
                    Rp{course.price.toLocaleString()}
                  </p>
                  <p className="text-md font-bold text-blue-600">
                    Rp{course.finalPrice.toLocaleString()} ({course.discount}% OFF)
                  </p>
                </>
              ) : (
                <p className="text-md font-bold text-blue-600">
                  Rp{course.price.toLocaleString()}
                </p>
              )}
            </div>

            <div className="mt-auto space-y-2">
              <Link href={`/dashboard/course/${course.id}`}>
                <button className="w-full px-4 py-2 bg-gray-100 text-sm rounded hover:bg-gray-200">
                  View Details
                </button>
              </Link>
              <button
                onClick={() => addToCart(course.id)}
                className="w-full px-4 py-2 bg-yellow-400 text-sm rounded hover:bg-yellow-500"
              >
                Add to Cart
              </button>
              <button
                onClick={() => addToWishlist(course.id)}
                className="w-full px-4 py-2 bg-pink-500 text-white text-sm rounded hover:bg-pink-600"
              >
                Wishlist
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
