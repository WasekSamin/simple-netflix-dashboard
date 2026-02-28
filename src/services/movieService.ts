import { ResponseType } from "@/types/types";
import { requestSubmit } from "@/utils/Provider";

const createMovie = async ({
  payload,
  signal,
}: {
  payload: {
    title: string;
    contentType: string;
    description: string;
    maturityRating: string;
    releaseYear: number;
    duration: string;
    thumbnailUrl: string;
    director: string;
    isFeatured?: boolean;
    genreIds?: number[];
    actorIds?: number[];
    seasons?: {
      name: string;
      seasonNumber: number;
      episodes: {
        title: string;
        episodeNumber: number;
        duration: string;
        description?: string;
        thumbnailUrl?: string;
        releaseDate?: string;
      }[];
    }[];
  };
  signal?: AbortSignal;
}) => {
  const controller = new AbortController();

  if (signal) {
    signal.addEventListener("abort", () => controller.abort());
  }

  const requestedData: ResponseType = await requestSubmit({
    requestedUrl: "/api/movies",
    formData: payload,
    method: "post",
    controller: controller,
  });

  if (!requestedData?.err) {
    return requestedData.data;
  } else {
    if (requestedData?.err?.message === "canceled") return;
    throw new Error(
      requestedData?.err?.response?.data?.message || "Something went wrong!",
    );
  }
};

const getMovies = async ({
  currentPage,
  sortBy="id",
  direction="desc",
  query,
  contentType,
  signal,
}: {
  currentPage: number;
  sortBy?: string;
  direction?: string;
  query?: string;
  contentType?: string;
  signal?: AbortSignal;
}) => {
  const controller = new AbortController();

  if (signal) {
    signal.addEventListener("abort", () => controller.abort());
  }

  const requestedData: ResponseType = await requestSubmit({
    requestedUrl: "/api/movies",
    params: {
      page: currentPage,
      sortBy,
      direction,
      contentType,
      query,
    },
    method: "get",
    controller: controller,
  });

  if (!requestedData?.err) {
    return requestedData.data;
  } else {
    if (requestedData?.err?.message === "canceled") return;
    throw new Error(
      requestedData?.err?.response?.data?.message || "Something went wrong!",
    );
  }
};

export { createMovie, getMovies };
