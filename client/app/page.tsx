'use client';

export default function Home() {

  const handleGitHubLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/github/login`;
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <button
        onClick={handleGitHubLogin}
        className="px-6 py-3 bg-black text-white rounded-lg"
      >
        Sign in with GitHub
      </button>
    </main>
  );
}
