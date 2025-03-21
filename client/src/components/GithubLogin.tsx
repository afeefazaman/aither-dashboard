'use client';
import React from 'react';

const GitHubLogin = () => {
  const handleLogin = () => {
    window.location.href = window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/github/login`;
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-black text-white px-4 py-2 rounded-lg cursor-pointer"
    >
      Connect to GitHub
    </button>
  );
};

export default GitHubLogin;