import Navigation from "@/components/navigation/Navigation"
import { SignUpForm } from "@/components/sign-up-form"
import Footer from "@/components/Footer"

export default function Page() {
  return (
    <>
      <Navigation />

      <main className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center pt-6 pb-10">
            <div className="w-full max-w-md">
              <SignUpForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
