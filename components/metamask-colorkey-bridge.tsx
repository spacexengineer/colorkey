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
  Chrome,
  Puzzle
} from "lucide-react"
import { ColorKeyDemo } from "./color-key-demo"
import { cn } from "@/lib/utils"

export function MetaMaskColorKeyBridge() {
  const [currentStep, setCurrentStep] = useState<'intro' | 'colorkey' | 'metamask' | 'complete'>('intro')
  const [isColorKeyVerified, setIsColorKeyVerified] = useState(false)
  const [colorKeyPassword, setColorKeyPassword] = useState("")
  const [showArchitecture, setShowArchitecture] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleColorKeyComplete = (password: string) => {
    setColorKeyPassword(password)
    setIsProcessing(true)
    
    // Simulate verification
    setTimeout(() => {
      setIsColorKeyVerified(true)
      setIsProcessing(false)
      setCurrentStep('metamask')
      
      // In a real implementation, this would:
      // 1. Verify the ColorKey password
      // 2. Decrypt stored MetaMask credentials
      // 3. Auto-fill or pass to MetaMask
    }, 1500)
  }

  const handleStartColorKey = () => {
    setCurrentStep('colorkey')
  }

  const proceedToMetaMask = () => {
    // In production, this would trigger MetaMask unlock
    // with pre-filled credentials or through a Snap
    setCurrentStep('complete')
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <AnimatePresence mode="wait">
        {currentStep === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-lg">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full">
                      <Shield className="w-12 h-12 text-blue-400" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 p-2 bg-orange-500/20 rounded-full border-2 border-gray-900">
                      <svg className="w-6 h-6 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21.9,8.9l-1.1-4.1l-2.6,1.8l-3.1-2.4l-3.1,2.5l-3.1-2.5L5.8,6.7L3.2,4.9L2.1,8.9l2.3,1.3l-0.6,2.4L6,13.7v2.4l3.1,2.2V16l3,1.7l3-1.7v2.3l3.1-2.2v-2.4l2.2-1.1l-0.6-2.4L21.9,8.9z M6,10.2l1.3,0.7L6,11.8V10.2z M12,14.5L9.9,13v-1.8l2.1,1.1l2.1-1.1V13L12,14.5z M18,11.8l-1.3-0.8l1.3-0.7V11.8z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white">ColorKey + MetaMask Integration</h2>
                <p className="text-gray-400 mt-2">
                  Secure your MetaMask wallet with visual authentication
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-300 mb-4">How It Works</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-400 font-bold text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">ColorKey Authentication</h4>
                        <p className="text-gray-400 text-sm mt-1">
                          First, verify your identity using ColorKey's visual password system
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-400 font-bold text-sm">2</span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Secure Bridge</h4>
                        <p className="text-gray-400 text-sm mt-1">
                          ColorKey securely decrypts and passes credentials to MetaMask
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-400 font-bold text-sm">3</span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">MetaMask Unlock</h4>
                        <p className="text-gray-400 text-sm mt-1">
                          Access your wallet with enhanced security, no typing required
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Alert className="bg-orange-900/20 border-orange-500/30">
                  <Info className="h-4 w-4 text-orange-400" />
                  <AlertDescription className="text-orange-200">
                    This demonstrates how ColorKey could work as a pre-authentication layer for MetaMask. 
                    In production, this would be implemented as a MetaMask Snap or browser extension.
                  </AlertDescription>
                </Alert>
                
                <button
                  onClick={() => setShowArchitecture(!showArchitecture)}
                  className="w-full text-center text-sm text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showArchitecture ? 'Hide' : 'Show'} Technical Architecture
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
                      <div className="space-y-4">
                        <h4 className="text-white font-medium flex items-center gap-2">
                          <Puzzle className="w-4 h-4 text-purple-400" />
                          Implementation Options
                        </h4>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-gray-800/30 rounded-lg p-4">
                            <h5 className="text-purple-300 font-medium mb-2">MetaMask Snap</h5>
                            <p className="text-gray-400 text-sm">
                              Build a Snap that integrates ColorKey directly into MetaMask's security flow
                            </p>
                            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                              <CheckCircle2 className="w-3 h-3 text-green-400" />
                              <span>Native integration</span>
                            </div>
                          </div>
                          
                          <div className="bg-gray-800/30 rounded-lg p-4">
                            <h5 className="text-blue-300 font-medium mb-2">Browser Extension</h5>
                            <p className="text-gray-400 text-sm">
                              Create a companion extension that works alongside MetaMask
                            </p>
                            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                              <Chrome className="w-3 h-3 text-blue-400" />
                              <span>Cross-wallet compatible</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                          <h5 className="text-cyan-300 font-medium mb-2">Security Architecture</h5>
                          <ul className="space-y-2 text-sm text-gray-400">
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-1.5"></div>
                              <span>ColorKey password never stored in plain text</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-1.5"></div>
                              <span>MetaMask password encrypted with ColorKey-derived key</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-1.5"></div>
                              <span>Zero-knowledge proof ensures no credential exposure</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-1.5"></div>
                              <span>Hardware wallet compatible for maximum security</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <CardFooter>
                <Button
                  onClick={handleStartColorKey}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  size="lg"
                >
                  Start ColorKey Authentication
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
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
                  Step 1: ColorKey Authentication
                </h2>
                <p className="text-gray-400 text-sm mt-2">
                  Enter your visual password to unlock MetaMask access
                </p>
              </CardHeader>
            </Card>
            
            <ColorKeyDemo 
              onComplete={handleColorKeyComplete}
              mode="unlock"
              hideDemo={true}
            />
            
            {isProcessing && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                      <p className="text-gray-300">Verifying ColorKey...</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
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
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-lg max-w-md mx-auto">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-green-500/10 rounded-full">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white">
                  ColorKey Verified!
                </h2>
                <p className="text-gray-400 text-sm mt-2">
                  Ready to unlock MetaMask
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <p className="text-green-300 text-sm">
                      ColorKey authentication successful
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-800/30 rounded-lg p-6 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-500/10 rounded-full mb-4">
                    <svg className="w-12 h-12 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21.9,8.9l-1.1-4.1l-2.6,1.8l-3.1-2.4l-3.1,2.5l-3.1-2.5L5.8,6.7L3.2,4.9L2.1,8.9l2.3,1.3l-0.6,2.4L6,13.7v2.4l3.1,2.2V16l3,1.7l3-1.7v2.3l3.1-2.2v-2.4l2.2-1.1l-0.6-2.4L21.9,8.9z M6,10.2l1.3,0.7L6,11.8V10.2z M12,14.5L9.9,13v-1.8l2.1,1.1l2.1-1.1V13L12,14.5z M18,11.8l-1.3-0.8l1.3-0.7V11.8z"/>
                    </svg>
                  </div>
                  <h3 className="text-white font-medium mb-2">MetaMask Ready</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Click below to proceed to MetaMask unlock
                  </p>
                  
                  <div className="bg-gray-900/50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-500 mb-1">In production, this would:</p>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>• Auto-fill MetaMask password</li>
                      <li>• Or unlock via MetaMask Snap API</li>
                      <li>• No manual password entry needed</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button
                  onClick={proceedToMetaMask}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  size="lg"
                >
                  <Unlock className="w-4 h-4 mr-2" />
                  Proceed to MetaMask
                </Button>
              </CardFooter>
            </Card>
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
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-lg max-w-md mx-auto">
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
                  Integration Complete!
                </h2>
                <p className="text-gray-400 mt-2">
                  MetaMask is now protected with ColorKey
                </p>
              </CardHeader>
              
              <CardContent>
                <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-lg p-4 text-center">
                  <h3 className="text-purple-300 font-medium mb-2">Next Steps</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    To implement this in production:
                  </p>
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-4 h-4 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <span className="text-purple-400 text-xs">1</span>
                      </div>
                      <span>Build MetaMask Snap with ColorKey SDK</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-4 h-4 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <span className="text-blue-400 text-xs">2</span>
                      </div>
                      <span>Implement secure credential bridge</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-4 h-4 bg-green-500/20 rounded-full flex items-center justify-center">
                        <span className="text-green-400 text-xs">3</span>
                      </div>
                      <span>Deploy to MetaMask Snap Store</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button
                  onClick={() => setCurrentStep('intro')}
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