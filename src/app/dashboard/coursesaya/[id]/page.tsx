// app/(dashboard)/course/[id]/page.tsx

"use client"

import { get } from "@/lib/api"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"

interface Lesson {
  id: number
  title: string
  content: string
  position: number
}

interface Module {
  id: number
  title: string
  position: number
  lessons: Lesson[]
}

interface Course {
  id: number
  title: string
  description: string
  image: string
  category: { id: number; name: string }
  modules: Module[]
}

export default function CourseDetailPage() {
  const [course, setCourse] = useState<Course | null>(null)
  const params = useParams()
  const courseId = params?.id as string

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token") || ""
      const res = await get(`/mycourse/${courseId}`, token)
      setCourse(res)
    }

    fetchData()
  }, [courseId])

  if (!course) return <div className="p-4">Loading course...</div>

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-xl overflow-hidden shadow-md">
        <Image src={course.image} alt={course.title} className="w-full max-h-96 object-cover" />
      </div>

      <div>
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="text-gray-600 mt-2">{course.description}</p>
        <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
          {course.category.name}
        </span>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Modules & Lessons</h2>
        {course.modules.length === 0 ? (
          <p className="text-gray-500">No modules available.</p>
        ) : (
          course.modules.map((module) => (
            <div key={module.id} className="border p-4 rounded-lg">
              <h3 className="font-bold mb-2">
                {module.position}. {module.title}
              </h3>
              {module.lessons.length === 0 ? (
                <p className="text-sm text-gray-500">No lessons in this module.</p>
              ) : (
                <ul className="space-y-2 pl-4">
                  {module.lessons.map((lesson) => (
                    <li key={lesson.id}>
                      <p className="font-medium">{lesson.position}. {lesson.title}</p>
                      <video controls className="w-full rounded mt-2">
                        <source src={lesson.content} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
