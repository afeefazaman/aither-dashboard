"use client";

import { HOST_URL } from "@/utils/constants";
import { useEffect, useState } from "react";

interface DriveFile {
  id: string;
  name: string;
  modifiedTime: string;
}

export default function GoogleDriveCard() {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      const accessToken = localStorage.getItem("googleAccessToken");
      if (!accessToken) {
        setError("Google Drive not connected.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${HOST_URL}/google/drive/files`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch files.");

        const data = await response.json();
        setFiles(data);
      } catch (err) {
        setError("Error fetching Google Drive files.");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-lg">
      <h2 className="text-xl font-bold mb-4">Google Drive Files</h2>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <ul>
          {files.map((file) => (
            <li key={file.id} className="p-2 border-b">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-gray-500">Modified: {new Date(file.modifiedTime).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
