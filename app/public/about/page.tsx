"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export default function AboutPage() {
  return (
    <main className="bg-background transition-colors duration-500">

      {/* ORIGIN STORY */}
      <section className="py-28 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          
          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <p className="uppercase tracking-widest text-[10px] font-black text-green-700 dark:text-green-500 mb-4">
              Our beginnings
            </p>

            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground mb-8 italic uppercase">
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

          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex justify-center md:justify-end"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556228578-8c89e6adf883"
                alt="Joyalure skincare origins"
                className="w-72 h-72 object-cover rounded-[2.5rem] shadow-2xl relative z-10 border dark:border-zinc-800"
              />
              <span className="absolute -bottom-5 -right-5 w-full h-full rounded-[2.5rem] border-2 border-green-200 dark:border-green-500/20" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CEO STORY */}
      <section className="py-28 px-4 bg-muted/50 dark:bg-zinc-900/50 transition-colors">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[220px_1fr] gap-14 items-start">
          
          {/* IMAGE */}
          <div className="flex justify-center md:justify-start">
            <div className="relative">
              <img
                src="/images/joy.png"
                alt="Founder and CEO of Joyalure"
                className="w-52 h-64 object-cover rounded-[2.5rem] shadow-2xl relative z-10 border dark:border-zinc-800"
              />
              <span className="absolute -bottom-4 -right-4 w-full h-full rounded-[2.5rem] border-2 border-green-200 dark:border-green-500/20" />
            </div>
          </div>

          {/* TEXT */}
          <div>
            <p className="uppercase tracking-widest text-[10px] font-black text-green-700 dark:text-green-500 mb-3">
              From our founder
            </p>

            <h2 className="text-4xl font-black tracking-tighter text-foreground mb-6 italic uppercase">
              Meet our CEO
            </h2>

            <div className="space-y-4 text-muted-foreground leading-relaxed max-w-2xl font-medium">
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

            <div className="mt-8 border-l-4 border-green-600 pl-6">
              <p className="text-xl md:text-2xl text-foreground font-black italic tracking-tight">
                “Skincare should never hurt to work.”
              </p>

              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2">
                Founder & CEO, Joyalure
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black tracking-tighter text-center text-foreground mb-16 italic uppercase">
            What we believe in
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { 
                title: "Gentle by design", 
                desc: "Our formulas work with your skin, not against it. No harsh chemicals. No unnecessary irritation." 
              },
              { 
                title: "Vegan and cruelty free", 
                desc: "Every product is made without animal derived ingredients and is never tested on animals." 
              },
              { 
                title: "Honest beauty", 
                desc: "We believe trust is built through transparency. What you see on our label is exactly what your skin receives." 
              }
            ].map((value, i) => (
              <div key={i} className="bg-card dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
                <h3 className="text-xl font-black italic uppercase tracking-tight mb-4 text-green-700 dark:text-green-500">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-24 px-4 bg-gradient-to-b from-background to-muted dark:to-zinc-900 transition-colors">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black tracking-tighter text-foreground mb-6 italic uppercase">
            Our mission
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">
            Our mission is to empower confidence through care. We create skincare
            that supports real skin, real lives, and real routines. Joyalure is
            not about perfection. It is about balance, intention, and feeling
            at home in your skin.
          </p>
        </div>
      </section>

    </main>
  )
}