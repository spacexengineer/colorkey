"use client";
import { ColorKeyDemo } from "@/components/color-key-demo";

export default function LandingPage() {
  return (
    <div className="bg-gray-950 text-gray-50 min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="absolute inset-0 -z-10 h-full w-full bg-gray-950 bg-[radial-gradient(#1d4ed8_1px,transparent_1px)] [background-size:32px_32px]" />

      <main className="flex-1 w-full">
        <section
          id="hero"
          className="container pt-12 pb-16 sm:pt-16 sm:pb-24 text-center"
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-gray-50 to-gray-400">
              The Future of Passwords
            </h2>
            <p className="mt-6 text-lg text-gray-300 sm:text-xl">
              Encrypted. Intelligent. Yours.
            </p>
            <p className="mt-4 text-sm text-gray-400 bg-gray-900/50 rounded-full px-4 py-2 inline-block border border-gray-800">
              It's like CAPTCHA, but for your password.
            </p>
          </div>
        </section>

        <section id="how-it-works" className="container pb-16 sm:pb-24">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h3>
            <p className="mt-4 text-gray-400">
              Use the same password, enter it differently every time
            </p>
            <p className="mt-4 text-gray-400">
              Your memory, our visualization - intuitive input - designed in a
              novel fashion to protect against all forms of surveillance.
            </p>
          </div>
          <div className="mt-12 flex justify-center">
            <ColorKeyDemo />
          </div>
        </section>

        <section id="hyperplanes" className="container pb-16 sm:pb-24">
          <div className="text-center max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold tracking-tight sm:text-4xl mb-8">
              Hyperplanes: Visual Security Matrix
            </h3>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4 text-left">
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                  <h4 className="text-xl font-semibold text-blue-400 mb-3">
                    What are Hyperplanes?
                  </h4>
                  <p className="text-gray-300 mb-4">
                    Hyperplanes are visual grids that present character options
                    in randomized quadrants. Each time you need to enter a
                    character, the system generates a unique layout.
                  </p>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>
                        Characters are randomly distributed across quadrants
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Layout changes after each selection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Makes screen recording attacks impossible</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                  <h4 className="text-xl font-semibold text-purple-400 mb-3">
                    Security Benefits
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center">
                        <span className="text-purple-400 font-bold text-sm">
                          16.8M
                        </span>
                      </div>
                      <span className="text-gray-300">
                        times more secure than traditional passwords
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-cyan-500/10 rounded-full flex items-center justify-center">
                        <span className="text-cyan-400 font-bold text-sm">
                          ∞
                        </span>
                      </div>
                      <span className="text-gray-300">
                        Protection against keyloggers and shoulder surfing
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                <h4 className="text-xl font-semibold text-cyan-400 mb-4 text-center">
                  Example Hyperplane Layout
                </h4>
                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                  <div className="aspect-square bg-gray-800 border border-gray-700 rounded-lg p-3">
                    <div className="grid grid-cols-3 gap-1 h-full">
                      <div className="bg-gray-700 rounded flex items-center justify-center text-xs font-mono">
                        A
                      </div>
                      <div className="bg-gray-700 rounded flex items-center justify-center text-xs font-mono">
                        7
                      </div>
                      <div className="bg-gray-700 rounded flex items-center justify-center text-xs font-mono">
                        !
                      </div>
                      <div className="bg-gray-700 rounded flex items-center justify-center text-xs font-mono">
                        x
                      </div>
                      <div className="bg-gray-700 rounded flex items-center justify-center text-xs font-mono">
                        M
                      </div>
                      <div className="bg-gray-700 rounded flex items-center justify-center text-xs font-mono">
                        9
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 text-center mt-2">
                      Quadrant 1
                    </div>
                  </div>
                  <div className="aspect-square bg-gray-800 border border-gray-700 rounded-lg p-3">
                    <div className="grid grid-cols-3 gap-1 h-full">
                      <div className="bg-gray-700 rounded flex items-center justify-center text-xs font-mono">
                        B
                      </div>
                      <div className="bg-gray-700 rounded flex items-center justify-center text-xs font-mono">
                        3
                      </div>
                      <div className="bg-gray-700 rounded flex items-center justify-center text-xs font-mono">
                        @
                      </div>
                      <div className="bg-gray-700 rounded flex items-center justify-center text-xs font-mono">
                        y
                      </div>
                      <div className="bg-gray-700 rounded flex items-center justify-center text-xs font-mono">
                        N
                      </div>
                      <div className="bg-gray-700 rounded flex items-center justify-center text-xs font-mono">
                        5
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 text-center mt-2">
                      Quadrant 2
                    </div>
                  </div>
                  <div className="aspect-square bg-gray-800 border border-gray-700 rounded-lg p-3">
                    <div className="grid grid-cols-3 gap-1 h-full">
                      <div className="bg-gray-700 rounded flex items-center justify-center text-xs font-mono">
                        C
                      </div>
                      <div className="bg-gray-700 rounded flex items-center justify-center text-xs font-mono">
                        4
                      </div>
                      <div className="bg-gray-700 rounded flex items-center justify-center text-xs font-mono">
                        #
                      </div>
                      <div className="bg-gray-700 rounded flex items-center justify-center text-xs font-mono">
                        z
                      </div>
                      <div className="bg-gray-700 rounded flex items-center justify-center text-xs font-mono">
                        O
                      </div>
                      <div className="bg-gray-700 rounded flex items-center justify-center text-xs font-mono">
                        8
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 text-center mt-2">
                      Quadrant 3
                    </div>
                  </div>
                  <div className="aspect-square bg-gray-800 border border-gray-700 rounded-lg p-3">
                    <div className="grid grid-cols-3 gap-1 h-full">
                      <div className="bg-gray-700 rounded flex items-center justify-center text-xs font-mono">
                        D
                      </div>
                      <div className="bg-gray-700 rounded flex items-center justify-center text-xs font-mono">
                        6
                      </div>
                      <div className="bg-gray-700 rounded flex items-center justify-center text-xs font-mono">
                        $
                      </div>
                      <div className="bg-gray-700 rounded flex items-center justify-center text-xs font-mono">
                        w
                      </div>
                      <div className="bg-gray-700 rounded flex items-center justify-center text-xs font-mono">
                        P
                      </div>
                      <div className="bg-gray-700 rounded flex items-center justify-center text-xs font-mono">
                        2
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 text-center mt-2">
                      Quadrant 4
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm text-center mt-4">
                  Each character of your password requires selecting the correct
                  quadrant from a randomized layout.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="metamask-integration" className="container pb-16 sm:pb-24">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
              MetaMask Integration
            </h3>
            <p className="text-gray-400 mb-8">
              Experience the future of wallet security with ColorKey's visual
              authentication system integrated with MetaMask.
            </p>
            <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-orange-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h4 className="text-orange-400 font-semibold">
                    Secure Wallet Creation & Access
                  </h4>
                  <p className="text-orange-300/80 text-sm">
                    Create and unlock your wallet using ColorKey's visual cipher
                    system
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                <a
                  href="/metamask"
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 4.26L12 9l-3.09-2.74L12 2zm0 14l3.09-4.26L12 9l-3.09 2.74L12 16z" />
                  </svg>
                  Try MetaMask Demo
                </a>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h4 className="text-blue-400 font-semibold mb-2">
                  Visual Authentication
                </h4>
                <p className="text-gray-400 text-sm">
                  Replace traditional password entry with secure visual
                  selection
                </p>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg
                    className="w-6 h-6 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h4 className="text-purple-400 font-semibold mb-2">
                  Enhanced Security
                </h4>
                <p className="text-gray-400 text-sm">
                  16.8M times more secure than traditional wallet passwords
                </p>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg
                    className="w-6 h-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h4 className="text-green-400 font-semibold mb-2">
                  Seamless Integration
                </h4>
                <p className="text-gray-400 text-sm">
                  Works with existing MetaMask workflows and transactions
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="text-center text-sm text-gray-400 pb-4">
        <p>
          &copy; {new Date().getFullYear()} ColorKey.ai Inc. All Rights
          Reserved.
        </p>
      </footer>
    </div>
  );
}
