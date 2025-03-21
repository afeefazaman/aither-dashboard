"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/Context";
import { useRouter, useSearchParams } from "next/navigation";
import GoogleConnect from "@/components/GoogleConnect";
import GoogleDriveCard from "@/components/GoogleDriveCard";
import GoogleCalendarEvents from "@/components/GoogleCalendarEvents";
import GitHubStatsCard from "@/components/GithubStats";
import GitHubLogin from "@/components/GithubLogin";

export default function Home() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isGoogleConnected, setIsGoogleConnected] = useState<boolean>(false);
  const [isGithubConnected, setIsGithubConnected] = useState<boolean>(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    const token = localStorage.getItem("googleAccessToken");
    setIsGoogleConnected(!!token);
    const githubToken = localStorage.getItem("githubAccessToken");
    setIsGithubConnected(!!githubToken);
  }, [user, loading, router]);

  useEffect(() => {
    const googleAccessToken = searchParams.get("accessToken");
    if (googleAccessToken) {
      localStorage.setItem("googleAccessToken", googleAccessToken);
      setIsGoogleConnected(true);
      router.replace("/");
    }

    const githubAccessToken = searchParams.get("githubAccessToken");
    if (githubAccessToken) {
      localStorage.setItem("githubAccessToken", githubAccessToken);
      setIsGithubConnected(true);
      router.replace("/");
    }
  }, [searchParams, router]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return null;

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Welcome, {user.name}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        {!isGoogleConnected ? <GoogleConnect /> : (
          <>
            <GoogleDriveCard />
            <GoogleCalendarEvents />
          </>
        )}

        {!isGithubConnected ? <GitHubLogin /> : <GitHubStatsCard />}
      </div>

      <button
        onClick={logout}
        className="mt-8 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
}