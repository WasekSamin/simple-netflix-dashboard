import { Badge } from "@/components/ui/badge";
import { Spinner } from "../ui/spinner";

const RecentMoviesTable = ({
  movieData,
  isPendingMovies,
}: {
  movieData: Record<string, any>;
  isPendingMovies: boolean;
}) => {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h3 className="font-display text-base font-semibold text-card-foreground">
          Recent Movies
        </h3>
        <span className="text-xs text-muted-foreground">
          {movieData?.totalMovies ?? 0} total
        </span>
      </div>
      {isPendingMovies ? (
        <Spinner className="my-3 w-8 h-8 mx-auto" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Title
                </th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Type
                </th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Genres
                </th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Year
                </th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  Is Featured?
                </th>
              </tr>
            </thead>
            <tbody>
              {movieData?.movies?.map((movie) => (
                <tr
                  key={movie.id}
                  className="border-b border-border/50 transition-colors hover:bg-accent/30"
                >
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-card-foreground">
                      {movie.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {movie.duration}
                    </p>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge
                      variant={
                        movie.contentType === "TV_SHOW"
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs capitalize"
                    >
                      {movie.contentType === "TV_SHOW"
                        ? "Series"
                        : `${!movie.contentType ? "" : movie.contentType.charAt(0).toUpperCase() + movie.contentType.slice(1).toLowerCase()}`}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1 flex-wrap">
                      {movie.genres?.map((g: Record<string, any>) => (
                        <span
                          key={g.id}
                          className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md"
                        >
                          {g.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">
                    {movie.releaseYear}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-xs font-medium ${movie.isFeatured ? "text-success" : "text-warning"}`}
                    >
                      {movie.isFeatured ? "Featured" : ""}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentMoviesTable;
