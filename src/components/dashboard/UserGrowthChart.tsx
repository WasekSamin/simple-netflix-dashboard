import { useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Spinner } from "@/components/ui/spinner";

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const UserGrowthChart = ({
  userData,
  isPendingUsers,
}: {
  userData: Record<string, any>;
  isPendingUsers: boolean;
}) => {
  const chartData = useMemo(() => {
    if (!userData?.users?.length) return [];

    // Group users by "YYYY-MM"
    const countsByMonth: Record<string, number> = {};

    userData.users.forEach((user: Record<string, any>) => {
      if (!user.createdAt) return;
      const date = new Date(user.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, "0")}`;
      countsByMonth[key] = (countsByMonth[key] || 0) + 1;
    });

    // Sort keys chronologically
    const sortedKeys = Object.keys(countsByMonth).sort();

    // Build chart-friendly array with cumulative total
    let cumulative = 0;
    return sortedKeys.map((key) => {
      const [year, monthIdx] = key.split("-");
      cumulative += countsByMonth[key];
      return {
        month: `${MONTH_LABELS[parseInt(monthIdx, 10)]} ${year}`,
        newUsers: countsByMonth[key],
        totalUsers: cumulative,
      };
    });
  }, [userData]);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-6">
        <h3 className="font-display text-base font-semibold text-card-foreground">
          User Growth
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Monthly new registrations
        </p>
      </div>

      <div className="h-64">
        {isPendingUsers ? (
          <div className="flex items-center justify-center h-full">
            <Spinner className="w-6 h-6" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">
              No user data available
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="hsl(0, 85%, 52%)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor="hsl(0, 85%, 52%)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(0, 0%, 55%)", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(0, 0%, 55%)", fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 10%)",
                  border: "1px solid hsl(0, 0%, 18%)",
                  borderRadius: "8px",
                  color: "hsl(0, 0%, 95%)",
                  fontSize: "13px",
                }}
                formatter={(value: number, name: string) => {
                  const label =
                    name === "newUsers"
                      ? "New Users"
                      : "Total Users";
                  return [value, label];
                }}
              />
              <Area
                type="monotone"
                dataKey="newUsers"
                stroke="hsl(0, 85%, 52%)"
                strokeWidth={2}
                fill="url(#userGradient)"
                name="newUsers"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default UserGrowthChart;