import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  isLoading?: boolean;
}

const StatsCard = ({ title, value, icon: Icon, isLoading=true }: StatsCardProps) => {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-start justify-between">
        {
          isLoading ? 
          <Spinner className="w-8 h-8 mx-auto" /> : 
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="font-display text-3xl font-bold text-card-foreground tracking-tight">{value}</p>
        </div>
        }
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
