import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthStoreType, useAuthStore } from "@/store/AuthStore";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { USER_ROLES } from "@/utils/auth";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { updateUser } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";

const settingsSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name must be 50 characters or less"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name must be 50 characters or less"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    role: z.string().min(1, "Role is required"),
    newPassword: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length >= 6,
        "Password must be at least 6 characters",
      )
      .refine(
        (val) => !val || /[0-9]/.test(val),
        "Password must contain at least 1 number",
      )
      .refine(
        (val) => !val || /[a-z]/.test(val),
        "Password must contain at least 1 lowercase letter",
      )
      .refine(
        (val) => !val || /[A-Z]/.test(val),
        "Password must contain at least 1 uppercase letter",
      )
      .refine(
        (val) => !val || /[^a-zA-Z0-9]/.test(val),
        "Password must contain at least 1 special character",
      ),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

type SettingsFormValues = z.infer<typeof settingsSchema>;

const SettingsPage = () => {
  const { toast } = useToast();
  const authData = useAuthStore((state: AuthStoreType) => state.authData);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      firstName: authData?.firstName ?? "",
      lastName: authData?.lastName ?? "",
      email: authData?.email ?? "",
      role: authData?.role ?? "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: (formData: SettingsFormValues) =>
      updateUser({
        userId: authData?.id,
        payload: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
          password: formData.newPassword,
        },
      }),

    onSuccess: async (data: Record<string, any>) => {
      toast({
        title: "Success!",
        description: "Profile updated successfully.",
      });
    },

    onError: (err: Record<string, any>) => {
      toast({
        title: "Error!",
        description: err?.message || "Failed to update profile info!",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (formData: SettingsFormValues) => {
    updateProfile(formData);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure your dashboard preferences
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Profile */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-card-foreground mb-4">
            Profile
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">
                  First Name
                </Label>
                <Input
                  {...register("firstName")}
                  className="bg-background border-border"
                />
                {errors.firstName && (
                  <p className="text-xs text-destructive">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">
                  Last Name
                </Label>
                <Input
                  {...register("lastName")}
                  className="bg-background border-border"
                />
                {errors.lastName && (
                  <p className="text-xs text-destructive">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Email</Label>
                <Input
                  {...register("email")}
                  className="bg-background border-border"
                />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Role</Label>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select...</SelectLabel>
                        {Object.values(USER_ROLES).map((role) => (
                          <SelectItem key={role} value={role}>
                            {role?.charAt(0) ?? ""}
                            {(role?.slice(1) ?? "").toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && (
                <p className="text-xs text-destructive">
                  {errors.role.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-card-foreground mb-4">
            Security
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">
                  New Password
                </Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...register("newPassword")}
                  className="bg-background border-border"
                />
                {errors.newPassword && (
                  <p className="text-xs text-destructive">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">
                  Confirm Password
                </Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className="bg-background border-border"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pb-8">
          <Button
            type="submit"
            className="px-8"
            disabled={isSubmitting || isPending}
          >
            {isSubmitting || isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default SettingsPage;
