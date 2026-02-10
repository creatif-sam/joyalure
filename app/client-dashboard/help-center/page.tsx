export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { LifeBuoy, ArrowRight } from "lucide-react"

export default async function HelpCenterPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}
      }
    }
  )

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="space-y-10 max-w-3xl transition-colors duration-300">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-green-700 dark:text-green-500">
          Help Center
        </h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
          Find answers to common questions or get in touch with us.
        </p>
      </div>

      <Section title="Frequently Asked Questions">
        <div className="space-y-3">
          <FaqItem
            question="Where is my order?"
            answer="You can track your order status in the Orders section of your dashboard."
          />
          <FaqItem
            question="How do I use a voucher?"
            answer="Apply your voucher code at checkout to receive the discount."
          />
          <FaqItem
            question="Can I return a product?"
            answer="Yes, returns are accepted within our return policy period. Contact support for assistance."
          />
          <FaqItem
            question="How do I update my profile?"
            answer="You can update your personal details and photo from the Profile page."
          />
        </div>
      </Section>

      <Section title="Popular Topics">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Topic label="Orders and Delivery" />
          <Topic label="Payments and Refunds" />
          <Topic label="Account and Security" />
          <Topic label="Vouchers and Promotions" />
        </ul>
      </Section>

      <Section title="Need more help?">
        <div className="bg-white dark:bg-zinc-950 border border-green-100 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-3 text-green-700 dark:text-green-500">
            <LifeBuoy className="h-5 w-5" />
            <p className="text-sm font-bold">24/7 Support Team</p>
          </div>
          <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
            If you cannot find the answer you are looking for, our support team is here to help you with any inquiries.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-green-700 dark:text-green-500 hover:gap-3 transition-all"
          >
            Contact Support <ArrowRight size={14} />
          </a>
        </div>
      </Section>

    </div>
  )
}

function Section({
  title,
  children
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-5">
      <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500">
        {title}
      </h2>
      {children}
    </div>
  )
}

function FaqItem({
  question,
  answer
}: {
  question: string
  answer: string
}) {
  return (
    <div className="bg-white dark:bg-zinc-950 border border-green-100 dark:border-zinc-800 rounded-2xl p-5 hover:border-green-300 dark:hover:border-green-900/50 transition-colors shadow-sm">
      <p className="font-bold text-green-700 dark:text-green-500">
        {question}
      </p>
      <p className="text-sm text-gray-600 dark:text-zinc-400 mt-2 leading-relaxed">
        {answer}
      </p>
    </div>
  )
}

function Topic({ label }: { label: string }) {
  return (
    <div className="group bg-white dark:bg-zinc-950 border border-green-100 dark:border-zinc-800 rounded-2xl p-4 text-sm font-bold text-gray-700 dark:text-zinc-300 flex justify-between items-center hover:bg-green-50 dark:hover:bg-zinc-900 transition-all cursor-pointer">
      {label}
      <ArrowRight size={14} className="text-gray-300 group-hover:text-green-600 transition-colors" />
    </div>
  )
}