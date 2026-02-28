import {
  Film,
  LayoutDashboard,
  Users,
  CreditCard,
  Receipt,
  Settings,
  TrendingUp,
  EllipsisVertical,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AuthStoreType, useAuthStore } from "@/store/AuthStore";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { userLogout } from "@/lib/auth";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/" },
  { icon: Film, label: "Movies", to: "/movies" },
  { icon: Users, label: "Users", to: "/users" },
  { icon: CreditCard, label: "Subscriptions", to: "/subscriptions" },
  { icon: Receipt, label: "Payments", to: "/payments" },
  { icon: TrendingUp, label: "Analytics", to: "/analytics" },
  { icon: Settings, label: "Settings", to: "/settings" },
];

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const authData = useAuthStore((state: AuthStoreType) => state.authData);

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Film className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-display text-lg font-bold text-sidebar-accent-foreground tracking-tight">
          Netflix Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
              )
            }
          >
            <item.icon className="h-4.5 w-4.5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 min-w-9 min-h-9 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">
              {authData?.firstName?.charAt(0) ?? ""}{" "}
              {authData?.lastName?.charAt(0) ?? ""}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-accent-foreground truncate">
                {authData?.firstName ?? ""} {authData?.lastName ?? ""}
              </p>
              <p className="text-xs text-sidebar-foreground truncate">
                {authData?.email ?? ""}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <EllipsisVertical className="w-5 h-5 min-w-5 min-h-5 hover:cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="start">
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => userLogout()}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
