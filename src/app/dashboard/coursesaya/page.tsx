"use client";

import { useEffect, useState } from "react";
import { get } from "@/lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Course {
  id: number;
  title: string;
  image: string | null;
}

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
      const res = await get("/mycourse", token || "");
      if (Array.isArray(res)) {
        setCourses(res);
      }
      setLoading(false);
    };

    fetchCourses();
  }, []);

  const handleStartCourse = (id: number) => {
    router.push(`/dashboard/coursesaya/${id}`);
  };

  if (loading) return <div className="text-center mt-10">Memuat data...</div>;

  if (courses.length === 0)
    return <div className="text-center mt-10">Belum ada course yang dibeli.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Course Saya</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white shadow rounded-lg overflow-hidden">
            {course.image && (
              <Image
                src={course.image}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">{course.title}</h2>
              <button
                onClick={() => handleStartCourse(course.id)}
                className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Mulai Course
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
