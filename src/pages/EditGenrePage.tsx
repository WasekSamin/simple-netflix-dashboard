import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Popcorn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getGenre, updateGenre } from "@/services/genreService";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

const editGenreSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(60, "First name must be 50 characters or less"),
});

type EditGenreFormValues = z.infer<typeof editGenreSchema>;

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-sm text-destructive mt-1">{message}</p> : null;

const EditGenrePage = () => {
  const queryClient = useQueryClient();
  const { id: genreId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditGenreFormValues>({
    resolver: zodResolver(editGenreSchema),
    defaultValues: {
      name: "",
    },
  });

  const { data: genreData, isPending: isPendingGenre } = useQuery({
    queryKey: ["genre"],
    queryFn: ({ signal }) =>
      getGenre({
        genreId,
        signal,
      }),
  }) as {
    data: Record<string, any>;
    isPending: boolean;
  };

  useEffect(() => {
    if (genreData) {
      reset({
        name: genreData.name ?? "",
      });
    }
  }, [genreData, reset]);

  const { mutate: editGenre, isPending } = useMutation({
    mutationFn: (formData: EditGenreFormValues) =>
      updateGenre({
        genreId,
        payload: {
          name: formData.name,
        },
      }),

    onSuccess: async (data: Record<string, any>) => {
      toast({
        title: "Success!",
        description: `Genre "${data.name}" updated successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["genres"] });
    },

    onError: (err: Record<string, any>) => {
      toast({
        title: "Error!",
        description: err?.message || "Failed to update the genre!",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (formData: EditGenreFormValues) => {
    editGenre(formData);
  };

  return (
    <DashboardLayout>
      <div>
        <button
          onClick={() => navigate("/genres")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Genres
        </button>

        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-foreground tracking-tight flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Popcorn className="h-5 w-5" />
            </div>
            {genreData?.name ?? "Edit Genre"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 ml-[52px]">
            Edit genre
          </p>
        </div>

        {isPendingGenre ? (
          <Spinner className="w-8 h-8 mx-auto" />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Action"
                maxLength={60}
                className="bg-card border-border"
                {...register("name")}
              />
              <FieldError message={errors.name?.message} />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                className="gap-2"
                disabled={isSubmitting || isPending}
              >
                <Popcorn className="h-4 w-4" />{" "}
                {isSubmitting || isPending ? "Updating..." : "Update Genre"}
              </Button>
              <Button
                disabled={isSubmitting || isPending}
                type="button"
                variant="outline"
                onClick={() => navigate("/genres")}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EditGenrePage;
