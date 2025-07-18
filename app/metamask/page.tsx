"use client"
import { useState } from "react"
import { MetaMaskWallet } from "@/components/metamask-wallet"
import { MetaMaskRealIntegration } from "@/components/metamask-real-integration"
import { MetaMaskColorKeyBridge } from "@/components/metamask-colorkey-bridge"
import { MetaMaskPasswordInterceptor } from "@/components/metamask-password-interceptor"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, TestTube, Wallet } from "lucide-react"

export default function MetaMaskPage() {
  const [activeTab, setActiveTab] = useState("demo")

  return (
    <div className="bg-gray-950 text-gray-50 min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="absolute inset-0 -z-10 h-full w-full bg-gray-950 bg-[radial-gradient(#ff6b00_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
      
      <main className="flex-1 w-full max-w-6xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">MetaMask + ColorKey Integration</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience the future of wallet security with ColorKey's visual authentication system. 
            Try our demo or connect your real MetaMask wallet.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 bg-gray-800/50">
            <TabsTrigger value="demo" className="data-[state=active]:bg-orange-500/20">
              <TestTube className="w-4 h-4 mr-2" />
              Demo
            </TabsTrigger>
            <TabsTrigger value="intercept" className="data-[state=active]:bg-orange-500/20">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Intercept
            </TabsTrigger>
            <TabsTrigger value="bridge" className="data-[state=active]:bg-orange-500/20">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Bridge
            </TabsTrigger>
            <TabsTrigger value="real" className="data-[state=active]:bg-orange-500/20">
              <Wallet className="w-4 h-4 mr-2" />
              Real
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="demo" className="space-y-6">
              <Alert className="max-w-2xl mx-auto bg-blue-900/20 border-blue-500/30">
                <Info className="h-4 w-4 text-blue-400" />
                <AlertDescription className="text-blue-200">
                  This is a demo mode that simulates MetaMask functionality. No real wallet connection is made.
                  Perfect for testing the ColorKey authentication flow without needing MetaMask installed.
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-center">
                <MetaMaskWallet />
              </div>
            </TabsContent>

            <TabsContent value="intercept" className="space-y-6">
              <Alert className="max-w-2xl mx-auto bg-red-900/20 border-red-500/30">
                <Info className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-200">
                  <strong>Direct Password Interception:</strong> This shows how ColorKey could completely replace 
                  MetaMask's password input by intercepting and modifying the DOM in real-time.
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-center">
                <MetaMaskPasswordInterceptor />
              </div>
            </TabsContent>

            <TabsContent value="bridge" className="space-y-6">
              <Alert className="max-w-2xl mx-auto bg-purple-900/20 border-purple-500/30">
                <Info className="h-4 w-4 text-purple-400" />
                <AlertDescription className="text-purple-200">
                  This demonstrates how ColorKey could integrate with MetaMask's password screen. 
                  It shows a pre-authentication flow that would work as a MetaMask Snap or browser extension.
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-center">
                <MetaMaskColorKeyBridge />
              </div>
            </TabsContent>

            <TabsContent value="real" className="space-y-6">
              <Alert className="max-w-2xl mx-auto bg-orange-900/20 border-orange-500/30">
                <Info className="h-4 w-4 text-orange-400" />
                <AlertDescription className="text-orange-200">
                  Connect your real MetaMask wallet to experience ColorKey authentication. 
                  This creates a secure pairing between your wallet address and ColorKey password.
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-center">
                <MetaMaskRealIntegration />
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <Card className="mt-12 max-w-3xl mx-auto bg-gray-900/50 border-gray-800">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">How ColorKey + MetaMask Works</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-800/30 rounded-lg p-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-blue-400 font-bold">1</span>
                </div>
                <h4 className="font-medium text-gray-300 mb-2">Connect Wallet</h4>
                <p className="text-sm text-gray-400">
                  Connect your MetaMask wallet using the standard Web3 flow
                </p>
              </div>
              <div className="bg-gray-800/30 rounded-lg p-4">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-purple-400 font-bold">2</span>
                </div>
                <h4 className="font-medium text-gray-300 mb-2">Create ColorKey</h4>
                <p className="text-sm text-gray-400">
                  Set up your visual password using the hyperplan selection system
                </p>
              </div>
              <div className="bg-gray-800/30 rounded-lg p-4">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-green-400 font-bold">3</span>
                </div>
                <h4 className="font-medium text-gray-300 mb-2">Secure Access</h4>
                <p className="text-sm text-gray-400">
                  Your wallet is now protected with 16.8M times stronger security
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/10 to-blue-900/10 border border-purple-500/20 rounded-lg">
              <h4 className="font-medium text-purple-300 mb-2">🔐 Address-Based Security</h4>
              <p className="text-sm text-gray-400">
                Your wallet address serves as the unique identifier, paired with your ColorKey password. 
                This creates a two-factor authentication system where knowing the address alone isn't enough - 
                you must also complete the visual authentication process.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <footer className="text-center text-sm text-gray-400 pb-4">
        <p>&copy; {new Date().getFullYear()} ColorKey - Visual Authentication for Web3</p>
      </footer>
    </div>
  )
}