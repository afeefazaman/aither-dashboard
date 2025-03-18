// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { HOST_URL } from "@/utils/constants";

// export default function AuthCallback() {
//     const router = useRouter();

//     useEffect(() => {
//         const fetchToken = async () => {
//             const urlParams = new URLSearchParams(window.location.search);
//             const code = urlParams.get("code");

//             if (!code) {
//                 alert("Authorization failed. Try again.");
//                 router.push("/dashboard");
//                 return;
//             }

//             try {
//                 const response = await fetch(`${HOST_URL}/google/auth/google/callback?code=${code}`);
//                 const data = await response.json();

//                 if (data.tokens?.access_token) {
//                     localStorage.setItem("googleAccessToken", data.tokens.access_token);
//                     alert("Google Drive connected successfully!");
//                 } else {
//                     alert("Failed to retrieve access token.");
//                 }
//             } catch (error) {
//                 console.error("OAuth Callback Error:", error);
//             } finally {
//                 router.push("/dashboard");
//             }
//         };

//         fetchToken();
//     }, [router]);

//     return <p>Connecting to Google Drive...</p>;
// }

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HOST_URL } from "@/utils/constants";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchToken = async () => {
      const code = searchParams.get("code");
      if (!code) {
        alert("Authorization failed. Try again.");
        router.push("/");
        return;
      }

      try {
        const response = await fetch(`${HOST_URL}/google/auth/google/callback?code=${code}`);
        const data = await response.json();

        if (data.tokens?.access_token) {
          localStorage.setItem("googleAccessToken", data.tokens.access_token);
          alert("Google Drive connected successfully!");
          router.push("/");
        } else {
          alert("Failed to retrieve access token.");
        }
      } catch (error) {
        console.error("OAuth Callback Error:", error);
        alert("Something went wrong. Please try again.");
        router.push("/");
      }
    };

    fetchToken();
  }, [router, searchParams]);

  return <p className="text-center mt-10">Connecting to Google Drive...</p>;
}
