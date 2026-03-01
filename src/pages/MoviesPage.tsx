import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Star,
  Search,
  Plus,
  Film,
  Tv,
  Grid3X3,
  List,
  MoreHorizontal,
  Eye,
  Trash2,
  Loader2,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteMovie, getMovies } from "@/services/movieService";
import { useDebounce } from "@/hooks/useDebounce";
import { Spinner } from "@/components/ui/spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const MoviesPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {toast} = useToast();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<"all" | "movie" | "series">(
    "all",
  );
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [movieToDelete, setMovieToDelete] = useState<Record<string, any> | null>(
      null,
    );

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const { data: movieData, isPending: isPendingMovies } = useQuery({
    queryKey: ["movies", debouncedSearch, currentPage, typeFilter],
    queryFn: ({ signal }) =>
      getMovies({
        currentPage,
        sortBy: "id",
        direction: "desc",
        query: debouncedSearch,
        contentType:
          typeFilter === "all"
            ? undefined
            : typeFilter === "series"
              ? "TV_SHOW"
              : typeFilter,
        signal,
      }),
  }) as {
    data: Record<string, any>;
    isPending: boolean;
  };

  const { mutate: removeMovie, isPending: isDeleting } = useMutation({
    mutationFn: (movie: Record<string, any>) => deleteMovie({ movieId: movie.id }),
    onSuccess: (_data, movie) => {
      toast({
        title: "Movie Deleted",
        description: `Movie "${movie.title}" has been deleted.`,
      });
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      setMovieToDelete(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete movie. Please try again.",
        variant: "destructive",
      });
      setMovieToDelete(null);
    },
  });

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
            Movies
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your movie & series catalog
          </p>
        </div>
        <Button className="gap-2" onClick={() => navigate("/movies/add")}>
          <Plus className="h-4 w-4" />
          Add Movie
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Total Movies",
            count: movieData?.totalMovies ?? 0,
            color: "text-foreground",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-card p-4"
          >
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`font-display text-2xl font-bold mt-1 ${s.color}`}>
              {s.count}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
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
          <button
            onClick={() => setViewMode("grid")}
            className={`rounded-md p-1.5 transition-colors ${viewMode === "grid" ? "bg-accent text-foreground" : "text-muted-foreground"}`}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`rounded-md p-1.5 transition-colors ${viewMode === "table" ? "bg-accent text-foreground" : "text-muted-foreground"}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isPendingMovies ? (
        <Spinner className="w-8 h-8 mx-auto" />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {movieData?.movies?.map((movie) => (
            <div
              key={movie.id}
              className="group rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Thumbnail placeholder */}
              <div className="relative aspect-video bg-gradient-to-br from-muted to-accent flex items-center justify-center">
                <Film className="h-10 w-10 text-muted-foreground/40" />
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <Badge
                    variant={
                      movie.contentType === "TV_SHOW" ? "default" : "secondary"
                    }
                    className="text-[10px]"
                  >
                    {movie.contentType === "TV_SHOW"
                      ? "Series"
                      : `${!movie.contentType ? "" : movie.contentType.charAt(0).toUpperCase() + movie.contentType.slice(1).toLowerCase()}`}
                  </Badge>
                  {movie.isFeatured && (
                    <span className="h-fit rounded-md bg-success/20 px-1.5 py-0.5 text-[10px] font-medium text-success">
                      Featured
                    </span>
                  )}
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-40" align="start">
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() => navigate(`/movies/${movie.id}`)}
                            className="flex items-center gap-x-1.5"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setMovieToDelete(movie)}
                            className="flex items-center gap-x-1.5 text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 title={movie.title} onClick={() => navigate(`/movies/${movie.id}`)} className="hover:cursor-pointer font-display text-sm font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-3">
                  {movie.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {movie.description}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-muted-foreground">
                    {movie.releaseYear} · {movie.duration}
                  </span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {movie.genres.map((g: Record<string, any>) => (
                    <span
                      key={g.id}
                      className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
                    >
                      {g.name}
                    </span>
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
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  Actions
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
                    <p className="text-xs text-muted-foreground">
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
                      className="text-xs"
                    >
                      {movie.contentType === "TV_SHOW"
                        ? "Series"
                        : `${!movie.contentType ? "" : movie.contentType.charAt(0).toUpperCase() + movie.contentType.slice(1).toLowerCase()}`}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1 flex-wrap">
                      {movie.genres.map((g) => (
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
                  <td className="px-5 py-3.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-40" align="start">
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() => navigate(`/movies/${movie.id}`)}
                            className="flex items-center gap-x-1.5"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setMovieToDelete(movie)}
                            className="flex items-center gap-x-1.5 text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirmation */}
      <AlertDialog
        open={!!movieToDelete}
        onOpenChange={(open) => !open && setMovieToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Movie</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {movieToDelete?.title}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => removeMovie(movieToDelete)}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default MoviesPage;
