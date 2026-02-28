import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { monthlyStats } from "@/data/mockData";

const RevenueChart = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-6">
        <h3 className="font-display text-base font-semibold text-card-foreground">Revenue</h3>
        <p className="text-xs text-muted-foreground mt-1">Monthly earnings ($)</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyStats}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(0, 0%, 55%)", fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(0, 0%, 55%)", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 10%)",
                border: "1px solid hsl(0, 0%, 18%)",
                borderRadius: "8px",
                color: "hsl(0, 0%, 95%)",
                fontSize: "13px",
              }}
            />
            <Bar dataKey="revenue" fill="hsl(0, 85%, 52%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
