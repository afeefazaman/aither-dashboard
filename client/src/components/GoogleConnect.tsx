"use client";

import { HOST_URL } from "@/utils/constants";

export default function GoogleConnectConnect() {
  const handleConnect = () => {
    window.location.href = `${HOST_URL}/google/auth`;
  };

  return (
    <button
      onClick={handleConnect}
      className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
    >
      Connect to Google
    </button>
  );
}
