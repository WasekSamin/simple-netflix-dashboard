import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useForm,
  useFieldArray,
  Controller,
  useWatch,
  type Control,
  type FieldErrors,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Film,
  X,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MATURITY_RATINGS } from "@/utils/movie";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createMovie } from "@/services/movieService";
import { getGenres } from "@/services/genreService";

const currentYear = new Date().getFullYear();

const maturityRatingKeys = Object.keys(MATURITY_RATINGS) as Array<
  keyof typeof MATURITY_RATINGS
>;

const episodeSchema = z.object({
  title: z
    .string()
    .min(1, "Episode title is required")
    .max(120, "Max 120 characters"),
  duration: z
    .string()
    .min(1, "Duration is required")
    .max(10, "Max 10 characters"),
  description: z.string().max(1000, "Max 1000 characters").default(""),
  thumbnailUrl: z.string().max(500, "Max 500 characters").default(""),
  releaseDate: z.string().default(""),
});

const seasonSchema = z.object({
  name: z
    .string()
    .min(1, "Season name is required")
    .max(60, "Max 60 characters"),
  episodes: z.array(episodeSchema).min(1, "At least one episode is required"),
  isExpanded: z.boolean().default(true),
});

const formSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(120, "Max 120 characters"),
    movieType: z.enum(["movie", "series"]),
    isFeatured: z.boolean().default(false),
    genres: z
      .array(z.object({ id: z.coerce.string(), name: z.string() }))
      .min(1, "Select at least one genre"),
    maturityRating: z.string().min(1, "Maturity rating is required"),
    releaseYear: z
      .string()
      .min(1, "Release year is required")
      .refine(
        (val) => {
          const n = parseInt(val, 10);
          return !isNaN(n) && n >= 1900 && n <= currentYear;
        },
        { message: `Year must be between 1900 and ${currentYear}` },
      ),
    duration: z.string().max(20, "Max 20 characters").default(""),
    description: z
      .string()
      .min(1, "Description is required")
      .max(2000, "Max 2000 characters"),
    thumbnailUrl: z.string().max(500, "Max 500 characters").default(""),
    directorName: z
      .string()
      .min(1, "Director name is required")
      .max(120, "Max 120 characters"),
    seasons: z.array(seasonSchema).default([]),
  })
  .superRefine((data, ctx) => {
    if (data.movieType === "movie" && !data.duration?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Duration is required for movies",
        path: ["duration"],
      });
    }
    if (data.movieType === "series" && data.seasons.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one season is required",
        path: ["seasons"],
      });
    }
  });

type FormValues = z.infer<typeof formSchema>;

// Helpers

const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return <p className="text-[12px] text-destructive mt-1">{message}</p>;
};

const EMPTY_EPISODE: FormValues["seasons"][number]["episodes"][number] = {
  title: "",
  duration: "",
  description: "",
  thumbnailUrl: "",
  releaseDate: "",
};

// Episode sub-component (nested field array)

interface EpisodeFieldsProps {
  seasonIndex: number;
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
}

const EpisodeFields = ({
  seasonIndex,
  control,
  errors,
}: EpisodeFieldsProps) => {
  const {
    fields: episodeFields,
    append: appendEpisode,
    remove: removeEpisode,
  } = useFieldArray({
    control,
    name: `seasons.${seasonIndex}.episodes` as const,
  });

  return (
    <div className="p-4 space-y-3">
      {episodeFields.map((field, eIndex) => {
        const ep = errors.seasons?.[seasonIndex]?.episodes?.[eIndex];
        return (
          <div
            key={field.id}
            className="rounded-lg border border-border bg-background p-3 space-y-2"
          >
            {/* Row 1 – title */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-muted-foreground bg-accent/50 rounded px-1.5 py-0.5 shrink-0">
                E{eIndex + 1}
              </span>
              <div className="flex-1">
                <Controller
                  control={control}
                  name={`seasons.${seasonIndex}.episodes.${eIndex}.title`}
                  render={({ field: f }) => (
                    <Input
                      placeholder="Episode title"
                      {...f}
                      maxLength={120}
                      className={`bg-card border-border h-8 text-sm ${ep?.title ? "border-destructive" : ""}`}
                    />
                  )}
                />
                <FieldError message={ep?.title?.message} />
              </div>
              {episodeFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEpisode(eIndex)}
                  className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Row 2 – duration + release date */}
            <div className="grid grid-cols-2 gap-2 pl-8">
              <div>
                <Controller
                  control={control}
                  name={`seasons.${seasonIndex}.episodes.${eIndex}.duration`}
                  render={({ field: f }) => (
                    <Input
                      placeholder="Duration (e.g. 45m)"
                      {...f}
                      maxLength={10}
                      className={`bg-card border-border h-8 text-sm ${ep?.duration ? "border-destructive" : ""}`}
                    />
                  )}
                />
                <FieldError message={ep?.duration?.message} />
              </div>
              <Controller
                control={control}
                name={`seasons.${seasonIndex}.episodes.${eIndex}.releaseDate`}
                render={({ field: f }) => (
                  <Input
                    type="date"
                    {...f}
                    className="bg-card border-border h-8 text-sm"
                  />
                )}
              />
            </div>

            {/* Row 3 – thumbnail url */}
            <div className="pl-8">
              <Controller
                control={control}
                name={`seasons.${seasonIndex}.episodes.${eIndex}.thumbnailUrl`}
                render={({ field: f }) => (
                  <Input
                    placeholder="Thumbnail URL (e.g. https://...)"
                    {...f}
                    maxLength={500}
                    className="bg-card border-border h-8 text-sm"
                  />
                )}
              />
              <FieldError message={ep?.thumbnailUrl?.message} />
            </div>

            {/* Row 4 – description */}
            <div className="pl-8">
              <Controller
                control={control}
                name={`seasons.${seasonIndex}.episodes.${eIndex}.description`}
                render={({ field: f }) => (
                  <Textarea
                    placeholder="Episode description..."
                    {...f}
                    maxLength={1000}
                    rows={2}
                    className="bg-card border-border text-sm resize-none min-h-[60px]"
                  />
                )}
              />
              <FieldError message={ep?.description?.message} />
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => appendEpisode(EMPTY_EPISODE)}
        className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors mt-1"
      >
        <Plus className="h-3 w-3" /> Add Episode
      </button>
    </div>
  );
};

// Main page

const AddMoviePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      movieType: "movie",
      isFeatured: false,
      genres: [],
      maturityRating: "",
      releaseYear: "",
      duration: "",
      description: "",
      thumbnailUrl: "",
      directorName: "",
      seasons: [
        {
          name: "Season 1",
          episodes: [{ ...EMPTY_EPISODE }],
          isExpanded: true,
        },
      ],
    },
  });

  const movieType = watch("movieType");
  const genres = watch("genres");
  const description = watch("description");
  const thumbnailUrl = watch("thumbnailUrl");
  const isFeatured = watch("isFeatured");

  const watchedSeasons = useWatch({ control, name: "seasons" });
  const totalEpisodes =
    watchedSeasons?.reduce((sum, s) => sum + (s.episodes?.length || 0), 0) || 0;

  const {
    fields: seasonFields,
    append: appendSeason,
    remove: removeSeason,
  } = useFieldArray({ control, name: "seasons" });

  // clear conditional errors when the content type changes
  useEffect(() => {
    clearErrors(["duration", "seasons"]);
  }, [movieType, clearErrors]);

  const addGenre = (genreId: string) => {
    const cur = getValues("genres");
    if (!cur.some((g) => g.id === genreId)) {
      const genre = genreData?.genres?.find((g) => g.id === genreId);
      if (genre) {
        setValue("genres", [...cur, { id: genre.id, name: genre.name }], {
          shouldValidate: true,
        });
      }
    }
  };

  useEffect(() => {
    clearErrors(["duration", "seasons"]);

    if (movieType === "movie") {
      setValue("seasons", []);
    } else {
      const currentSeasons = getValues("seasons");
      if (currentSeasons.length === 0) {
        setValue("seasons", [
          {
            name: "Season 1",
            episodes: [{ ...EMPTY_EPISODE }],
            isExpanded: true,
          },
        ]);
      }
    }
  }, [movieType, clearErrors, setValue, getValues]);

  const removeGenre = (genreId: string) => {
    setValue(
      "genres",
      getValues("genres").filter((g) => g.id !== genreId),
      { shouldValidate: true },
    );
  };

  const toggleSeason = (idx: number) => {
    setValue(
      `seasons.${idx}.isExpanded`,
      !getValues(`seasons.${idx}.isExpanded`),
    );
  };

  const { data: genreData, isPending: isPendingGenre } = useQuery({
    queryKey: ["genre"],
    queryFn: ({ signal }) =>
      getGenres({
        currentPage: 1,
        fetchAll: true,
        signal,
      }),
  }) as {
    data: Record<string, any>;
    isPending: boolean;
  };

  const { mutate: addNewMovie, isPending } = useMutation({
    mutationFn: (formData: FormValues) =>
      createMovie({
        payload: {
          title: formData.title,
          contentType:
            formData.movieType === "series"
              ? "TV_SHOW"
              : formData.movieType.toUpperCase(),
          description: formData.description,
          maturityRating: formData.maturityRating,
          releaseYear: formData.releaseYear
            ? parseInt(formData.releaseYear)
            : null,
          duration: formData.duration,
          thumbnailUrl: formData.thumbnailUrl,
          director: formData.directorName,
          isFeatured: formData.isFeatured,
          genreIds: formData.genres.map((genre) => genre.id),
          ...(formData.movieType === "series" && {
            seasons: formData.seasons.map((season, sIndex) => ({
              name: season.name,
              seasonNumber: sIndex + 1,
              episodes: season.episodes.map((episode, eIndex) => ({
                title: episode.title,
                episodeNumber: eIndex + 1,
                duration: episode.duration,
                description: episode.description || "",
                thumbnailUrl: episode.thumbnailUrl || "",
                releaseDate: episode.releaseDate || "",
              })),
            })),
          }),
        },
      }),

    onSuccess: async (data: Record<string, any>) => {
      toast({
        title: "Success!",
        description:
          movieType === "series"
            ? "Series created successfully."
            : "Movie created successfully.",
      });
      navigate("/movies");
    },

    onError: (err: Record<string, any>) => {
      toast({
        title: "Error!",
        description: err?.message || "Failed to create new movie!",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (formData: FormValues) => {
    console.log(formData);
    addNewMovie(formData);
  };

  return (
    <DashboardLayout>
      <div>
        <button
          onClick={() => navigate("/movies")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Movies
        </button>

        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-foreground tracking-tight flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Film className="h-5 w-5" />
            </div>
            Add New {movieType === "series" ? "Series" : "Movie"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 ml-[52px]">
            Fill in the details to add a new title to the library
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit, (errors) =>
            console.log("Validation errors:", errors),
          )}
          className="space-y-6"
        >
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <Input
                  id="title"
                  placeholder="Enter title"
                  {...field}
                  maxLength={120}
                  className={`bg-card border-border ${errors.title ? "border-destructive" : ""}`}
                />
              )}
            />
            <FieldError message={errors.title?.message} />
          </div>

          {/* Type & Featured */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type *</Label>
              <Controller
                control={control}
                name="movieType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="bg-card border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="movie">Movie</SelectItem>
                      <SelectItem value="series">Series</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Is Featured?</Label>
              <div className="flex items-center gap-3 h-10 px-3 rounded-md border border-border bg-card">
                <Controller
                  control={control}
                  name="isFeatured"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <span className="text-sm text-card-foreground">
                  {isFeatured ? "Featured" : "Not Featured"}
                </span>
              </div>
            </div>
          </div>

          {/* Genres & Maturity Rating */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Genres *</Label>
              <Select disabled={isPendingGenre} onValueChange={addGenre}>
                <SelectTrigger
                  className={`bg-card border-border ${errors.genres ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Add genres" />
                </SelectTrigger>
                <SelectContent>
                  {genreData?.genres
                    ?.filter(
                      (g) => !genres.some((selected) => selected.id === g.id),
                    )
                    .map((g) => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FieldError message={errors.genres?.message} />
              {genres?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {genres?.map((g) => (
                    <Badge
                      key={g.id}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      {g.name}
                      <button
                        type="button"
                        onClick={() => removeGenre(g.id)}
                        className="rounded-full p-0.5 hover:bg-accent"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Maturity Rating *</Label>
              <Controller
                control={control}
                name="maturityRating"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={`bg-card border-border ${errors.maturityRating ? "border-destructive" : ""}`}
                    >
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      {maturityRatingKeys.map((key) => (
                        <SelectItem key={key} value={key}>
                          {MATURITY_RATINGS[key]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError message={errors.maturityRating?.message} />
            </div>
          </div>

          {/* Year & Duration */}
          <div className="grid gap-4 grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="year">Release Year *</Label>
              <Controller
                control={control}
                name="releaseYear"
                render={({ field }) => (
                  <Input
                    id="year"
                    type="number"
                    placeholder={`${currentYear}`}
                    min={1900}
                    max={currentYear}
                    {...field}
                    className={`bg-card border-border ${errors.releaseYear ? "border-destructive" : ""}`}
                  />
                )}
              />
              <FieldError message={errors.releaseYear?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">
                Duration {movieType === "movie" ? "*" : ""}
              </Label>
              <Controller
                control={control}
                name="duration"
                render={({ field }) => (
                  <Input
                    id="duration"
                    placeholder="2h 15m"
                    {...field}
                    maxLength={20}
                    className={`bg-card border-border ${errors.duration ? "border-destructive" : ""}`}
                  />
                )}
              />
              <FieldError message={errors.duration?.message} />
            </div>
          </div>

          {/* Seasons & Episodes (series only) */}
          {movieType === "series" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Seasons & Episodes *</Label>
                <span className="text-xs text-muted-foreground">
                  {seasonFields.length} season
                  {seasonFields.length > 1 ? "s" : ""} · {totalEpisodes} episode
                  {totalEpisodes > 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-3">
                {seasonFields.map((seasonField, sIndex) => {
                  const isExpanded =
                    watchedSeasons?.[sIndex]?.isExpanded ?? true;
                  return (
                    <div
                      key={seasonField.id}
                      className="rounded-xl border border-border bg-card overflow-hidden"
                    >
                      {/* Season header */}
                      <div className="flex items-center gap-2 px-4 py-3 bg-accent/30">
                        <button
                          type="button"
                          onClick={() => toggleSeason(sIndex)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                        <Controller
                          control={control}
                          name={`seasons.${sIndex}.name`}
                          render={({ field }) => (
                            <Input
                              {...field}
                              maxLength={60}
                              className="h-7 bg-transparent border-none px-1 text-sm font-medium text-card-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                          )}
                        />
                        <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                          {watchedSeasons?.[sIndex]?.episodes?.length || 0} ep
                        </span>
                        {seasonFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSeason(sIndex)}
                            className="text-muted-foreground hover:text-destructive transition-colors ml-auto"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Season-level name error */}
                      {errors.seasons?.[sIndex]?.name && (
                        <div className="px-4 pt-1">
                          <FieldError
                            message={errors.seasons[sIndex]?.name?.message}
                          />
                        </div>
                      )}

                      {/* Episodes */}
                      {isExpanded && (
                        <EpisodeFields
                          seasonIndex={sIndex}
                          control={control}
                          errors={errors}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <FieldError message={errors.seasons?.message} />

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendSeason({
                    name: `Season ${seasonFields.length + 1}`,
                    episodes: [{ ...EMPTY_EPISODE }],
                    isExpanded: true,
                  })
                }
                className="gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" /> Add Season
              </Button>
            </div>
          )}

          {/* Thumbnail URL */}
          <div className="space-y-2">
            <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
            <Controller
              control={control}
              name="thumbnailUrl"
              render={({ field }) => (
                <Input
                  id="thumbnailUrl"
                  placeholder="https://example.com/thumbnail.jpg"
                  {...field}
                  maxLength={500}
                  className={`bg-card border-border ${errors.thumbnailUrl ? "border-destructive" : ""}`}
                />
              )}
            />
            <FieldError message={errors.thumbnailUrl?.message} />
            {thumbnailUrl && (
              <div className="mt-2 relative w-40 h-24 rounded-lg overflow-hidden border border-border bg-accent/20">
                <img
                  src={thumbnailUrl}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Director */}
          <div className="space-y-2">
            <Label htmlFor="directorName">Director *</Label>
            <Controller
              control={control}
              name="directorName"
              render={({ field }) => (
                <Input
                  id="directorName"
                  placeholder="Enter director name"
                  {...field}
                  maxLength={120}
                  className={`bg-card border-border ${errors.directorName ? "border-destructive" : ""}`}
                />
              )}
            />
            <FieldError message={errors.directorName?.message} />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="desc">Description *</Label>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Textarea
                  id="desc"
                  placeholder="Brief description..."
                  {...field}
                  maxLength={2000}
                  rows={4}
                  className={`bg-card border-border resize-none ${errors.description ? "border-destructive" : ""}`}
                />
              )}
            />
            <div className="flex justify-between items-start">
              <FieldError message={errors.description?.message} />
              <p className="text-[11px] text-muted-foreground ml-auto">
                {description?.length || 0}/2000
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button disabled={isPending} type="submit" className="gap-2">
              <Film className="h-4 w-4" />{" "}
              {isPending
                ? "Creating..."
                : `Create ${movieType === "series" ? "Series" : "Movie"}`}
            </Button>
            <Button
              type="button"
              disabled={isPending}
              variant="outline"
              onClick={() => navigate("/movies")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddMoviePage;
