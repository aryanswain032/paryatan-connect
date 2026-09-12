import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export type User = {
  id: number; email: string; full_name: string; role: string;
  preferred_language: string;
};

export type Destination = {
  id: number; name: string; slug: string; state: string;
  district?: string; description: string; categories: string[];
  latitude?: number; longitude?: number; best_season?: string;
  crowd_level: string; crowd_score: number; is_emerging: boolean;
  image_url?: string; verified: boolean;
};

export type Activity = {
  id: number; destination_id: number; name: string;
  description: string; category: string; duration_minutes: number;
  price_range: string;
};

export type Guide = {
  id: number; name: string; bio: string; location: string;
  languages: string[]; specialties: string[]; price_per_day: number;
  verification_status: string; rating: number; review_count: number;
  image_url?: string;
};

export type Business = {
  id: number; name: string; business_type: string;
  description: string; address: string; price_range: string;
  verification_status: string; rating: number; review_count: number;
  image_url?: string;
};

export type Booking = {
  id: number; tourist_id: number; tourist_name?: string;
  provider_id?: number; provider_type: string;
  provider_name?: string; destination_id?: number;
  booking_date: string; guest_count: number; message?: string;
  status: string; payment_status: string;
  provider_response?: string; created_at: string;
};