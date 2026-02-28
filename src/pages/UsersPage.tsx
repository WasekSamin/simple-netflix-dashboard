import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  MoreHorizontal,
  UserCheck,
  UserX,
  Ban,
  Eye,
  Trash2,
  Loader2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, deleteUser } from "@/services/userService";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const statusConfig = {
  active: {
    label: "Active",
    icon: UserCheck,
    className: "bg-success/15 text-success border-success/20",
  },
  inactive: {
    label: "Inactive",
    icon: UserX,
    className: "bg-warning/15 text-warning border-warning/20",
  },
  blocked: {
    label: "Blocked",
    icon: Ban,
    className: "bg-destructive/15 text-destructive border-destructive/20",
  },
};

const UsersPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "blocked"
  >("all");
  const [userToDelete, setUserToDelete] = useState<Record<string, any> | null>(
    null,
  );

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const { data: userData, isPending: isPendingUsers } = useQuery({
    queryKey: ["users", debouncedSearch, currentPage, statusFilter],
    queryFn: ({ signal }) =>
      getUsers({
        currentPage,
        sortBy: "id",
        direction: "desc",
        query: debouncedSearch,
        status: statusFilter === "all" ? undefined : statusFilter,
        signal,
      }),
  }) as {
    data: Record<string, any>;
    isPending: boolean;
  };

  // ─── Delete Mutation ────────────────────────────────────
  const { mutate: removeUser, isPending: isDeleting } = useMutation({
    mutationFn: (user: Record<string, any>) => deleteUser({ userId: user.id }),
    onSuccess: (_data, user) => {
      toast({
        title: "User Deleted",
        description: `User "${user.firstName} ${user.lastName}" has been deleted.`,
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setUserToDelete(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
      setUserToDelete(null);
    },
  });

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
            Users
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage registered users and accounts
          </p>
        </div>
        <Button className="gap-2" onClick={() => navigate("/users/add")}>
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Total Users",
            count: userData?.totalUsers ?? 0,
            color: "text-foreground",
          },
          {
            label: "Active",
            count: userData?.activeUsers ?? 0,
            color: "text-success",
          },
          {
            label: "Inactive",
            count: userData?.inactiveUsers ?? 0,
            color: "text-success",
          },
          {
            label: "Blocked",
            count: userData?.blockedUsers ?? 0,
            color: "text-destructive",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-card p-4"
          >
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`font-display text-2xl font-bold mt-1 ${s.color}`}>
              {s.count}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>
        <div className="flex gap-1 rounded-lg bg-card border border-border p-1">
          {(["all", "active", "inactive", "blocked"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors capitalize ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {isPendingUsers ? (
        <Spinner className="w-8 h-8 mx-auto" />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  User
                </th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Email
                </th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Joined
                </th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {userData?.users?.map((user) => {
                const config = statusConfig[user.accountStatus.toLowerCase()];

                return (
                  <tr
                    key={user.id}
                    className="border-b border-border/50 transition-colors hover:bg-accent/30"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 min-w-9 min-h-9 items-center justify-center rounded-full bg-primary/15 text-primary text-sm font-bold">
                          {user.firstName?.charAt(0)?.toUpperCase() ?? ""}{" "}
                          {user.lastName?.charAt(0)?.toUpperCase() ?? ""}
                        </div>
                        <span className="text-sm font-medium text-card-foreground">
                          {user.firstName ?? ""} {user.lastName ?? ""}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">
                      {user.email ?? ""}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${config.className}`}
                      >
                        <config.icon className="h-3 w-3" />
                        {user.role ?? ""}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">
                      {format(user.createdAt, "MMM d, yyyy")}
                    </td>
                    <td className="px-5 py-3.5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40" align="start">
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              onClick={() => navigate(`/users/${user.id}`)}
                              className="flex items-center gap-x-1.5"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setUserToDelete(user)}
                              className="flex items-center gap-x-1.5 text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirmation */}
      <AlertDialog
        open={!!userToDelete}
        onOpenChange={(open) => !open && setUserToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {userToDelete?.firstName} {userToDelete?.lastName}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => removeUser(userToDelete)}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default UsersPage;
