export type ResponseType<T = unknown> = {
  status: number;
  data: T;
  err: AxiosError;
  headers?: AxiosResponse['headers'];
};