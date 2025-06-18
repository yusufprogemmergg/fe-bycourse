'use client';
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { post } from "@/lib/api";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const schema = Yup.object().shape({
    name: Yup.string().required("Nama wajib diisi"),
    username: Yup.string().required("Username wajib diisi"),
    email: Yup.string().email("Email tidak valid").required("Email wajib diisi"),
    password: Yup.string().min(8, "Password minimal 8 karakter").required("Password wajib diisi"),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref("password")], "Konfirmasi password tidak cocok")
      .required("Konfirmasi password wajib diisi"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    try {
      const result = await post("/auth/register", data, "");
      if (result.message) {
        setMessage(result.message);
        if (result.status) {
          setTimeout(() => router.push("/login"), 2000);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-5"
      >
        <h1 className="text-3xl font-bold text-center text-blue-600">Buat Akun</h1>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium">Nama</label>
          <input
            {...register("name")}
            placeholder="Nama lengkap"
            className={`mt-1 border rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 ${
              errors.name ? "border-red-500 ring-red-200" : "border-gray-300 focus:ring-blue-300"
            }`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            {...register("username")}
            placeholder="Username unik"
            className={`mt-1 border rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 ${
              errors.username ? "border-red-500 ring-red-200" : "border-gray-300 focus:ring-blue-300"
            }`}
          />
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            {...register("email")}
            placeholder="Email aktif"
            className={`mt-1 border rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 ${
              errors.email ? "border-red-500 ring-red-200" : "border-gray-300 focus:ring-blue-300"
            }`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="relative">
          <label className="block text-sm font-medium">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="Minimal 8 karakter"
            className={`mt-1 border rounded-xl px-4 py-2 w-full pr-10 focus:outline-none focus:ring-2 ${
              errors.password ? "border-red-500 ring-red-200" : "border-gray-300 focus:ring-blue-300"
            }`}
          />
          <div
            className="absolute right-3 top-[38px] cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="block text-sm font-medium">Konfirmasi Password</label>
          <input
            type={showConfirm ? "text" : "password"}
            {...register("passwordConfirm")}
            placeholder="Ulangi password"
            className={`mt-1 border rounded-xl px-4 py-2 w-full pr-10 focus:outline-none focus:ring-2 ${
              errors.passwordConfirm ? "border-red-500 ring-red-200" : "border-gray-300 focus:ring-blue-300"
            }`}
          />
          <div
            className="absolute right-3 top-[38px] cursor-pointer"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
          {errors.passwordConfirm && (
            <p className="text-red-500 text-xs mt-1">{errors.passwordConfirm.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition"
        >
          {isSubmitting ? "Mendaftarkan..." : "Daftar"}
        </button>

        {/* Message */}
        {message && <p className="text-center text-sm text-red-500 mt-2">{message}</p>}

        {/* Link to Login */}
        <p className="text-sm text-center mt-4">
          Sudah punya akun?{" "}
          <span
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
            onClick={() => router.push("/login")}
          >
            Masuk di sini
          </span>
        </p>
      </form>
    </div>
  );
}
