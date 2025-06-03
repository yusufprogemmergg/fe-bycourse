'use client';
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { post } from "@/lib/api";
import { useState } from "react";

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const schema = Yup.object().shape({
    email: Yup.string().email("Email tidak valid").required("Email wajib diisi"),
    password: Yup.string().required("Password wajib diisi"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

const onSubmit = async (data: LoginFormData) => {
  try {
    const result = await post("/auth/login", data, "");

    if (result.token) {
      localStorage.setItem("token", result.token);

      // Cek apakah user sudah punya profil
      if (result.user?.profile) {
        router.push("/dashboard");
      } else {
        router.push("/addprofile");
      }
    } else {
      setMessage(result.message || "Gagal login");
    }
  } catch (error) {
    console.error(error);
    setMessage("Terjadi kesalahan saat login");
  }
};


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center mb-4">Login</h1>

      <div>
        <input
          type="email"
          {...register("email")}
          placeholder="Email"
          className="border p-2 w-full"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className="border p-2 w-full"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 w-full">
        {isSubmitting ? "Memproses..." : "Login"}
      </button>

      {message && <p className="text-center text-red-500">{message}</p>}
    </form>
  );
}
