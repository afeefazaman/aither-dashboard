"use client";

import { useState } from "react";
import { useAuth } from "@/context/Context";
import { useRouter } from "next/navigation";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { signup } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await signup(name, email, password);
            router.push("/");
        } catch (err) {
            setError("Signup failed. Try again.");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                    required
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    Sign Up
                </button>
                <p className="mt-2 text-center">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-500">
                        Login
                    </a>
                </p>
            </form>
        </div>
    );
}
