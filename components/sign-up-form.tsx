"use client"

import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`
        }
      })

      if (error) throw error
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={cn(
        "flex justify-center items-center min-h-screen bg-background transition-colors duration-500",
        className
      )}
      {...props}
    >
      <Card className="w-full max-w-md border-zinc-200 dark:border-zinc-800 bg-card shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="space-y-1 text-center pb-8 pt-10">
          <CardTitle className="text-2xl md:text-3xl font-black tracking-tighter text-green-700 dark:text-green-500 uppercase italic">
            Create Account
          </CardTitle>
          <CardDescription className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest">
            Join Joyalure and start shopping
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-5 pb-8">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl py-6 focus-visible:ring-green-600 focus-visible:ring-offset-0"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl py-6 pr-12 focus-visible:ring-green-600 focus-visible:ring-offset-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground hover:text-green-700 dark:hover:text-green-400 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="repeat-password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Confirm password
              </Label>
              <div className="relative">
                <Input
                  id="repeat-password"
                  type={showRepeatPassword ? "text" : "password"}
                  required
                  value={repeatPassword}
                  onChange={e => setRepeatPassword(e.target.value)}
                  className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl py-6 pr-12 focus-visible:ring-green-600 focus-visible:ring-offset-0"
                />
                <button
                  type="button"
                  onClick={() => setShowRepeatPassword(v => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground hover:text-green-700 dark:hover:text-green-400 transition-colors"
                  aria-label="Toggle confirm password visibility"
                >
                  {showRepeatPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-4 py-3 rounded-xl border border-red-100 dark:border-red-500/20">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-green-700/20 active:scale-95 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Syncing Identity...
                </>
              ) : "Create account"}
            </Button>

            <div className="text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground pt-2">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-green-700 dark:text-green-500 hover:underline underline-offset-4"
              >
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}