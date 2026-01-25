export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

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
    <div className="space-y-8 max-w-3xl">

      <div>
        <h1 className="text-2xl font-semibold text-green-700">
          Help Center
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Find answers to common questions or get in touch with us.
        </p>
      </div>

      <Section title="Frequently Asked Questions">
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
        <div className="bg-white border border-green-100 rounded-lg p-4 space-y-2">
          <p className="text-sm text-gray-600">
            If you cannot find the answer you are looking for, our support team is here to help.
          </p>
          <a
            href="/contact"
            className="inline-block text-sm text-green-700 hover:underline"
          >
            Contact Support
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
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-green-700">
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
    <div className="bg-white border border-green-100 rounded-lg p-4">
      <p className="font-medium text-green-700">
        {question}
      </p>
      <p className="text-sm text-gray-600 mt-1">
        {answer}
      </p>
    </div>
  )
}

function Topic({ label }: { label: string }) {
  return (
    <div className="bg-white border border-green-100 rounded-lg p-4 text-sm text-green-700">
      {label}
    </div>
  )
}
