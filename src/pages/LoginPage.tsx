import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Film, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginSubmit } from "@/services/loginService";
import { AuthStoreType, useAuthStore } from "@/store/AuthStore";
import { getCurrentLoggedInUser } from "@/services/userService";
import { AuthType } from "@/types/auth";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z
    .string()
    .min(1, "Password is required")
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const updateAuthData = useAuthStore(
    (state: AuthStoreType) => state.updateAuthData,
  );
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: submitLogin, isPending } = useMutation({
    mutationFn: (formData: LoginFormData) =>
      loginSubmit({
        payload: {
          email: formData.email,
          password: formData.password,
        },
      }),

    onSuccess: async (data: Record<string, any>) => {
      toast({ title: "Welcome back!", description: "Login successful." });

      const { token } = data;

      if (token) {
        // @ts-ignore
        updateAuthData({ token });

        const userData: AuthType = await queryClient.fetchQuery({
          queryKey: ["current-user"],
          queryFn: ({ signal }) => getCurrentLoggedInUser({ signal }),
        });

        if (userData) {
          updateAuthData(userData);
          localStorage.setItem("token", token);
        } else {
          updateAuthData(null);
        }
      }

      navigate("/");
    },

    onError: (err: Record<string, any>) => {
      toast({
        title: "Error!",
        description: err?.message || "Failed to logged in!",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (formData: LoginFormData) => {
    submitLogin(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Film className="h-7 w-7" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
            Netflix Admin
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="bg-card border-border"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="bg-card border-border pr-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isPending}
          >
            {isSubmitting || isPending ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button
            type="button"
            className="text-primary hover:text-primary/80 transition-colors font-medium"
            onClick={() =>
              toast({
                title: "Contact admin",
                description:
                  "Please contact an administrator to create an account.",
              })
            }
          >
            Request access
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
