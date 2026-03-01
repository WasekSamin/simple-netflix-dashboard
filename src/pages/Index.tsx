import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentMoviesTable from "@/components/dashboard/RecentMoviesTable";
import UserGrowthChart from "@/components/dashboard/UserGrowthChart";
import { Film, Users, Popcorn } from "lucide-react";
import { getUsers } from "@/services/userService";
import { useQuery } from "@tanstack/react-query";
import { AuthStoreType, useAuthStore } from "@/store/AuthStore";
import { getMovies } from "@/services/movieService";
import { getGenres } from "@/services/genreService";

const Index = () => {
  const authData = useAuthStore((state: AuthStoreType) => state.authData);

  // Get users data
  const { data: userData, isPending: isPendingUsers } = useQuery({
    queryKey: ["users", "currentPage"],
    queryFn: ({ signal }) =>
      getUsers({
        currentPage: 1,
        signal,
      }),
  }) as {
    data: Record<string, any>;
    isPending: boolean;
  };

  // Get movies data
  const { data: movieData, isPending: isPendingMovies } = useQuery({
    queryKey: ["movies", "currentPage"],
    queryFn: ({ signal }) =>
      getMovies({
        currentPage: 1,
        signal,
      }),
  }) as {
    data: Record<string, any>;
    isPending: boolean;
  };

  // Get genres data
  const { data: genreData, isPending: isPendingGenres } = useQuery({
    queryKey: ["genres", "currentPage"],
    queryFn: ({ signal }) =>
      getGenres({
        currentPage: 1,
        signal,
      }),
  }) as {
    data: Record<string, any>;
    isPending: boolean;
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back {authData ? `${authData.firstName} ${authData.lastName}` : ""} — here's your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <StatsCard
          title="Total Movies"
          value={movieData?.totalMovies ?? 0}
          icon={Film}
          isLoading={isPendingMovies}
        />
        <StatsCard
          title="Total Users"
          value={userData?.totalUsers ?? 0}
          icon={Users}
          isLoading={isPendingMovies}
        />
        <StatsCard
          title="Total Genres"
          value={genreData?.totalGenres ?? 0}
          icon={Popcorn}
          isLoading={isPendingGenres}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 mb-8">
        <UserGrowthChart userData={userData} isPendingUsers={isPendingUsers} />
      </div>

      {/* Recent Movies */}
      <RecentMoviesTable movieData={movieData} isPendingMovies={isPendingMovies} />
    </DashboardLayout>
  );
};

export default Index;
