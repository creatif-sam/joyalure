"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, AlertTriangle, Phone, Mail, FileText, Heart } from "lucide-react"

export default function AdverseEventsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    product: "",
    purchaseDate: "",
    reaction: "",
    symptoms: "",
    severity: "mild",
    medicalAttention: "no"
  })

  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit to backend
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: "",
        email: "",
        phone: "",
        product: "",
        purchaseDate: "",
        reaction: "",
        symptoms: "",
        severity: "mild",
        medicalAttention: "no"
      })
    }, 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

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
            Report Adverse Events
          </h1>
          <p className="text-green-100 text-lg animate-fade-in-delay">
            Your safety is our top priority. Report any adverse reactions here.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        
        {/* Important Notice */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-12 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
          <div className="flex gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h2 className="font-bold text-amber-900 dark:text-amber-200 text-lg">
                Medical Emergency?
              </h2>
              <p className="text-amber-800 dark:text-amber-300">
                If you are experiencing a serious adverse reaction, please seek immediate medical attention by calling 911 or your local emergency services. Report the incident to us afterward using this form or by contacting our safety team.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800 overflow-hidden animate-slide-up">
          <div className="p-8 md:p-12">
            
            <section className="space-y-4 mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <Heart className="w-7 h-7 text-green-600 dark:text-green-400" />
                What is an Adverse Event?
              </h2>
              <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                An adverse event is any undesirable experience associated with the use of our products. This includes skin reactions, allergic responses, irritation, or any other unexpected effects. We take all reports seriously and use them to improve product safety.
              </p>
            </section>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block font-semibold text-gray-900 dark:text-zinc-100">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 focus:border-green-500 dark:focus:border-green-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block font-semibold text-gray-900 dark:text-zinc-100">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 focus:border-green-500 dark:focus:border-green-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block font-semibold text-gray-900 dark:text-zinc-100">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 focus:border-green-500 dark:focus:border-green-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="product" className="block font-semibold text-gray-900 dark:text-zinc-100">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      id="product"
                      name="product"
                      value={formData.product}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Radiant Glow Serum"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 focus:border-green-500 dark:focus:border-green-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="purchaseDate" className="block font-semibold text-gray-900 dark:text-zinc-100">
                    Date of Purchase
                  </label>
                  <input
                    type="date"
                    id="purchaseDate"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 focus:border-green-500 dark:focus:border-green-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="reaction" className="block font-semibold text-gray-900 dark:text-zinc-100">
                    Date of Reaction *
                  </label>
                  <input
                    type="date"
                    id="reaction"
                    name="reaction"
                    value={formData.reaction}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 focus:border-green-500 dark:focus:border-green-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="symptoms" className="block font-semibold text-gray-900 dark:text-zinc-100">
                    Describe the Symptoms *
                  </label>
                  <textarea
                    id="symptoms"
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Please describe the adverse reaction in detail, including when it started, where it occurred, and any other relevant information..."
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 focus:border-green-500 dark:focus:border-green-500 focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="severity" className="block font-semibold text-gray-900 dark:text-zinc-100">
                      Severity Level *
                    </label>
                    <select
                      id="severity"
                      name="severity"
                      value={formData.severity}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 focus:border-green-500 dark:focus:border-green-500 focus:outline-none transition-colors"
                    >
                      <option value="mild">Mild (Minor discomfort)</option>
                      <option value="moderate">Moderate (Noticeable symptoms)</option>
                      <option value="severe">Severe (Significant impact)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="medicalAttention" className="block font-semibold text-gray-900 dark:text-zinc-100">
                      Medical Attention Sought? *
                    </label>
                    <select
                      id="medicalAttention"
                      name="medicalAttention"
                      value={formData.medicalAttention}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 focus:border-green-500 dark:focus:border-green-500 focus:outline-none transition-colors"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-green-600 hover:bg-green-700 dark:hover:bg-green-500 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
                  >
                    Submit Report
                  </button>
                  <p className="text-sm text-gray-600 dark:text-zinc-400 text-center mt-4">
                    All information will be kept confidential and used solely for safety monitoring purposes.
                  </p>
                </div>

              </form>
            ) : (
              <div className="text-center py-12 animate-fade-in">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 mb-4">
                  Report Submitted
                </h2>
                <p className="text-gray-700 dark:text-zinc-300 text-lg mb-2">
                  Thank you for reporting this adverse event.
                </p>
                <p className="text-gray-600 dark:text-zinc-400">
                  Our safety team will review your report and may contact you for additional information.
                </p>
              </div>
            )}

          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-800 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-zinc-100 mb-2">Call Us</h3>
                <p className="text-gray-700 dark:text-zinc-300 mb-1">Safety Hotline</p>
                <p className="text-green-700 dark:text-green-400 font-semibold">1-800-JOYALURE</p>
                <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">Available 24/7</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-800 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-zinc-100 mb-2">Email Us</h3>
                <p className="text-gray-700 dark:text-zinc-300 mb-1">Product Safety Team</p>
                <p className="text-green-700 dark:text-green-400 font-semibold">safety@joyalure.com</p>
                <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">Response within 24 hours</p>
              </div>
            </div>
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
