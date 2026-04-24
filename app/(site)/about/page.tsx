"use client"

import { motion } from "framer-motion"
import { Leaf, Shield, Eye } from "lucide-react"
import type { ReactNode } from "react"

const ease = [0.22, 1, 0.36, 1] as const

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const values = [
  {
    icon: Leaf,
    accent: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "hover:border-green-300 dark:hover:border-green-700",
    title: "Gentle by design",
    desc: "Our formulas work with your skin, not against it. No harsh chemicals. No unnecessary irritation.",
  },
  {
    icon: Shield,
    accent: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "hover:border-emerald-300 dark:hover:border-emerald-700",
    title: "Vegan and cruelty free",
    desc: "Every product is made without animal derived ingredients and is never tested on animals.",
  },
  {
    icon: Eye,
    accent: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-50 dark:bg-teal-950/30",
    border: "hover:border-teal-300 dark:hover:border-teal-700",
    title: "Honest beauty",
    desc: "We believe trust is built through transparency. What you see on our label is exactly what your skin receives.",
  },
]

export default function AboutPage() {
  return (
    <main className="bg-background overflow-hidden transition-colors duration-500">

      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center text-center pt-36 pb-28 px-6 overflow-hidden">
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(22,163,74,0.08) 0%, transparent 70%)",
          }}
        />
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease }}
          className="absolute top-16 left-[10%] w-40 h-40 rounded-full border border-green-100 dark:border-green-900/30 -z-10"
        />
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease, delay: 0.1 }}
          className="absolute bottom-12 right-[8%] w-24 h-24 rounded-full bg-green-50 dark:bg-green-950/20 -z-10"
        />

        <FadeUp>
          <p className="uppercase tracking-[0.35em] text-[9px] font-black text-green-600 dark:text-green-400 mb-6">
            Our story
          </p>
        </FadeUp>

        <FadeUp delay={0.08}>
          <h1 className="text-[clamp(3rem,10vw,7.5rem)] font-black tracking-tighter leading-[0.88] text-foreground uppercase">
            Skin
            <span className="text-green-600">care</span>
            <br />
            you can trust
          </h1>
        </FadeUp>

        <FadeUp delay={0.18}>
          <div className="mt-10 w-14 h-[3px] bg-green-600 mx-auto" />
        </FadeUp>
      </section>

      {/* ORIGIN STORY */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.75, ease }}
          >
            <p className="uppercase tracking-widest text-[10px] font-black text-green-700 dark:text-green-500 mb-4">
              Our beginnings
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground mb-8 uppercase">
              Where it all started
            </h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed max-w-xl font-medium">
              <p>
                Joyalure was founded from a deeply personal journey. After years of
                struggling with products that promised results but delivered
                irritation, we realized something was missing in skincare.
              </p>
              <p>
                Too many formulas were aggressive. Too many brands prioritized
                trends over skin health. We believed there had to be a better way.
              </p>
              <p>
                So we set out to create skincare that is gentle, effective, and
                honest. Products that respect your skin barrier, your body, and
                the world around you.
              </p>
            </div>
          </motion.div>

          {/* Video */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.75, ease }}
            className="flex justify-center md:justify-end"
          >
            <div className="relative">
              <motion.video
                initial={{ scale: 0.92 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease }}
                autoPlay
                muted
                loop
                playsInline
                className="w-72 h-72 object-cover rounded-[2.5rem] shadow-2xl relative z-10 border dark:border-zinc-800"
              >
                <source src="/videos/about-video.MOV" type="video/quicktime" />
                <source src="/videos/about-video.MOV" type="video/mp4" />
                Your browser does not support the video tag.
              </motion.video>
              <span className="absolute -bottom-5 -right-5 w-full h-full rounded-[2.5rem] border-2 border-green-200 dark:border-green-500/20 z-0" />
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4, ease }}
                className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 border border-green-200 dark:border-green-800 z-20"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CEO STORY — dark section */}
      <section className="relative py-28 px-6 bg-zinc-950 text-white overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 30% 50%, rgba(22,163,74,0.06) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-5xl mx-auto grid md:grid-cols-[240px_1fr] gap-16 items-start relative z-10">

          {/* CEO Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease }}
            className="flex justify-center md:justify-start"
          >
            <div className="relative">
              <img
                src="/images/joy.png"
                alt="Founder and CEO of Joyalure"
                className="w-52 h-64 object-cover rounded-[2.5rem] shadow-2xl relative z-10 border border-zinc-800"
              />
              <span className="absolute -bottom-4 -right-4 w-full h-full rounded-[2.5rem] border-2 border-green-500/30 z-0" />
            </div>
          </motion.div>

          {/* CEO Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
          >
            <p className="uppercase tracking-widest text-[10px] font-black text-green-400 mb-3">
              From our founder
            </p>
            <h2 className="text-4xl font-black tracking-tighter text-white mb-6 uppercase">
              Meet our CEO
            </h2>
            <div className="space-y-4 text-zinc-400 leading-relaxed max-w-2xl font-medium">
              <p>
                Joyalure is led by a belief that skincare should feel like self
                respect, not self correction. Our CEO founded the brand with a
                commitment to transparency, integrity, and long term skin health.
              </p>
              <p>
                Every formula is developed with intention. Every ingredient is
                chosen for a reason. And every product is designed to support,
                not overwhelm, your skin.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease, delay: 0.3 }}
              className="mt-10 border-l-4 border-green-500 pl-6"
            >
              <p className="text-xl md:text-2xl text-white font-black tracking-tight">
                &ldquo;Skincare should never hurt to work.&rdquo;
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-2">
                Founder &amp; CEO, Joyalure
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl font-black tracking-tighter text-foreground uppercase">
              What we believe in
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.65, ease, delay: i * 0.1 }}
              >
                <div
                  className={`bg-card dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 ${v.border} rounded-md p-8 shadow-sm h-full group hover:shadow-md transition-all duration-300`}
                >
                  <div className={`w-12 h-12 ${v.bg} ${v.accent} rounded-md flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <v.icon size={22} strokeWidth={1.5} />
                  </div>
                  <h3 className={`text-xl font-black uppercase tracking-tight mb-4 ${v.accent}`}>
                    {v.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">
                    {v.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-background to-background dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-950 -z-10" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-green-100/60 dark:bg-green-900/10 rounded-full blur-3xl -z-10" />
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-green-50 dark:bg-green-950/20 rounded-full blur-2xl -z-10" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeUp>
            <p className="uppercase tracking-[0.3em] text-[9px] font-black text-green-600 dark:text-green-400 mb-4">
              Our mission
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground mb-10 uppercase">
              Our mission
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium max-w-3xl mx-auto">
              Our mission is to empower confidence through care. We create skincare
              that supports real skin, real lives, and real routines. Joyalure is
              not about perfection. It is about balance, intention, and feeling
              at home in your skin.
            </p>
          </FadeUp>
          <FadeUp delay={0.35}>
            <div className="mt-12 flex items-center justify-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-600 opacity-40" />
              <div className="w-3 h-3 rounded-full bg-green-600 opacity-70" />
              <div className="w-2 h-2 rounded-full bg-green-600 opacity-40" />
            </div>
          </FadeUp>
        </div>
      </section>

    </main>
  )
}
