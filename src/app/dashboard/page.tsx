'use client';
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useState } from "react";
import axios from "axios";

// Bentuk data untuk form
type ProfileForm = {
  bio: string;
  address: string;
  avatar: FileList;
};

// Tipe respons dari server (bisa disesuaikan dengan respons backend kamu)
type ProfileResponse = {
  message: string;
  profile: {
    id: string;
    bio: string;
    avatarUrl: string;
    address: string;
    userId: string;
  };
};

export default function CreateProfilePage() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const schema: Yup.ObjectSchema<ProfileForm> = Yup.object({
    bio: Yup.string().required("Bio wajib diisi"),
    address: Yup.string().required("Alamat wajib diisi"),
    avatar: Yup.mixed<FileList>()
      .required("Avatar wajib diunggah")
      .test("fileExist", "File wajib dipilih", (value) => value instanceof FileList && value.length > 0),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: ProfileForm) => {
    const formData = new FormData();
    formData.append("file", data.avatar[0]);

    try {
      // Upload file
      const uploadRes = await axios.post<{ url: string }>("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const avatarUrl = uploadRes.data.url;

      // Kirim data profil
      const profileRes = await axios.post<ProfileResponse>(
        "/api/profile",
        { bio: data.bio, address: data.address, avatarUrl },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessage(profileRes.data.message);
      setTimeout(() => router.push("/dashboard"), 3000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data?.message || "Terjadi kesalahan saat membuat profil.");
      } else {
        setMessage("Terjadi kesalahan yang tidak diketahui.");
      }
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto mt-10" encType="multipart/form-data">
      <h1 className="text-2xl font-bold text-center mb-4">Buat Profil</h1>

      <div>
        <textarea {...register("bio")} placeholder="Bio" className="border p-2 w-full h-24" />
        {errors.bio && <p className="text-red-500 text-sm">{errors.bio.message}</p>}
      </div>
      
      <div>
        <input type="file" {...register("avatar")} accept="image/*" className="border p-2 w-full" />
        {errors.avatar && <p className="text-red-500 text-sm">{errors.avatar.message as string}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className="bg-green-600 text-white px-4 py-2 w-full">
        {isSubmitting ? "Menyimpan..." : "Simpan Profil"}
      </button>

      {message && <p className="text-center text-blue-500 mt-4">{message}</p>}
    </form>
  );
}
