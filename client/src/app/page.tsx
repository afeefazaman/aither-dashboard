"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/Context";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!user) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
      <button
        onClick={logout}
        className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
