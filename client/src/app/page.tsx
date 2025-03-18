"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/Context";
import { useRouter, useSearchParams } from "next/navigation";
import GoogleDriveConnect from "@/components/GoogleDriveConnect";
import GoogleDriveCard from "@/components/GoogleDriveCard";

export default function Home() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDriveConnected, setIsDriveConnected] = useState<boolean>(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return
    }

    const token = localStorage.getItem("googleAccessToken");
    setIsDriveConnected(!!token);

  }, [user, loading, router]);

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    if (accessToken) {
      localStorage.setItem("googleAccessToken", accessToken);
      setIsDriveConnected(true);
      router.replace("/"); // Remove token from URL
    }
  }, [searchParams, router]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return null;

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-6">Welcome, {user.name}!</h1>

      {!isDriveConnected ? <GoogleDriveConnect /> : <GoogleDriveCard />}

      <button
        onClick={logout}
        className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
