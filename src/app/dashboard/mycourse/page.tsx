'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { get, put, del } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  published?: boolean;
}

export default function MyCoursePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchCourses = async () => {
      const res = await get('/course/get/my', token!);
      if (Array.isArray(res)) {
        setCourses(res);
      }
      setLoading(false);
    };

    fetchCourses();
  }, [router, token]);

  const togglePublish = async (id: number, current: boolean) => {
    const res = await put(`/course/${id}`, { published: !current }, token!);
    if (res) {
      toast.success(`Course ${!current ? 'published' : 'unpublished'} successfully`);
      setCourses(prev =>
        prev.map(c => (c.id === id ? { ...c, published: !current } : c))
      );
    } else {
      toast.error('Failed to update publish status');
    }
  };

  const deleteCourse = async (id: number) => {
    const confirmed = confirm('Are you sure you want to delete this course?');
    if (!confirmed) return;
    const res = await del(`/course/${id}`, token!);
    if (res) {
      toast.success('Course deleted successfully');
      setCourses(prev => prev.filter(c => c.id !== id));
    } else {
      toast.error('Failed to delete course');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <Link
          href="course/addcourse"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <p>No courses found. <Link href="course/addcourse" className="text-blue-600 underline">Create one</Link>.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div
              key={course.id}
              className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition duration-200 bg-white"
            >
              <Image
                src={course.image}
                alt="course image"
                width={400}
                height={200}
                className="w-full h-[200px] object-cover"
              />

              <div className="p-4 space-y-2">
                <h2 className="text-xl font-semibold">{course.title}</h2>
                <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                <p className="text-lg font-bold text-blue-600">Rp{course.price.toLocaleString()}</p>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Link
                    href={`/dashboard/mycourse/module/${course.id}`}
                    className="text-sm px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    🧱 Modules
                  </Link>
                  <Link
                    href={`/course/edit/${course.id}`}
                    className="text-sm px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                  >
                    ✏️ Edit
                  </Link>
                  <button
                    onClick={() => deleteCourse(course.id)}
                    className="text-sm px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                  >
                    🗑️ Delete
                  </button>
                  <button
                    onClick={() => togglePublish(course.id, course.published ?? false)}
                    className={`text-sm px-3 py-1 rounded ${
                      course.published
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {course.published ? '✅ Published' : '🚫 Unpublished'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
