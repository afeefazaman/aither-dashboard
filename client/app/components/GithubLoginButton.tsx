'use client';
import React from 'react';

const GitHubLoginButton = () => {
  const handleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/github/login`;
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-black text-white px-4 py-2 rounded-lg"
    >
      Login with GitHub
    </button>
  );
};

export default GitHubLoginButton;
