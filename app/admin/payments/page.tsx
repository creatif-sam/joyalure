import { cookies } from "next/headers"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, DollarSign, TrendingUp, Calendar, ArrowRight } from "lucide-react"
import { unstable_noStore } from "next/cache"

export default async function AdminPayments() {
  unstable_noStore()

  const cookieStore = await cookies()
  const supabase = createServerSupabaseClient({
    cookies: cookieStore,
  })

  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)

  const totalRevenue =
    payments?.reduce(
      (sum, payment) =>
        payment.status === "completed" ? sum + payment.amount : sum,
      0
    ) ?? 0

  const pendingPayments = payments?.filter(p => p.status === "pending").length ?? 0
  const completedPayments = payments?.filter(p => p.status === "completed").length ?? 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "failed": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default: return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400"
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      
      {/* HEADER: Stack on mobile, row on PC */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 italic uppercase">
            Payment <span className="text-green-600">Control</span>
          </h1>
          <p className="text-xs md:text-sm font-medium text-zinc-500">Track and manage Joyalure financial transactions.</p>
        </div>
        <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-600/20 active:scale-95 transition-all">
          <CreditCard className="mr-2 h-4 w-4" />
          Process Payments
        </Button>
      </div>

      {/* STATS GRID: 1 col on mobile, 3 on PC */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <StatCard label="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} icon={DollarSign} desc="From completed payments" color="text-green-600" />
        <StatCard label="Completed" value={completedPayments} icon={TrendingUp} desc="Successful transactions" color="text-blue-600" />
        <StatCard label="Pending" value={pendingPayments} icon={Calendar} desc="Awaiting processing" color="text-yellow-600" />
      </div>

      {/* RECENT PAYMENTS */}
      <Card className="rounded-[2rem] border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-2xl shadow-zinc-200/50 dark:shadow-none">
        <CardHeader className="p-6 md:p-8 border-b dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <CardTitle className="text-lg font-black uppercase tracking-tight italic">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y dark:divide-zinc-800">
            {payments && payments.length > 0 ? (
              payments.map(payment => (
                <div
                  key={payment.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-5 md:p-6 hover:bg-green-50/30 dark:hover:bg-green-500/5 transition-all gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 shrink-0 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500">
                      <CreditCard size={20} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                        ${payment.amount} <span className="text-[10px] font-black uppercase text-zinc-400">{payment.currency}</span>
                      </h3>
                      <p className="text-xs text-zinc-500 truncate max-w-[200px] md:max-w-none">
                        {payment.user_email ?? "Anonymous"} • {payment.payment_method}
                      </p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter mt-0.5">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-0 pt-3 sm:pt-0">
                    <Badge variant="outline" className={`rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest border-0 ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </Badge>
                    <button className="p-2 text-zinc-300 hover:text-green-600 transition-colors">
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, desc, color }: any) {
  return (
    <Card className="rounded-[1.5rem] border-zinc-100 dark:border-zinc-800 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{label}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-black italic tracking-tighter text-zinc-900 dark:text-zinc-100">{value}</div>
        <p className="text-[10px] font-medium text-zinc-500 mt-1">{desc}</p>
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-20 px-6">
      <div className="h-16 w-16 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
        <CreditCard className="h-8 w-8 text-zinc-300" />
      </div>
      <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500">Archive Clear</h3>
      <p className="mt-1 text-xs text-zinc-400 max-w-[200px] mx-auto leading-relaxed">Transactions will appear here once processed.</p>
    </div>
  )
}