import { getCurrentLoggedInUser } from "@/services/userService";
import { AuthStoreType, useAuthStore } from "@/store/AuthStore";
import { AuthType } from "@/types/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const authData = useAuthStore((state: AuthStoreType) => state.authData);
  const updateAuthData = useAuthStore((state: AuthStoreType) => state.updateAuthData);
  const location = useLocation();
  const queryClient = useQueryClient();

  const getUserToken = () => {
    const token = localStorage.getItem("token");
    return token ?? null;
  }

  const UNAUTH_URLS = [
    "/sign-in",
  ]

  useEffect(() => {
    const token = getUserToken();

    if (!authData) {
      if (token) {
        // @ts-ignore
        updateAuthData({token});

        const getUserData = async() => {
          // Get user data
          const userData: AuthType = await queryClient.fetchQuery({
            queryKey: ["current-user"],
            queryFn: ({ signal }) => getCurrentLoggedInUser({ signal }),
          });

          if (userData) {
            updateAuthData(userData);

            if (location.pathname === "/sign-in") {
              navigate("/");
            }
          } else {
            navigate("/sign-in");
          }
        }

        getUserData();
      } else {
        if (!UNAUTH_URLS.includes(location.pathname)) {
          // Visit login page 
          navigate("/sign-in");
        }
      }
    }
  }, [location.pathname]);

  return <>{children}</>;
};

export default AuthGuard;
