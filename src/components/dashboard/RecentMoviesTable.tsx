import { movies } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const RecentMoviesTable = () => {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h3 className="font-display text-base font-semibold text-card-foreground">Recent Movies</h3>
        <span className="text-xs text-muted-foreground">{movies.length} total</span>
      </div>
      <div className="overflow-x-auto">
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
            {movies.map((movie) => (
              <tr key={movie.id} className="border-b border-border/50 transition-colors hover:bg-accent/30">
                <td className="px-5 py-3.5">
                  <p className="text-sm font-medium text-card-foreground">{movie.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{movie.video_duration}</p>
                </td>
                <td className="px-5 py-3.5">
                  <Badge variant={movie.movie_type === "series" ? "default" : "secondary"} className="text-xs capitalize">
                    {movie.movie_type}
                  </Badge>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1 flex-wrap">
                    {movie.genres.slice(0, 2).map((g) => (
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
    </div>
  );
};

export default RecentMoviesTable;
