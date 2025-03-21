"use client";

export default function GoogleConnectConnect() {
  const handleConnect = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/google/auth`;
  };

  return (
    <button
      onClick={handleConnect}
      className="bg-black text-white px-4 py-2 rounded-lg cursor-pointer"
    >
      Connect to Google
    </button>
  );
}
