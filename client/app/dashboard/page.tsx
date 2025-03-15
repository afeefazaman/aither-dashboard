'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchGithubStats } from '../lib/api';

interface GitHubUser {
  login: string;
  avatar_url: string;
  followers: number;
  following: number;
  contributions: number;
  mostStarredRepo: {
    name: string;
    stars: number;
    url: string;
  };
  languagesUsed: string[];
  totalForkCount: number;
  publicRepos: number;
  privateRepos: number;
  lastUpdatedRepos: { name: string; updated_at: string }[];
}


export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<GitHubUser | null>(null);

  useEffect(() => {
    // Capture token from URL
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("githubToken", token);
      router.replace("/dashboard"); // Clean URL by removing token
    }

    // Fetch user data if token exists
    const storedToken = localStorage.getItem("githubToken");
    if (!storedToken) {
      router.push("/"); // Redirect if no token
    } else {
      fetch("/api/github-data", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setUser(data))
        .catch(console.error);
    }
  }, [router, searchParams]);

  if (!user) return <p>Loading GitHub Stats...</p>;

  console.log(user);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.login}!</h1>
      <img
        src={user.avatar_url}
        alt={`${user.login}'s avatar`}
        className="rounded-full w-32 h-32 mb-4"
      />
      <p>
        <strong>Username:</strong> {user.login}
      </p>
      <p>
        <strong>Followers:</strong> {user.followers}
      </p>
      <p>
        <strong>Following:</strong> {user.following}
      </p>
      <p>
        <strong>Contributions:</strong> {user.contributions}
      </p>

      {/* Most Starred Repo */}
      {user.mostStarredRepo && (
        <div>
          <p>
            <strong>Most Starred Repo:</strong>
          </p>
          <p>
            <a href={user.mostStarredRepo.url} target="_blank" rel="noopener noreferrer">
              {user.mostStarredRepo.name} - {user.mostStarredRepo.stars} stars
            </a>
          </p>
        </div>
      )}

      {/* Last Updated Repositories (Top 4 Only) */}
      {user.lastUpdatedRepos && user.lastUpdatedRepos.length > 0 && (
        <div>
          <p>
            <strong>Last Updated Repos:</strong>
          </p>
          <ul>
            {user.lastUpdatedRepos.map((repo, index) => (
              <li key={index}>
                {repo.name} - Last Updated: {new Date(repo.updated_at).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}