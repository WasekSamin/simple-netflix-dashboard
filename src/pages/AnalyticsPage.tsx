import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { monthlyStats, genreDistribution } from "@/data/mockData";
import {
  Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, Line, LineChart,
} from "recharts";

const COLORS = [
  "hsl(0, 85%, 52%)",
  "hsl(25, 95%, 53%)",
  "hsl(142, 71%, 45%)",
  "hsl(217, 91%, 60%)",
  "hsl(270, 67%, 58%)",
  "hsl(38, 92%, 50%)",
];

const tooltipStyle = {
  backgroundColor: "hsl(0, 0%, 10%)",
  border: "1px solid hsl(0, 0%, 18%)",
  borderRadius: "8px",
  color: "hsl(0, 0%, 95%)",
  fontSize: "13px",
};

const AnalyticsPage = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Detailed platform performance insights</p>
      </div>

      {/* Top row KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Views", value: "284K", change: "+22%" },
          { label: "Watch Time", value: "1.2M hrs", change: "+15%" },
          { label: "Avg. Rating", value: "8.2", change: "+0.3" },
          { label: "Retention", value: "72%", change: "+4%" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground">{kpi.label}</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">{kpi.value}</p>
            <p className="text-xs text-success font-medium mt-1">{kpi.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Views Over Time */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-display text-base font-semibold text-card-foreground mb-1">Views Over Time</h3>
          <p className="text-xs text-muted-foreground mb-6">Monthly streaming views</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyStats}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(0,0%,55%)", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(0,0%,55%)", fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="views" stroke="hsl(217, 91%, 60%)" strokeWidth={2} fill="url(#viewsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Genre Distribution */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-display text-base font-semibold text-card-foreground mb-1">Genre Distribution</h3>
          <p className="text-xs text-muted-foreground mb-6">Content by genre category</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genreDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3} strokeWidth={0}>
                  {genreDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", color: "hsl(0,0%,55%)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-display text-base font-semibold text-card-foreground mb-1">Revenue Trend</h3>
          <p className="text-xs text-muted-foreground mb-6">Monthly revenue growth</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyStats}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(0,0%,55%)", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(0,0%,55%)", fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={{ fill: "hsl(142, 71%, 45%)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Users vs Views */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-display text-base font-semibold text-card-foreground mb-1">Users vs Views</h3>
          <p className="text-xs text-muted-foreground mb-6">Correlation between growth metrics</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyStats}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(0,0%,55%)", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(0,0%,55%)", fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="users" fill="hsl(0, 85%, 52%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="views" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} opacity={0.6} />
                <Legend wrapperStyle={{ fontSize: "12px", color: "hsl(0,0%,55%)" }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
