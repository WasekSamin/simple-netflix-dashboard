import { ResponseType } from "@/types/types";
import { requestSubmit } from "@/utils/Provider";

const loginSubmit = async ({
  payload,
  signal,
}: {
  payload: {
    email: string;
    password: string;
  };
  signal?: AbortSignal;
}) => {
  const controller = new AbortController();

  if (signal) {
    signal.addEventListener("abort", () => controller.abort());
  }

  const requestedData: ResponseType = await requestSubmit({
    requestedUrl: "/api/auth/login",
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

const logoutSubmit = async ({
  signal,
}: {
  signal?: AbortSignal;
} = {}) => {
  const controller = new AbortController();

  if (signal) {
    signal.addEventListener("abort", () => controller.abort());
  }

  const requestedData: ResponseType = await requestSubmit({
    requestedUrl: "/api/auth/logout",
    formData: {},
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

export { loginSubmit, logoutSubmit };
