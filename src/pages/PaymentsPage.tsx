import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { payments } from "@/data/mockData";
import { DollarSign, CreditCard, Phone, Hash } from "lucide-react";

const PaymentsPage = () => {
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">Payments</h1>
        <p className="text-sm text-muted-foreground mt-1">Track payment transactions and revenue</p>
      </div>

      {/* Revenue summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground">Total Revenue</p>
          <p className="font-display text-3xl font-bold text-foreground mt-1">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground">Transactions</p>
          <p className="font-display text-3xl font-bold text-foreground mt-1">{payments.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground">Avg. Transaction</p>
          <p className="font-display text-3xl font-bold text-foreground mt-1">${(totalRevenue / payments.length).toFixed(2)}</p>
        </div>
      </div>

      {/* Payment Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="font-display text-base font-semibold text-card-foreground">Payment History</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">User</th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Transaction ID</th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Method</th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Phone</th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Amount</th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b border-border/50 transition-colors hover:bg-accent/30">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-bold">
                      {payment.user.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-card-foreground">{payment.user}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Hash className="h-3 w-3" />
                    <span className="font-mono text-xs">{payment.trx_id}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <CreditCard className="h-3.5 w-3.5" />
                    {payment.payment_method}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {payment.phone_number}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1 text-sm font-medium text-success">
                    <DollarSign className="h-3.5 w-3.5" />
                    {payment.amount.toFixed(2)}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground">{payment.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default PaymentsPage;
