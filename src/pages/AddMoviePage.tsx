import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Film, X, Upload, Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const genreOptions = ["Action", "Adventure", "Comedy", "Crime", "Drama", "Fantasy", "Horror", "Romance", "Sci-Fi", "Thriller"];

interface Episode {
  title: string;
  duration: string;
}

interface Season {
  name: string;
  episodes: Episode[];
  isExpanded: boolean;
}

const AddMoviePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [movieType, setMovieType] = useState<"movie" | "series">("movie");
  const [isFree, setIsFree] = useState(false);
  const [genres, setGenres] = useState<string[]>([]);
  const [releaseYear, setReleaseYear] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [seasons, setSeasons] = useState<Season[]>([
    { name: "Season 1", episodes: [{ title: "", duration: "" }], isExpanded: true },
  ]);

  const addGenre = (genre: string) => {
    if (!genres.includes(genre)) setGenres([...genres, genre]);
  };

  const removeGenre = (genre: string) => {
    setGenres(genres.filter((g) => g !== genre));
  };

  const addSeason = () => {
    setSeasons([...seasons, { name: `Season ${seasons.length + 1}`, episodes: [{ title: "", duration: "" }], isExpanded: true }]);
  };

  const removeSeason = (sIndex: number) => {
    if (seasons.length <= 1) return;
    setSeasons(seasons.filter((_, i) => i !== sIndex));
  };

  const toggleSeason = (sIndex: number) => {
    setSeasons(seasons.map((s, i) => i === sIndex ? { ...s, isExpanded: !s.isExpanded } : s));
  };

  const updateSeasonName = (sIndex: number, name: string) => {
    setSeasons(seasons.map((s, i) => i === sIndex ? { ...s, name } : s));
  };

  const addEpisode = (sIndex: number) => {
    setSeasons(seasons.map((s, i) => i === sIndex ? { ...s, episodes: [...s.episodes, { title: "", duration: "" }] } : s));
  };

  const removeEpisode = (sIndex: number, eIndex: number) => {
    setSeasons(seasons.map((s, i) => {
      if (i !== sIndex || s.episodes.length <= 1) return s;
      return { ...s, episodes: s.episodes.filter((_, j) => j !== eIndex) };
    }));
  };

  const updateEpisode = (sIndex: number, eIndex: number, field: keyof Episode, value: string) => {
    setSeasons(seasons.map((s, i) => {
      if (i !== sIndex) return s;
      return { ...s, episodes: s.episodes.map((ep, j) => j === eIndex ? { ...ep, [field]: value } : ep) };
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || genres.length === 0 || !releaseYear) {
      toast({ title: "Validation Error", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    if (movieType === "movie" && !duration.trim()) {
      toast({ title: "Validation Error", description: "Please enter the movie duration.", variant: "destructive" });
      return;
    }
    if (movieType === "series") {
      const hasEmptyEpisode = seasons.some((s) => s.episodes.some((ep) => !ep.title.trim() || !ep.duration.trim()));
      if (hasEmptyEpisode) {
        toast({ title: "Validation Error", description: "Please fill in all episode titles and durations.", variant: "destructive" });
        return;
      }
    }
    const label = movieType === "movie" ? "Movie" : "Series";
    toast({ title: `${label} Added`, description: `"${title}" has been added successfully.` });
    navigate("/movies");
  };

  const totalEpisodes = seasons.reduce((sum, s) => sum + s.episodes.length, 0);

  return (
    <DashboardLayout>
      <div>
        <button onClick={() => navigate("/movies")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Movies
        </button>

        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-foreground tracking-tight flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Film className="h-5 w-5" />
            </div>
            Add New {movieType === "series" ? "Series" : "Movie"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 ml-[52px]">Fill in the details to add a new title to the library</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} className="bg-card border-border" />
          </div>

          {/* Type & Free toggle */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type *</Label>
              <Select value={movieType} onValueChange={(v: "movie" | "series") => setMovieType(v)}>
                <SelectTrigger className="bg-card border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="movie">Movie</SelectItem>
                  <SelectItem value="series">Series</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Access</Label>
              <div className="flex items-center gap-3 h-10 px-3 rounded-md border border-border bg-card">
                <Switch checked={isFree} onCheckedChange={setIsFree} />
                <span className="text-sm text-card-foreground">{isFree ? "Free" : "Premium"}</span>
              </div>
            </div>
          </div>

          {/* Genres */}
          <div className="space-y-2">
            <Label>Genres *</Label>
            <Select onValueChange={addGenre}>
              <SelectTrigger className="bg-card border-border">
                <SelectValue placeholder="Add genres" />
              </SelectTrigger>
              <SelectContent>
                {genreOptions.filter((g) => !genres.includes(g)).map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {genres.map((g) => (
                  <Badge key={g} variant="secondary" className="gap-1 pr-1">
                    {g}
                    <button type="button" onClick={() => removeGenre(g)} className="rounded-full p-0.5 hover:bg-accent">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Year & Duration (movie only) */}
          <div className={`grid gap-4 ${movieType === "movie" ? "grid-cols-2" : "grid-cols-1"}`}>
            <div className="space-y-2">
              <Label htmlFor="year">Release Year *</Label>
              <Input id="year" type="number" placeholder="2025" min={1900} max={2030} value={releaseYear} onChange={(e) => setReleaseYear(e.target.value)} className="bg-card border-border" />
            </div>
            {movieType === "movie" && (
              <div className="space-y-2">
                <Label htmlFor="duration">Duration *</Label>
                <Input id="duration" placeholder="2h 15m" value={duration} onChange={(e) => setDuration(e.target.value)} maxLength={20} className="bg-card border-border" />
              </div>
            )}
          </div>

          {/* Seasons & Episodes (series only) */}
          {movieType === "series" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Seasons & Episodes *</Label>
                <span className="text-xs text-muted-foreground">
                  {seasons.length} season{seasons.length > 1 ? "s" : ""} · {totalEpisodes} episode{totalEpisodes > 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-3">
                {seasons.map((season, sIndex) => (
                  <div key={sIndex} className="rounded-xl border border-border bg-card overflow-hidden">
                    {/* Season header */}
                    <div className="flex items-center gap-2 px-4 py-3 bg-accent/30">
                      <button type="button" onClick={() => toggleSeason(sIndex)} className="text-muted-foreground hover:text-foreground transition-colors">
                        {season.isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </button>
                      <Input
                        value={season.name}
                        onChange={(e) => updateSeasonName(sIndex, e.target.value)}
                        className="h-7 bg-transparent border-none px-1 text-sm font-medium text-card-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                        maxLength={60}
                      />
                      <span className="text-[11px] text-muted-foreground whitespace-nowrap">{season.episodes.length} ep</span>
                      {seasons.length > 1 && (
                        <button type="button" onClick={() => removeSeason(sIndex)} className="text-muted-foreground hover:text-destructive transition-colors ml-auto">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Episodes */}
                    {season.isExpanded && (
                      <div className="p-4 space-y-2">
                        {season.episodes.map((ep, eIndex) => (
                          <div key={eIndex} className="flex items-center gap-2">
                            <span className="text-[11px] text-muted-foreground w-6 text-right shrink-0">E{eIndex + 1}</span>
                            <Input
                              placeholder="Episode title"
                              value={ep.title}
                              onChange={(e) => updateEpisode(sIndex, eIndex, "title", e.target.value)}
                              className="bg-background border-border h-8 text-sm flex-1"
                              maxLength={200}
                            />
                            <Input
                              placeholder="Duration"
                              value={ep.duration}
                              onChange={(e) => updateEpisode(sIndex, eIndex, "duration", e.target.value)}
                              className="bg-background border-border h-8 text-sm w-24"
                              maxLength={10}
                            />
                            {season.episodes.length > 1 && (
                              <button type="button" onClick={() => removeEpisode(sIndex, eIndex)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
                                <X className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button type="button" onClick={() => addEpisode(sIndex)} className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors mt-1">
                          <Plus className="h-3 w-3" /> Add Episode
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Button type="button" variant="outline" size="sm" onClick={addSeason} className="gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Add Season
              </Button>
            </div>
          )}

          {/* Thumbnail */}
          <div className="space-y-2">
            <Label>Thumbnail</Label>
            <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-border bg-card cursor-pointer hover:border-primary/50 transition-colors">
              <div className="text-center text-muted-foreground">
                <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">Click to upload or drag and drop</p>
                <p className="text-[10px] mt-1 opacity-70">PNG, JPG up to 5MB</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="desc">Description *</Label>
            <Textarea id="desc" placeholder="Brief description..." value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} rows={4} className="bg-card border-border resize-none" />
            <p className="text-[11px] text-muted-foreground text-right">{description.length}/500</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="gap-2">
              <Film className="h-4 w-4" /> Add {movieType === "series" ? "Series" : "Movie"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/movies")}>Cancel</Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddMoviePage;
