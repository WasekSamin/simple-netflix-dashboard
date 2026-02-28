import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Popcorn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { createGenre } from "@/services/genreService";

const addGenreSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(60, "First name must be 50 characters or less"),
  })

type AddGenreFormValues = z.infer<typeof addGenreSchema>;

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-sm text-destructive mt-1">{message}</p> : null;

const AddGenrePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AddGenreFormValues>({
    resolver: zodResolver(addGenreSchema),
    defaultValues: {
      name: "",
    },
  });

  const { mutate: addNewGenre, isPending } = useMutation({
    mutationFn: (formData: AddGenreFormValues) =>
      createGenre({
        payload: {
          name: formData.name,
        },
      }),

    onSuccess: async (data: Record<string, any>) => {
      toast({
        title: "Success!",
        description: "Genre created successfully.",
      });
      navigate("/genres");
    },

    onError: (err: Record<string, any>) => {
      toast({
        title: "Error!",
        description: err?.message || "Failed to update profile info!",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (formData: AddGenreFormValues) => {
    addNewGenre(formData);
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
            Add New Genre
          </h1>
          <p className="text-sm text-muted-foreground mt-1 ml-[52px]">
            Create a new genre
          </p>
        </div>

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
              {isSubmitting || isPending ? "Creating..." : "Create Genre"}
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
      </div>
    </DashboardLayout>
  );
};

export default AddGenrePage;
