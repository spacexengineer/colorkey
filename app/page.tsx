"use client"
import { ColorKeyDemo } from "@/components/color-key-demo"

export default function LandingPage() {
  return (
    <div className="bg-gray-950 text-gray-50 min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="absolute inset-0 -z-10 h-full w-full bg-gray-950 bg-[radial-gradient(#1d4ed8_1px,transparent_1px)] [background-size:32px_32px]" />

      <header className="w-full text-center py-6">
        <h1 className="text-xl font-semibold text-gray-400">ColorKey.ai</h1>
      </header>

      <main className="flex-1 w-full">
        <section id="hero" className="container pt-12 pb-16 sm:pt-16 sm:pb-24 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-gray-50 to-gray-400">
              The Future of Passwords
            </h2>
            <p className="mt-6 text-lg text-gray-300 sm:text-xl">Encrypted. Intelligent. Yours.</p>
            <p className="mt-4 text-sm text-gray-400 bg-gray-900/50 rounded-full px-4 py-2 inline-block border border-gray-800">
              It’s like CAPTCHA, but for your password.
            </p>
          </div>
        </section>

        <section id="how-it-works" className="container pb-16 sm:pb-24">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h3>
            <p className="mt-4 text-gray-400">
              Use your memory and visualization to intuitively select the correct character. This process makes it
              nearly impossible to brute-force or steal your password.
            </p>
          </div>
          <div className="mt-12 flex justify-center">
            <ColorKeyDemo />
          </div>
        </section>
      </main>

      <footer className="text-center text-sm text-gray-400 pb-4">
        <p>&copy; {new Date().getFullYear()} ColorKey.ai Inc. All Rights Reserved.</p>
      </footer>
    </div>
  )
}
