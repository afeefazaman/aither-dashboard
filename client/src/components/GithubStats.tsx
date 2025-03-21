"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface GitHubUser {
  login: string;
  avatar_url: string;
  followers: number;
  following: number;
  contributions: number;
  mostStarredRepo?: {
    name: string;
    stars: number;
    url: string;
  };
  languagesUsed: string[];
  totalForkCount: number;
  publicRepos: number;
  privateRepos: number;
  lastUpdatedRepos?: { name: string; updated_at: string }[];
}

export default function GitHubStatsCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("githubAccessToken");
    if (!storedToken) {
      setError("GitHub not connected.");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/github/stats`, {
      method: "GET",
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch(() => {
        localStorage.removeItem("githubAccessToken");
        setError("Failed to fetch GitHub data.");
      });
  }, []);

  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!user) return <p className="text-center text-gray-500">Loading GitHub Stats...</p>;

  return (
    <div className="w-full p-8 bg-white shadow-2xl rounded-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">🐙 GitHub Profile</h2>

      <div className="flex items-center space-x-6">
        <img src={user.avatar_url} alt="Avatar" className="rounded-full w-20 h-20 shadow-lg" />
        <div>
          <p className="text-2xl font-bold text-gray-900">{user.login}</p>
          <p className="text-gray-600">👥 {user.followers} followers • {user.following} following</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <p><strong>📌 Contributions:</strong> {user.contributions}</p>
        <p><strong>📂 Public Repos:</strong> {user.publicRepos}</p>
        <p><strong>🔒 Private Repos:</strong> {user.privateRepos}</p>
        <p><strong>🍴 Total Forked Repos:</strong> {user.totalForkCount}</p>

        {user.mostStarredRepo && (
          <p>
            <strong>🌟 Most Starred Repo:</strong>{" "}
            <a href={user.mostStarredRepo.url} target="_blank" className="text-blue-500 hover:underline">
              {user.mostStarredRepo.name} ({user.mostStarredRepo.stars} ⭐)
            </a>
          </p>
        )}

        {user.languagesUsed.length > 0 && (
          <div>
            <strong>💻 Languages Used:</strong>
            <div className="flex flex-wrap mt-2">
              {user.languagesUsed.map((lang, index) => (
                <span key={index} className="px-3 py-1 text-sm bg-gray-200 rounded-full m-1">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {user.lastUpdatedRepos && user.lastUpdatedRepos.length > 0 && (
          <div>
            <strong>🔄 Last Updated Repos:</strong>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {user.lastUpdatedRepos.slice(0, 4).map((repo, index) => (
                <li key={index}>
                  {repo.name} - Last updated: {new Date(repo.updated_at).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
