export interface Movie {
  id: string;
  title: string;
  movie_type: "movie" | "series";
  is_free: boolean;
  genres: string[];
  release_year: number;
  rating: number;
  thumbnail: string;
  description: string;
  video_duration: string;
  created: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  status: "active" | "not active" | "blocked";
  created: string;
}

export interface Subscription {
  id: string;
  user: string;
  status: "active" | "expired" | "cancelled";
  payment_method: string;
  created: string;
}

export interface PaymentHistory {
  id: string;
  user: string;
  payment_method: string;
  trx_id: string;
  phone_number: string;
  amount: number;
  created: string;
}

export const movies: Movie[] = [
  { id: "1", title: "The Dark Kingdom", movie_type: "movie", is_free: false, genres: ["Action", "Fantasy"], release_year: 2024, rating: 8.5, thumbnail: "", description: "A warrior's journey through darkness.", video_duration: "2h 15m", created: "2024-12-01" },
  { id: "2", title: "Midnight Signal", movie_type: "series", is_free: false, genres: ["Thriller", "Sci-Fi"], release_year: 2025, rating: 9.1, thumbnail: "", description: "Signals from an unknown dimension.", video_duration: "45m/ep", created: "2025-01-15" },
  { id: "3", title: "Ocean's Echo", movie_type: "movie", is_free: true, genres: ["Drama", "Adventure"], release_year: 2024, rating: 7.8, thumbnail: "", description: "A deep-sea mystery unfolds.", video_duration: "1h 52m", created: "2024-11-20" },
  { id: "4", title: "Neon Streets", movie_type: "series", is_free: false, genres: ["Crime", "Drama"], release_year: 2025, rating: 8.9, thumbnail: "", description: "Cyberpunk noir detective series.", video_duration: "50m/ep", created: "2025-02-01" },
  { id: "5", title: "The Last Garden", movie_type: "movie", is_free: true, genres: ["Romance", "Drama"], release_year: 2024, rating: 7.2, thumbnail: "", description: "Love blooms in unexpected places.", video_duration: "1h 38m", created: "2024-10-10" },
  { id: "6", title: "Parallel Shift", movie_type: "movie", is_free: false, genres: ["Sci-Fi", "Action"], release_year: 2025, rating: 8.3, thumbnail: "", description: "Reality bends across dimensions.", video_duration: "2h 05m", created: "2025-01-28" },
  { id: "7", title: "Crimson Tide Rising", movie_type: "series", is_free: false, genres: ["Horror", "Thriller"], release_year: 2024, rating: 8.7, thumbnail: "", description: "A coastal town's dark secret.", video_duration: "42m/ep", created: "2024-09-15" },
  { id: "8", title: "Golden Hour", movie_type: "movie", is_free: true, genres: ["Comedy", "Romance"], release_year: 2025, rating: 7.5, thumbnail: "", description: "A photographer's wild day.", video_duration: "1h 45m", created: "2025-02-10" },
];

export const users: User[] = [
  { id: "1", username: "john_doe", email: "john@example.com", status: "active", created: "2024-06-01" },
  { id: "2", username: "jane_smith", email: "jane@example.com", status: "active", created: "2024-07-15" },
  { id: "3", username: "bob_wilson", email: "bob@example.com", status: "blocked", created: "2024-08-20" },
  { id: "4", username: "alice_brown", email: "alice@example.com", status: "active", created: "2024-09-10" },
  { id: "5", username: "charlie_davis", email: "charlie@example.com", status: "not active", created: "2024-10-05" },
];

export const subscriptions: Subscription[] = [
  { id: "1", user: "john_doe", status: "active", payment_method: "Credit Card", created: "2024-06-01" },
  { id: "2", user: "jane_smith", status: "active", payment_method: "Mobile Money", created: "2024-07-15" },
  { id: "3", user: "alice_brown", status: "expired", payment_method: "Credit Card", created: "2024-09-10" },
  { id: "4", user: "charlie_davis", status: "cancelled", payment_method: "Mobile Money", created: "2024-10-05" },
];

export const payments: PaymentHistory[] = [
  { id: "1", user: "john_doe", payment_method: "Credit Card", trx_id: "TRX-001", phone_number: "+1234567890", amount: 14.99, created: "2025-01-01" },
  { id: "2", user: "jane_smith", payment_method: "Mobile Money", trx_id: "TRX-002", phone_number: "+0987654321", amount: 14.99, created: "2025-01-15" },
  { id: "3", user: "alice_brown", payment_method: "Credit Card", trx_id: "TRX-003", phone_number: "+1122334455", amount: 9.99, created: "2025-02-01" },
  { id: "4", user: "john_doe", payment_method: "Credit Card", trx_id: "TRX-004", phone_number: "+1234567890", amount: 14.99, created: "2025-02-15" },
];

export const monthlyStats = [
  { month: "Aug", users: 120, views: 3400, revenue: 1200 },
  { month: "Sep", users: 185, views: 5200, revenue: 2100 },
  { month: "Oct", users: 260, views: 7800, revenue: 3400 },
  { month: "Nov", users: 340, views: 10200, revenue: 4800 },
  { month: "Dec", users: 420, views: 14500, revenue: 5900 },
  { month: "Jan", users: 510, views: 18200, revenue: 7200 },
  { month: "Feb", users: 620, views: 22800, revenue: 8900 },
];

export const genreDistribution = [
  { name: "Action", value: 28 },
  { name: "Drama", value: 22 },
  { name: "Sci-Fi", value: 18 },
  { name: "Thriller", value: 15 },
  { name: "Comedy", value: 10 },
  { name: "Horror", value: 7 },
];
