'use client';

import { useForm } from "react-hook-form";
import { useState } from "react";
import { post } from "@/lib/api";
import { useRouter } from "next/navigation";

type CourseForm = {
  title: string;
  description: string;
  price: number;
  discount?: number;
  categoryId: number;
  image: FileList;
};

type CourseResponse = {
  id: number;
  title: string;
};

type ApiResponse<T> = {
  message: string;
  course?: T;
};

export default function UploadPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string>("");
  const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
  const courseForm = useForm<CourseForm>();

  const handleCourseSubmit = async (data: CourseForm) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    if (data.discount) formData.append("discount", data.discount.toString());
    formData.append("categoryId", data.categoryId.toString());
    formData.append("image", data.image[0]);

    const res: ApiResponse<CourseResponse> = await post("/course", formData, token);

    if (res.course?.id) {
      setMessage("✅ Course berhasil dibuat!");
      router.push("/mycourse"); // redirect ke halaman daftar course
    } else {
      setMessage(res.message || "❌ Gagal membuat course");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Upload Course Baru</h1>

      <form onSubmit={courseForm.handleSubmit(handleCourseSubmit)} className="space-y-4 border p-4 rounded shadow">
        <input placeholder="Title" {...courseForm.register("title")} className="border p-2 w-full" required />
        <textarea placeholder="Description" {...courseForm.register("description")} className="border p-2 w-full" required />
        <input type="number" placeholder="Price" {...courseForm.register("price")} className="border p-2 w-full" required />
        <input type="number" placeholder="Discount (%)" {...courseForm.register("discount")} className="border p-2 w-full" />
        <input type="number" placeholder="Category ID" {...courseForm.register("categoryId")} className="border p-2 w-full" required />
        <input type="file" {...courseForm.register("image")} className="w-full" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 w-full">Upload Course</button>
      </form>

      {message && <p className="text-center text-sm text-gray-700">{message}</p>}
    </div>
  );
}
