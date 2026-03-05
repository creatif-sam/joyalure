"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronDown, Search } from "lucide-react"

const faqs = [
  {
    category: "Orders & Shipping",
    questions: [
      {
        question: "How long does shipping take?",
        answer: "Standard shipping within the US takes 5-7 business days. Express shipping takes 2-3 business days, and overnight shipping delivers within 1 business day. International shipping varies by location (7-28 business days)."
      },
      {
        question: "Do you offer free shipping?",
        answer: "Yes! We offer free standard shipping on all orders over $50 within the United States. International orders have varying shipping costs based on destination."
      },
      {
        question: "How can I track my order?",
        answer: "Once your order ships, you'll receive a confirmation email with a tracking number. You can also track your order by logging into your account and viewing your order history."
      },
      {
        question: "Can I change or cancel my order?",
        answer: "Orders can be modified or cancelled within 2 hours of placement. After that, they enter our processing system. Please contact us immediately if you need to make changes."
      }
    ]
  },
  {
    category: "Returns & Refunds",
    questions: [
      {
        question: "What is your return policy?",
        answer: "We offer a 30-day return policy for unused, unopened items in their original packaging. Due to hygiene reasons, opened skincare products cannot be returned unless defective or damaged."
      },
      {
        question: "How do I start a return?",
        answer: "Contact our customer service at returns@joyalure.com with your order number. We'll send you a prepaid return label and instructions. Once we receive and inspect your return, we'll process your refund within 5-7 business days."
      },
      {
        question: "Do you offer exchanges?",
        answer: "We currently replace items only if they are defective or damaged. For other exchanges, we recommend returning the item for a refund and placing a new order."
      }
    ]
  },
  {
    category: "Products",
    questions: [
      {
        question: "Are your products cruelty-free?",
        answer: "Yes! All Joyalure products are 100% cruelty-free. We never test on animals and work only with suppliers who share our ethical values."
      },
      {
        question: "Are your products suitable for sensitive skin?",
        answer: "Many of our products are formulated for sensitive skin. Check individual product descriptions for specific information. We always recommend doing a patch test before full application."
      },
      {
        question: "How should I store my skincare products?",
        answer: "Store products in a cool, dry place away from direct sunlight. Unless specified otherwise, room temperature storage is ideal. Always close lids tightly after use to maintain product integrity."
      },
      {
        question: "What if I have an allergic reaction?",
        answer: "Discontinue use immediately and consult a healthcare professional. Please report the reaction to us at support@joyalure.com so we can better understand and improve our products."
      }
    ]
  },
  {
    category: "Account & Payment",
    questions: [
      {
        question: "Do I need an account to place an order?",
        answer: "No, you can checkout as a guest. However, creating an account allows you to track orders, save favorites, and receive exclusive offers."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, and Google Pay."
      },
      {
        question: "Is my payment information secure?",
        answer: "Absolutely. We use industry-standard SSL encryption to protect your payment information. We never store your complete credit card details on our servers."
      },
      {
        question: "How do I reset my password?",
        answer: "Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a password reset link."
      }
    ]
  }
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50/30 to-green-100/50 dark:from-zinc-950 dark:via-zinc-900/50 dark:to-zinc-900">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-green-700 dark:from-green-800 dark:to-green-900 text-white py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-green-400/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="relative max-w-4xl mx-auto px-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-all mb-6 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            Frequently Asked Questions
          </h1>
          <p className="text-green-100 text-lg animate-fade-in-delay">
            Find answers to common questions about our products and services
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Search Bar */}
        <div className="mb-12 animate-slide-up">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-xl border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 focus:border-green-500 dark:focus:border-green-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800">
              <p className="text-gray-600 dark:text-zinc-400">No matching questions found. Try a different search term.</p>
            </div>
          ) : (
            filteredFaqs.map((category, categoryIndex) => (
              <div
                key={category.category}
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${categoryIndex * 0.1}s`, animationFillMode: "forwards" }}
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 mb-6 flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-green-600 rounded-full"></span>
                  {category.category}
                </h2>
                
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => {
                    const itemId = `${category.category}-${faqIndex}`
                    const isOpen = openItems.includes(itemId)
                    
                    return (
                      <div
                        key={itemId}
                        className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden transition-all hover:shadow-md"
                      >
                        <button
                          onClick={() => toggleItem(itemId)}
                          className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors hover:bg-green-50/50 dark:hover:bg-zinc-800/50"
                        >
                          <span className="font-semibold text-gray-900 dark:text-zinc-100 pr-4">
                            {faq.question}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 transition-transform duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        
                        <div
                          className={`transition-all duration-300 ease-in-out ${
                            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                          } overflow-hidden`}
                        >
                          <div className="px-6 pb-5 text-gray-700 dark:text-zinc-300 leading-relaxed border-t border-gray-100 dark:border-zinc-800 pt-4">
                            {faq.answer}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Still Need Help Section */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-800 dark:to-green-900 rounded-2xl p-8 md:p-12 text-white text-center opacity-0 animate-fade-in-up" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-green-100 mb-6">
            Our customer service team is here to help you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-colors"
            >
              Contact Us
            </Link>
            <a
              href="mailto:support@joyalure.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-green-700/50 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors border border-white/20"
            >
              Email Support
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-delay {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 0.8s ease-out 0.3s both;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .bg-grid-pattern {
          background-image: linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  )
}
