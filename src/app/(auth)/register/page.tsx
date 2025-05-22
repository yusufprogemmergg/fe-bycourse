'use client';
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { post } from "@/lib/api";
import { useState } from "react";

type FormData = {
  name: string;
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  // Skema validasi Yup
  const schema = Yup.object().shape({
    name: Yup.string().required("Nama wajib diisi"),
    username: Yup.string().required("Username wajib diisi"),
    email: Yup.string().email("Email tidak valid").required("Email wajib diisi"),
    password: Yup.string().min(8, "Password minimal 6 karakter").required("Password wajib diisi"),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref("password")], "Konfirmasi password tidak cocok")
      .required("Konfirmasi password wajib diisi"),
  });

  // Inisialisasi react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  // Fungsi submit
  const onSubmit = async (data: FormData) => {
    try {
      const result = await post("/auth/register", data, "");

if (result.message) {
  setMessage(result.message); // Menampilkan pesan jika ada
  if (result.status) {
    setTimeout(() => router.push("/login"), 3000);
  }
} else {
  setMessage("Gagal register");
}

    } catch (error) {
      console.error(error);
      setMessage("Terjadi kesalahan saat registrasi");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center mb-4">Register</h1>

      <div>
        <input {...register("name")} placeholder="Name" className="border p-2 w-full" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <input {...register("username")} placeholder="Username" className="border p-2 w-full" />
        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
      </div>

      <div>
        <input type="email" {...register("email")} placeholder="Email" className="border p-2 w-full" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <input type="password" {...register("password")} placeholder="Password" className="border p-2 w-full" />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      <div>
        <input type="password" {...register("passwordConfirm")} placeholder="Confirm Password" className="border p-2 w-full" />
        {errors.passwordConfirm && <p className="text-red-500 text-sm">{errors.passwordConfirm.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 w-full">
        {isSubmitting ? "Mendaftarkan..." : "Register"}
      </button>

      {message && <p className="text-center text-red-500">{message}</p>}
    </form>
  );
}
