import { ResponseType } from "@/types/types";
import { requestSubmit } from "@/utils/Provider";

const getGenres = async ({
  currentPage,
  sortBy,
  direction,
  query,
  status,
  fetchAll,
  signal,
}: {
  currentPage: number;
  sortBy?: string;
  direction?: string;
  query?: string;
  status?: string;
  fetchAll?: boolean;
  signal?: AbortSignal;
}) => {
  const controller = new AbortController();

  if (signal) {
    signal.addEventListener("abort", () => controller.abort());
  }

  const requestedData: ResponseType = await requestSubmit({
    requestedUrl: "/api/genres",
    params: {
      page: currentPage,
      sortBy,
      direction,
      status,
      query,
      fetchAll,
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

const getGenre = async ({
  genreId,
  signal,
}: {
  genreId: number | string;
  signal?: AbortSignal;
}) => {
  const controller = new AbortController();

  if (signal) {
    signal.addEventListener("abort", () => controller.abort());
  }

  const requestedData: ResponseType = await requestSubmit({
    requestedUrl: `/api/genres/${genreId}`,
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

const createGenre = async ({
  payload,
  signal,
}: {
  payload: {
    name: string;
  };
  signal?: AbortSignal;
}) => {
  const controller = new AbortController();

  if (signal) {
    signal.addEventListener("abort", () => controller.abort());
  }

  const requestedData: ResponseType = await requestSubmit({
    requestedUrl: "/api/genres",
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

const updateGenre = async ({
  genreId,
  payload,
  signal,
}: {
  genreId: number | string;
  payload: {
    name: string;
  };
  signal?: AbortSignal;
}) => {
  const controller = new AbortController();

  if (signal) {
    signal.addEventListener("abort", () => controller.abort());
  }

  const requestedData: ResponseType = await requestSubmit({
    requestedUrl: `/api/genres/${genreId}`,
    formData: payload,
    method: "put",
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

const deleteGenre = async ({
  genreId,
  signal,
}: {
  genreId: number;
  signal?: AbortSignal;
}) => {
  const controller = new AbortController();

  if (signal) {
    signal.addEventListener("abort", () => controller.abort());
  }

  const requestedData: ResponseType = await requestSubmit({
    requestedUrl: `/api/genres/${genreId}`,
    method: "delete",
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

export { createGenre, getGenres, deleteGenre, updateGenre, getGenre };
