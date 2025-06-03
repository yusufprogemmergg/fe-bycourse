'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { get, post, put, del } from '@/lib/api'
import { toast } from 'sonner'
import { supabase } from '@/utils/supabaseClient'

interface Lesson {
  id: number
  title: string
  content: string
  position: string
}

interface Module {
  id: number
  title: string
  description: string
  position: string
  lessons: Lesson[]
}

export default function ModulePage() {
  const { id: courseId } = useParams()
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null)
  const [showModuleForm, setShowModuleForm] = useState(false)
  const [showLessonFormForModule, setShowLessonFormForModule] = useState<number | null>(null)
  const [newModule, setNewModule] = useState({ title: '', description: '', position: '' })
  const [newLesson, setNewLesson] = useState({ title: '', content: null as File | null, position: '', video: null as File | null })
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token')
      setToken(storedToken)
    }
  }, [])

  const uploadFile = async (file: File, path: string) => {
    const { data, error } = await supabase.storage.from('lessons').upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    })

    if (error) {
      console.error('Upload error:', error)
      return null
    }

    const { data: publicUrlData } = supabase.storage.from('lessons').getPublicUrl(data.path)
    return publicUrlData?.publicUrl || null
  }

  const fetchModules = useCallback(async () => {
    if (!token) return
    const res = await get(`/module/module/${courseId}`, token)
    if (Array.isArray(res.modules)) {
      const filledModules = res.modules.map((m: Module) => ({
        ...m,
        lessons: m.lessons || [],
      }))
      setModules(filledModules)
    }
    setLoading(false)
  }, [courseId, token])

  useEffect(() => {
    if (token) fetchModules()
  }, [token, fetchModules])

  const handleAddModule = async () => {
    const { title, description, position } = newModule
    if (!title || !description) return toast.error('Isi semua field')
    const res = await post('/module/addmodule', { title, description, courseId: Number(courseId), position }, token!)
    if (res) {
      toast.success('Module added')
      setNewModule({ title: '', description: '', position: '' })
      setShowModuleForm(false)
      fetchModules()
    } else {
      toast.error('Failed to add module')
    }
  }

  const handleAddLesson = async (moduleId: number) => {
    const { title, position, video } = newLesson
    if (!title || !video || !position) return toast.error('Lengkapi semua field')

    const videoPath = `${Date.now()}-${video.name}`
    const videoUrl = await uploadFile(video, videoPath)
    if (!videoUrl) return toast.error('Gagal upload video')

    const res = await post('/module/addlesson', {
      title,
      content: videoUrl,
      position,
      moduleId,
    }, token!)

    if (res && res.lesson) {
      toast.success('Lesson ditambahkan')
      setNewLesson({ title: '', content: null, position: '', video: null })
      setShowLessonFormForModule(null)
      fetchModules()
    } else {
      toast.error('Gagal menambahkan lesson')
    }
  }

  const editModule = async (id: number) => {
    const title = prompt('New Module Title:')
    const description = prompt('New Description:')
    if (!title || !description) return
    const res = await put(`/module/${id}`, { title, description }, token!)
    if (res) {
      toast.success('Module updated')
      fetchModules()
    } else {
      toast.error('Failed to update module')
    }
  }

  const deleteModule = async (id: number) => {
    if (!confirm('Delete this module?')) return
    const res = await del(`/module/${id}`, token!)
    if (res) {
      toast.success('Module deleted')
      fetchModules()
    } else {
      toast.error('Failed to delete module')
    }
  }

  const editLesson = async (moduleId: number, lessonId: number) => {
    const title = prompt('New Lesson Title:')
    const content = prompt('New Content:')
    if (!title || !content) return
    const res = await put(`/module/lesson/${lessonId}`, { title, content }, token!)
    if (res) {
      toast.success('Lesson updated')
      fetchModules()
    } else {
      toast.error('Failed to update lesson')
    }
  }

  const deleteLesson = async (moduleId: number, lessonId: number) => {
    if (!confirm('Delete this lesson?')) return
    const res = await del(`/lesson/${lessonId}`, token!)
    if (res) {
      toast.success('Lesson deleted')
      fetchModules()
    } else {
      toast.error('Failed to delete lesson')
    }
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Modules & Lessons</h1>
        <button onClick={() => setShowModuleForm(true)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">+ Add Module</button>
      </div>

      {/* Modal Module */}
      {showModuleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">New Module</h2>
            <input type="text" placeholder="Title" value={newModule.title} onChange={(e) => setNewModule({ ...newModule, title: e.target.value })} className="w-full border px-3 py-2 mb-3 rounded" />
            <input type="text" placeholder="Description" value={newModule.description} onChange={(e) => setNewModule({ ...newModule, description: e.target.value })} className="w-full border px-3 py-2 mb-3 rounded" />
            <input type="text" placeholder="Position" value={newModule.position} onChange={(e) => setNewModule({ ...newModule, position: e.target.value })} className="w-full border px-3 py-2 mb-3 rounded" />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowModuleForm(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={handleAddModule} className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
            </div>
          </div>
        </div>
      )}

      {modules.map(module => (
        <div key={module.id} className="mb-6 border rounded shadow p-4 bg-white">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-xl font-semibold">{module.title}</h2>
              <p className="text-sm text-gray-600">{module.description}</p>
            </div>
            <div className="space-x-2">
              <button onClick={() => editModule(module.id)} className="text-yellow-600 hover:underline">Edit</button>
              <button onClick={() => deleteModule(module.id)} className="text-red-600 hover:underline">Delete</button>
              <button onClick={() => setShowLessonFormForModule(module.id)} className="text-blue-600 hover:underline">+ Lesson</button>
            </div>
          </div>

          {showLessonFormForModule === module.id && (
            <div className="bg-gray-50 border p-4 rounded mb-4">
              <h3 className="text-md font-medium mb-2">Add Lesson</h3>
              <input type="text" placeholder="Lesson Title" value={newLesson.title} onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })} className="w-full border px-3 py-2 mb-2 rounded" />
              <input type="file" accept="video/*" onChange={(e) => setNewLesson({ ...newLesson, video: e.target.files?.[0] || null })} className="w-full border px-3 py-2 mb-2 rounded" />
              <input type="text" placeholder="Position" value={newLesson.position} onChange={(e) => setNewLesson({ ...newLesson, position: e.target.value })} className="w-full border px-3 py-2 mb-3 rounded" />
              <div className="flex justify-end space-x-2">
                <button onClick={() => setShowLessonFormForModule(null)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button onClick={() => handleAddLesson(module.id)} className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
              </div>
            </div>
          )}

          <ul className="list-disc ml-6">
            {module.lessons.map(lesson => (
              <li key={lesson.id} className="mb-2">
                <div className="flex justify-between items-center">
                  <span>{lesson.title}</span>
                  <div className="space-x-2 text-sm">
                    <button onClick={() => setActiveLessonId(activeLessonId === lesson.id ? null : lesson.id)} className="text-blue-500 hover:underline">
                      {activeLessonId === lesson.id ? 'Hide' : 'View'}
                    </button>
                    <button onClick={() => editLesson(module.id, lesson.id)} className="text-yellow-500 hover:underline">Edit</button>
                    <button onClick={() => deleteLesson(module.id, lesson.id)} className="text-red-500 hover:underline">Delete</button>
                  </div>
                </div>
                {activeLessonId === lesson.id && (
                  <div className="mt-2">
                    <video src={lesson.content} controls className="w-full rounded shadow" />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
