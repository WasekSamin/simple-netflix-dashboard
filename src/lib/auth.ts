import { logoutSubmit } from "@/services/loginService";
import { useAuthStore } from "@/store/AuthStore";

const userLogout = async () => {
  await logoutSubmit();
  localStorage.clear();
  useAuthStore.getState().logout();
  window.location.href = "/sign-in";
};

export { userLogout };
