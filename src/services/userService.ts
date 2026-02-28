import { ResponseType } from "@/types/types";
import { requestSubmit } from "@/utils/Provider";

const getCurrentLoggedInUser = async ({ signal }: { signal?: AbortSignal }) => {
  const controller = new AbortController();

  if (signal) {
    signal.addEventListener("abort", () => controller.abort());
  }

  const requestedData: ResponseType = await requestSubmit({
    requestedUrl: "/api/users/me",
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

const updateUser = async ({
  userId,
  payload,
  signal,
}: {
  userId: number | string;
  payload: {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    password?: string;
    accountStatus?: string;
  };
  signal?: AbortSignal;
}) => {
  const controller = new AbortController();

  if (signal) {
    signal.addEventListener("abort", () => controller.abort());
  }

  const requestedData: ResponseType = await requestSubmit({
    requestedUrl: `/api/users/${userId}`,
    method: "put",
    formData: payload,
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

const getUsers = async ({
  currentPage,
  sortBy,
  direction,
  query,
  status,
  signal,
}: {
  currentPage: number;
  sortBy?: string;
  direction?: string;
  query?: string;
  status?: string;
  signal?: AbortSignal;
}) => {
  const controller = new AbortController();

  if (signal) {
    signal.addEventListener("abort", () => controller.abort());
  }

  const requestedData: ResponseType = await requestSubmit({
    requestedUrl: "/api/users",
    params: {
      page: currentPage,
      sortBy,
      direction,
      status,
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

const getUser = async ({
  userId,
  signal,
}: {
  userId: number | string;
  signal?: AbortSignal;
}) => {
  const controller = new AbortController();

  if (signal) {
    signal.addEventListener("abort", () => controller.abort());
  }

  const requestedData: ResponseType = await requestSubmit({
    requestedUrl: `/api/users/${userId}`,
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

const createUser = async ({
  payload,
  signal,
}: {
  payload: {
    firstName: string;
    lastName: string;
    email: string;
    accountStatus: string;
    role: string;
    password: string;
  };
  signal?: AbortSignal;
}) => {
  const controller = new AbortController();

  if (signal) {
    signal.addEventListener("abort", () => controller.abort());
  }

  const requestedData: ResponseType = await requestSubmit({
    requestedUrl: "/api/users",
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

const deleteUser = async ({
  userId,
  signal,
}: {
  userId: number;
  signal?: AbortSignal;
}) => {
  const controller = new AbortController();

  if (signal) {
    signal.addEventListener("abort", () => controller.abort());
  }

  const requestedData: ResponseType = await requestSubmit({
    requestedUrl: `/api/users/${userId}`,
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

export {
  getCurrentLoggedInUser,
  updateUser,
  getUsers,
  createUser,
  deleteUser,
  getUser,
};
