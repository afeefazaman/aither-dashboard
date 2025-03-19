"use client";

import { HOST_URL } from "@/utils/constants";
import { useEffect, useState } from "react";

interface CalendarEvent {
    id: string;
    summary: string;
    start: { dateTime?: string; date?: string };
    end: { dateTime?: string; date?: string };
}

export default function GoogleCalendarEvents() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEvents = async () => {
            const accessToken = localStorage.getItem("googleAccessToken");
            if (!accessToken) {
                setError("Google not connected.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${HOST_URL}/google/calendar/events`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch events");

                const data = await response.json();
                setEvents(data);
            } catch (err) {
                setError("Failed to load events. Please reconnect Google Calendar.");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">📅 Upcoming Events</h2>

            {loading && <p className="text-center text-gray-500">Loading events...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {events.length === 0 && !loading && (
                <p className="text-center text-gray-500">No upcoming events found.</p>
            )}

            <div className="space-y-4">
                {events.map((event) => (
                    <div key={event.id} className="p-4 bg-gray-100 rounded-lg shadow-sm">
                        <h3 className="text-lg font-medium text-gray-900">{event.summary}</h3>
                        <p className="text-sm text-gray-600">
                            🕒 {event.start.dateTime ? new Date(event.start.dateTime).toLocaleString() : event.start.date}
                        </p>
                        <p className="text-sm text-gray-600">
                            ⏳ Ends: {event.end.dateTime ? new Date(event.end.dateTime).toLocaleString() : event.end.date}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
