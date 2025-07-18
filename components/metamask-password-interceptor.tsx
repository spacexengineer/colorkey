"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Shield,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Info,
  Loader2,
  Eye,
  EyeOff,
  Zap,
  Code,
  Chrome
} from "lucide-react"
import { ColorKeyDemo } from "./color-key-demo"
import { cn } from "@/lib/utils"

interface MetaMaskPasswordProps {
  onPasswordSubmit?: (password: string) => void
  isIntercepted?: boolean
}

// Simulated MetaMask password input component
function MetaMaskPasswordInput({ onPasswordSubmit, isIntercepted }: MetaMaskPasswordProps) {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!password) return
    
    setIsSubmitting(true)
    
    // Simulate MetaMask unlock process
    setTimeout(() => {
      setIsSubmitting(false)
      if (onPasswordSubmit) {
        onPasswordSubmit(password)
      }
    }, 1500)
  }

  return (
    <Card className="bg-white text-gray-900 w-full max-w-sm mx-auto shadow-xl border-0">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.9,8.9l-1.1-4.1l-2.6,1.8l-3.1-2.4l-3.1,2.5l-3.1-2.5L5.8,6.7L3.2,4.9L2.1,8.9l2.3,1.3l-0.6,2.4L6,13.7v2.4l3.1,2.2V16l3,1.7l3-1.7v2.3l3.1-2.2v-2.4l2.2-1.1l-0.6-2.4L21.9,8.9z"/>
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-600">Ethereum Mainnet</span>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 border-2 border-blue-500 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isIntercepted}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          {isIntercepted && (
            <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-purple-700 font-medium">
                  ColorKey Intercepted
                </span>
              </div>
              <p className="text-xs text-purple-600 mt-1">
                Password input is now handled by ColorKey visual authentication
              </p>
            </div>
          )}
        </div>
        
        <Button
          onClick={handleSubmit}
          disabled={(!password && !isIntercepted) || isSubmitting}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Unlocking...
            </>
          ) : (
            "Unlock"
          )}
        </Button>
        
        <div className="text-center">
          <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
            Forgot password?
          </button>
        </div>
      </CardContent>
      
      <CardFooter className="text-center pt-0">
        <p className="text-xs text-gray-500">
          Need help? Contact <span className="text-purple-600">MetaMask support</span>
        </p>
      </CardFooter>
    </Card>
  )
}

export function MetaMaskPasswordInterceptor() {
  const [currentStep, setCurrentStep] = useState<'setup' | 'metamask' | 'intercept' | 'colorkey' | 'complete'>('setup')
  const [isIntercepted, setIsIntercepted] = useState(false)
  const [colorKeyPassword, setColorKeyPassword] = useState("")
  const [showArchitecture, setShowArchitecture] = useState(false)
  const [isTransmitting, setIsTransmitting] = useState(false)

  const startInterception = () => {
    setCurrentStep('metamask')
  }

  const enableInterception = () => {
    setIsIntercepted(true)
    setCurrentStep('intercept')
    
    // Simulate detecting MetaMask password input
    setTimeout(() => {
      setCurrentStep('colorkey')
    }, 2000)
  }

  const handleColorKeyComplete = (password: string) => {
    setColorKeyPassword(password)
    setIsTransmitting(true)
    
    // Simulate transmitting password to MetaMask
    setTimeout(() => {
      setIsTransmitting(false)
      setCurrentStep('complete')
    }, 2000)
  }

  const handleMetaMaskPasswordSubmit = (password: string) => {
    // This would be intercepted in the real implementation
    console.log('MetaMask password submitted:', password)
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <AnimatePresence mode="wait">
        {currentStep === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-lg">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="p-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full">
                      <Shield className="w-12 h-12 text-purple-400" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 p-2 bg-orange-500/20 rounded-full border-2 border-gray-900">
                      <svg className="w-6 h-6 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21.9,8.9l-1.1-4.1l-2.6,1.8l-3.1-2.4l-3.1,2.5l-3.1-2.5L5.8,6.7L3.2,4.9L2.1,8.9l2.3,1.3l-0.6,2.4L6,13.7v2.4l3.1,2.2V16l3,1.7l3-1.7v2.3l3.1-2.2v-2.4l2.2-1.1l-0.6-2.4L21.9,8.9z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white">Password Input Interception</h2>
                <p className="text-gray-400 mt-2">
                  Replace MetaMask's password input with ColorKey visual authentication
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-purple-300 mb-4">🔄 Complete Input Replacement</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-400 font-bold text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">DOM Injection</h4>
                        <p className="text-gray-400 text-sm mt-1">
                          Browser extension detects MetaMask password input fields
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-400 font-bold text-sm">2</span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Input Replacement</h4>
                        <p className="text-gray-400 text-sm mt-1">
                          Replace password field with "Launch ColorKey" button
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-400 font-bold text-sm">3</span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Password Transmission</h4>
                        <p className="text-gray-400 text-sm mt-1">
                          ColorKey securely transmits password to MetaMask input
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Chrome className="w-5 h-5 text-blue-400" />
                      <h4 className="text-blue-300 font-medium">Browser Extension</h4>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li>• Detects MetaMask DOM elements</li>
                      <li>• Injects ColorKey interface</li>
                      <li>• Handles secure communication</li>
                      <li>• Works across all websites</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Code className="w-5 h-5 text-green-400" />
                      <h4 className="text-green-300 font-medium">Technical Implementation</h4>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li>• Content script injection</li>
                      <li>• MutationObserver for DOM changes</li>
                      <li>• Secure message passing</li>
                      <li>• Password encryption in transit</li>
                    </ul>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowArchitecture(!showArchitecture)}
                  className="w-full text-center text-sm text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showArchitecture ? 'Hide' : 'Show'} Code Architecture
                </button>
              </CardContent>
              
              <AnimatePresence>
                {showArchitecture && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-800"
                  >
                    <CardContent className="pt-6">
                      <div className="bg-gray-900/80 rounded-lg p-4 font-mono text-sm">
                        <div className="text-green-400 mb-2">// Browser Extension Content Script</div>
                        <div className="text-gray-300 space-y-1">
                          <div><span className="text-blue-400">const</span> observer = <span className="text-purple-400">new</span> <span className="text-yellow-400">MutationObserver</span>(() => {'{'}</div>
                          <div className="ml-4"><span className="text-blue-400">const</span> passwordInput = document.<span className="text-yellow-400">querySelector</span>(</div>
                          <div className="ml-8 text-orange-400">'input[type="password"][placeholder*="password"]'</div>
                          <div className="ml-4">)</div>
                          <div className="ml-4"><span className="text-purple-400">if</span> (passwordInput && isMetaMaskContext()) {'{'}</div>
                          <div className="ml-8"><span className="text-yellow-400">replaceWithColorKey</span>(passwordInput)</div>
                          <div className="ml-4">{'}'}</div>
                          <div>{'}'});</div>
                          <div className="mt-3 text-green-400">// Replace input with ColorKey launcher</div>
                          <div><span className="text-blue-400">function</span> <span className="text-yellow-400">replaceWithColorKey</span>(input) {'{'}</div>
                          <div className="ml-4"><span className="text-blue-400">const</span> colorKeyBtn = <span className="text-yellow-400">createColorKeyButton</span>()</div>
                          <div className="ml-4">input.<span className="text-yellow-400">replaceWith</span>(colorKeyBtn)</div>
                          <div>{'}'}</div>
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <CardFooter>
                <Button
                  onClick={startInterception}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                  size="lg"
                >
                  Start Demo: Intercept MetaMask Password
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
        
        {currentStep === 'metamask' && (
          <motion.div
            key="metamask"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-lg max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <h2 className="text-xl font-bold text-white">
                  Step 1: Normal MetaMask Password Screen
                </h2>
                <p className="text-gray-400 text-sm mt-2">
                  This is what users normally see. Click "Enable Interception" to see the magic happen.
                </p>
              </CardHeader>
              
              <CardContent className="flex justify-center">
                <MetaMaskPasswordInput 
                  onPasswordSubmit={handleMetaMaskPasswordSubmit}
                  isIntercepted={isIntercepted}
                />
              </CardContent>
              
              <CardFooter>
                <Button
                  onClick={enableInterception}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                  size="lg"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Enable ColorKey Interception
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
        
        {currentStep === 'intercept' && (
          <motion.div
            key="intercept"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-lg max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-purple-500/10 rounded-full">
                    <Zap className="w-8 h-8 text-purple-400 animate-pulse" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white">
                  Step 2: Password Input Intercepted
                </h2>
                <p className="text-gray-400 text-sm mt-2">
                  ColorKey extension has detected and modified the password input
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <MetaMaskPasswordInput 
                    onPasswordSubmit={handleMetaMaskPasswordSubmit}
                    isIntercepted={true}
                  />
                </div>
                
                <Alert className="max-w-md mx-auto bg-purple-900/20 border-purple-500/30">
                  <Info className="h-4 w-4 text-purple-400" />
                  <AlertDescription className="text-purple-200">
                    Notice how the password input is now disabled and shows "ColorKey Intercepted". 
                    The extension has taken control of the authentication flow.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {currentStep === 'colorkey' && (
          <motion.div
            key="colorkey"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-lg">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-full">
                    <Shield className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white">
                  Step 3: ColorKey Visual Authentication
                </h2>
                <p className="text-gray-400 text-sm mt-2">
                  Instead of typing a password, use visual authentication
                </p>
              </CardHeader>
            </Card>
            
            <ColorKeyDemo 
              onComplete={handleColorKeyComplete}
              mode="unlock"
              hideDemo={true}
            />
            
            {isTransmitting && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                        <svg className="w-6 h-6 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21.9,8.9l-1.1-4.1l-2.6,1.8l-3.1-2.4l-3.1,2.5l-3.1-2.5L5.8,6.7L3.2,4.9L2.1,8.9l2.3,1.3l-0.6,2.4L6,13.7v2.4l3.1,2.2V16l3,1.7l3-1.7v2.3l3.1-2.2v-2.4l2.2-1.1l-0.6-2.4L21.9,8.9z"/>
                        </svg>
                      </div>
                      <p className="text-gray-300">Transmitting password to MetaMask...</p>
                      <p className="text-gray-500 text-xs">Encrypted • Secure • Zero-knowledge</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        )}
        
        {currentStep === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-lg max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <motion.div 
                  className="flex justify-center mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="p-4 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full">
                    <CheckCircle2 className="w-12 h-12 text-green-400" />
                  </div>
                </motion.div>
                <h2 className="text-2xl font-bold text-white">
                  Password Transmitted Successfully!
                </h2>
                <p className="text-gray-400 mt-2">
                  MetaMask received the password and unlocked the wallet
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/20 rounded-lg p-6">
                  <h3 className="text-green-300 font-medium mb-4">✅ What Just Happened</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">ColorKey generated secure password from visual input</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">Password encrypted and transmitted to MetaMask</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">MetaMask unlocked without manual typing</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">User never exposed to keyloggers or shoulder surfing</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <h4 className="text-purple-300 font-medium mb-2">🔧 Production Implementation</h4>
                  <p className="text-gray-400 text-sm mb-3">
                    This approach would work as a browser extension that:
                  </p>
                  <ul className="space-y-1 text-sm text-gray-400">
                    <li>• Monitors for MetaMask password inputs</li>
                    <li>• Replaces them with ColorKey launchers</li>
                    <li>• Securely transmits generated passwords</li>
                    <li>• Works across all dApps and websites</li>
                  </ul>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button
                  onClick={() => setCurrentStep('setup')}
                  variant="outline"
                  className="w-full border-gray-700 hover:bg-gray-800"
                >
                  Try Again
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}