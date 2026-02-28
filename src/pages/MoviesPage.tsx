import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { movies } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Star, Search, Plus, Film, Tv, Grid3X3, List } from "lucide-react";

const MoviesPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "movie" | "series">("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const filtered = movies.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || m.movie_type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">Movies</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your movie & series catalog</p>
        </div>
        <Button className="gap-2" onClick={() => navigate("/movies/add")}>
          <Plus className="h-4 w-4" />
          Add Movie
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>
        <div className="flex gap-1 rounded-lg bg-card border border-border p-1">
          {(["all", "movie", "series"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors capitalize ${
                typeFilter === t
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "movie" && <Film className="h-3 w-3" />}
              {t === "series" && <Tv className="h-3 w-3" />}
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-1 rounded-lg bg-card border border-border p-1">
          <button onClick={() => setViewMode("grid")} className={`rounded-md p-1.5 transition-colors ${viewMode === "grid" ? "bg-accent text-foreground" : "text-muted-foreground"}`}>
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button onClick={() => setViewMode("table")} className={`rounded-md p-1.5 transition-colors ${viewMode === "table" ? "bg-accent text-foreground" : "text-muted-foreground"}`}>
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((movie) => (
            <div
              key={movie.id}
              className="group rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Thumbnail placeholder */}
              <div className="relative aspect-video bg-gradient-to-br from-muted to-accent flex items-center justify-center">
                <Film className="h-10 w-10 text-muted-foreground/40" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Badge variant={movie.movie_type === "series" ? "default" : "secondary"} className="text-[10px] capitalize">
                    {movie.movie_type}
                  </Badge>
                  {movie.is_free && (
                    <span className="rounded-md bg-success/20 px-1.5 py-0.5 text-[10px] font-medium text-success">
                      Free
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-display text-sm font-semibold text-card-foreground group-hover:text-primary transition-colors truncate">
                  {movie.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{movie.description}</p>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    <span className="text-xs font-medium text-card-foreground">{movie.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{movie.release_year} · {movie.video_duration}</span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {movie.genres.map((g) => (
                    <span key={g} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{g}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Title</th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Type</th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Genres</th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Rating</th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Year</th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Access</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((movie) => (
                <tr key={movie.id} className="border-b border-border/50 transition-colors hover:bg-accent/30">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-card-foreground">{movie.title}</p>
                    <p className="text-xs text-muted-foreground">{movie.video_duration}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={movie.movie_type === "series" ? "default" : "secondary"} className="text-xs capitalize">{movie.movie_type}</Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1 flex-wrap">
                      {movie.genres.map((g) => (
                        <span key={g} className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">{g}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                      <span className="text-sm font-medium text-card-foreground">{movie.rating}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{movie.release_year}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium ${movie.is_free ? "text-success" : "text-warning"}`}>
                      {movie.is_free ? "Free" : "Premium"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MoviesPage;
