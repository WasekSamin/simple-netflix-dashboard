import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { subscriptions } from "@/data/mockData";
import { CreditCard, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const statusConfig = {
  active: { label: "Active", icon: CheckCircle2, className: "bg-success/15 text-success border-success/20" },
  expired: { label: "Expired", icon: AlertCircle, className: "bg-warning/15 text-warning border-warning/20" },
  cancelled: { label: "Cancelled", icon: XCircle, className: "bg-destructive/15 text-destructive border-destructive/20" },
};

const SubscriptionsPage = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">Subscriptions</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor user subscription plans and statuses</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Active", count: subscriptions.filter((s) => s.status === "active").length, color: "text-success", icon: CheckCircle2 },
          { label: "Expired", count: subscriptions.filter((s) => s.status === "expired").length, color: "text-warning", icon: AlertCircle },
          { label: "Cancelled", count: subscriptions.filter((s) => s.status === "cancelled").length, color: "text-destructive", icon: XCircle },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-card ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`font-display text-2xl font-bold ${s.color}`}>{s.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="font-display text-base font-semibold text-card-foreground">All Subscriptions</h3>
          <span className="text-xs text-muted-foreground">{subscriptions.length} total</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">User</th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Payment Method</th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Start Date</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => {
              const config = statusConfig[sub.status];
              return (
                <tr key={sub.id} className="border-b border-border/50 transition-colors hover:bg-accent/30">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-bold">
                        {sub.user.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-card-foreground">{sub.user}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${config.className}`}>
                      <config.icon className="h-3 w-3" />
                      {config.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CreditCard className="h-3.5 w-3.5" />
                      {sub.payment_method}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{sub.created}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionsPage;
