'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { get, post } from '@/lib/api'
import Image from 'next/image'
import { toast } from 'sonner'

interface Lesson {
  id: number
  title: string
}

interface Module {
  id: number
  title: string
  lessons: Lesson[]
}

interface CourseDetail {
  id: number
  title: string
  description: string
  image: string
  price: number
  discount: number
  finalPrice: number
  category: { name: string }
  modules: Module[]
  isPurchased: boolean
}

export default function CourseDetailPage() {
  const { id } = useParams()
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    setToken(storedToken)
  }, [])

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const res = await get(`/course/${id}`, token!)
        setCourse(res)
      } catch {
        toast.error('Failed to load course')
      }
    }
    if (id && token) fetchCourseDetail()
  }, [id, token])

  const handleBuyCourse = async () => {
    const res = await post('/checkout', { courseId: course?.id }, token!)
    if (res?.redirectUrl) {
      window.location.href = res.redirectUrl
    } else {
      toast.error('Gagal melakukan pembelian')
    }
  }

  if (!course) return <p className="text-center py-10">Loading...</p>

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-6">
        <Image
          src={course.image}
          alt="course image"
          width={400}
          height={300}
          className="rounded-md w-full md:w-1/2 h-auto object-cover"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <p className="text-sm text-gray-600 mb-2">{course.category.name}</p>
          <p className="text-gray-800 mb-4">{course.description}</p>

          <div className="mb-4">
            {course.finalPrice < course.price ? (
              <>
                <p className="line-through text-sm text-gray-400">
                  Rp{course.price.toLocaleString()}
                </p>
                <p className="text-xl font-bold text-blue-600">
                  Rp{course.finalPrice.toLocaleString()} ({course.discount}% OFF)
                </p>
              </>
            ) : (
              <p className="text-xl font-bold text-blue-600">
                Rp{course.price.toLocaleString()}
              </p>
            )}
          </div>

          {!course.isPurchased ? (
            <button
              onClick={handleBuyCourse}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Buy Course
            </button>
          ) : (
            <button
              disabled
              className="px-6 py-2 bg-green-500 text-white rounded cursor-default"
            >
              Course Purchased
            </button>
          )}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Course Content</h2>
        {course.modules.length === 0 ? (
          <p className="text-gray-500">No modules available.</p>
        ) : (
          <div className="space-y-4">
            {course.modules.map(module => (
              <div key={module.id} className="bg-gray-100 rounded-lg p-4">
                <h3 className="text-lg font-bold mb-2">{module.title}</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {module.lessons.map(lesson => (
                    <li key={lesson.id}>{lesson.title}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
