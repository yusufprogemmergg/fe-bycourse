'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { get } from '@/lib/api' // axios instance kamu
import ReactPlayer from 'react-player'
import Link from 'next/link'

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
  image: string
  modules: Module[]
}

export default function LessonPage() {
  const { courseId, lessonId } = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)

  useEffect(() => {
    const fetchCourse = async () => {
      const token = localStorage.getItem("token") || ""
      const res = await get(`/mycourse/${courseId}`, token)
      setCourse(res)
      const allLessons = res.modules.flatMap((m: Module) => m.lessons)
      const selected = allLessons.find((l: Lesson) => l.id === Number(lessonId))
      setCurrentLesson(selected)
    }
    fetchCourse()
  }, [courseId, lessonId,])

  if (!course || !currentLesson) return <div>Loading...</div>

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-72 bg-gray-100 p-4 border-r">
        <h2 className="text-lg font-bold mb-4">{course.title}</h2>
        {course.modules.map((module) => (
          <div key={module.id} className="mb-4">
            <h3 className="font-semibold">{module.title}</h3>
            <ul>
              {module.lessons.map((lesson) => (
                <li key={lesson.id}>
                  <Link
                    href={`/dashboard/coursesaya/${courseId}/lesson/${lesson.id}`}
                    className={`block px-2 py-1 rounded hover:bg-gray-200 ${
                      lesson.id === Number(lessonId) ? 'bg-blue-100 font-semibold' : ''
                    }`}
                  >
                    {lesson.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">{currentLesson.title}</h1>
        <div className="aspect-video w-full max-w-4xl mb-6">
          <ReactPlayer
            url={currentLesson.content}
            width="100%"
            height="100%"
            controls
          />
        </div>
      </main>
    </div>
  )
}
