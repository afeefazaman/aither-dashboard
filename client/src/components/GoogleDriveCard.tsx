"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DriveFile {
  id: string;
  name: string;
  modifiedTime: string;
}

export default function GoogleDriveCard() {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchFiles = async () => {
      const accessToken = localStorage.getItem("googleAccessToken");
      if (!accessToken) {
        setError("🚨 Google Drive not connected.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/google/drive/files`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) throw new Error("Failed to fetch files.");

        const data = await response.json();
        setFiles(data);
      } catch (err) {
        localStorage.removeItem("googleAccessToken");
        router.push("/");
        setError("⚠️ Token expired. Please reconnect.");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className="w-full p-8 bg-white shadow-2xl rounded-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">📂 Google Drive Files</h2>

      {loading && <p className="text-center text-gray-500">Loading files...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && files.length === 0 && (
        <p className="text-center text-gray-500">No files found.</p>
      )}

      <div className="space-y-4">
        {files.map((file) => (
          <div key={file.id} className="p-4 bg-gray-100 rounded-lg shadow-sm">
            <p className="text-lg font-medium text-gray-900">{file.name}</p>
            <p className="text-sm text-gray-600">
              🕒 Modified: {new Date(file.modifiedTime).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
