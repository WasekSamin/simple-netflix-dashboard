import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Trash2,
  Loader2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteGenre, getGenres } from "@/services/genreService";

const GenresPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [genreToDelete, setGenreToDelete] = useState<Record<string, any> | null>(
    null,
  );

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const { data: genreData, isPending: isPendingGenres } = useQuery({
    queryKey: ["genres", debouncedSearch, currentPage],
    queryFn: ({ signal }) =>
      getGenres({
        currentPage,
        sortBy: "id",
        direction: "desc",
        query: debouncedSearch,
        signal,
      }),
  }) as {
    data: Record<string, any>;
    isPending: boolean;
  };

  const { mutate: removeGenre, isPending: isDeleting } = useMutation({
    mutationFn: (genre: Record<string, any>) => deleteGenre({ genreId: genre.id }),
    onSuccess: (_data, genre) => {
      toast({
        title: "Genre Deleted",
        description: `Genre "${genre.name}" has been deleted.`,
      });
      queryClient.invalidateQueries({ queryKey: ["genres"] });
      setGenreToDelete(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete genre. Please try again.",
        variant: "destructive",
      });
      setGenreToDelete(null);
    },
  });

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
            Genres
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage movie genres
          </p>
        </div>
        <Button className="gap-2" onClick={() => navigate("/genres/add")}>
          <Plus className="h-4 w-4" />
          Add Genre
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Total Genres",
            count: genreData?.totalGenres ?? 0,
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
            placeholder="Search genres..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>
      </div>

      {isPendingGenres ? (
        <Spinner className="w-8 h-8 mx-auto" />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Genre
                </th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Created At
                </th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {genreData?.genres?.map((genre) => {
                return (
                  <tr
                    key={genre.id}
                    className="border-b border-border/50 transition-colors hover:bg-accent/30"
                  >
                    <td className="px-5 py-3.5">
                      {genre.name ?? ""}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">
                      {genre.createdAt ? format(genre.createdAt, "MMM d, yyyy") : "-"}
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
                              onClick={() => navigate(`/genres/${genre.id}`)}
                              className="flex items-center gap-x-1.5"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setGenreToDelete(genre)}
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirmation */}
      <AlertDialog
        open={!!genreToDelete}
        onOpenChange={(open) => !open && setGenreToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Genre</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {genreToDelete?.name}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => removeGenre(genreToDelete)}
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

export default GenresPage;
