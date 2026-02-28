import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { USER_ROLES } from "@/utils/auth";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { createUser } from "@/services/userService";

const addUserSchema = z
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
      .email("Please enter a valid email address")
      .max(255, "Email must be 255 characters or less"),
    status: z.enum(["active", "inactive", "blocked"], {
      required_error: "Status is required",
    }),
    role: z.enum(Object.values(USER_ROLES) as [string, ...string[]], {
      required_error: "Role is required",
    }),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one symbol (!@#$%^&*...)",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type AddUserFormValues = z.infer<typeof addUserSchema>;

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-sm text-destructive mt-1">{message}</p> : null;

const AddUserPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      status: "active",
      role: "ADMIN",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: addNewUser, isPending } = useMutation({
    mutationFn: (formData: AddUserFormValues) =>
      createUser({
        payload: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
          accountStatus: formData.status?.toUpperCase(),
          password: formData.password,
        },
      }),

    onSuccess: async (data: Record<string, any>) => {
      toast({
        title: "Success!",
        description: "Profile created successfully.",
      });
      navigate("/users");
    },

    onError: (err: Record<string, any>) => {
      toast({
        title: "Error!",
        description: err?.message || "Failed to update profile info!",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (formData: AddUserFormValues) => {
    addNewUser(formData);
  };

  return (
    <DashboardLayout>
      <div>
        <button
          onClick={() => navigate("/users")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Users
        </button>

        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-foreground tracking-tight flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <UserPlus className="h-5 w-5" />
            </div>
            Add New User
          </h1>
          <p className="text-sm text-muted-foreground mt-1 ml-[52px]">
            Create a new user account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              placeholder="John"
              maxLength={50}
              className="bg-card border-border"
              {...register("firstName")}
            />
            <FieldError message={errors.firstName?.message} />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              maxLength={50}
              className="bg-card border-border"
              {...register("lastName")}
            />
            <FieldError message={errors.lastName?.message} />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              maxLength={255}
              className="bg-card border-border"
              {...register("email")}
            />
            <FieldError message={errors.email?.message} />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status *</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-card border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError message={errors.status?.message} />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label>Role *</Label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-card border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(USER_ROLES).map((role) => (
                      <SelectItem key={role} value={role}>
                        {role?.charAt(0) ?? ""}
                        {(role?.slice(1) ?? "").toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError message={errors.role?.message} />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              placeholder="Min. 6 characters"
              className="bg-card border-border"
              {...register("password")}
            />
            <FieldError message={errors.password?.message} />
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repeat password"
              className="bg-card border-border"
              {...register("confirmPassword")}
            />
            <FieldError message={errors.confirmPassword?.message} />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              className="gap-2"
              disabled={isSubmitting || isPending}
            >
              <UserPlus className="h-4 w-4" />{" "}
              {isSubmitting || isPending ? "Creating..." : "Create User"}
            </Button>
            <Button
              disabled={isSubmitting || isPending}
              type="button"
              variant="outline"
              onClick={() => navigate("/users")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddUserPage;
