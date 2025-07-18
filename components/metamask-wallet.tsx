"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Wallet, 
  Send, 
  Download, 
  Copy, 
  CheckCircle2, 
  Lock, 
  Unlock,
  Shield,
  Eye,
  EyeOff,
  LogOut,
  Plus
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ColorKeyDemo } from "./color-key-demo"

// Mock wallet interface (would use ethers.js in production)
interface WalletState {
  address: string | null
  balance: string
  isUnlocked: boolean
  network: string
}

export function MetaMaskWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    balance: "0.0",
    isUnlocked: false,
    network: "Ethereum Mainnet"
  })
  
  const [showCreateWallet, setShowCreateWallet] = useState(false)
  const [showUnlockWallet, setShowUnlockWallet] = useState(false)
  const [showBalance, setShowBalance] = useState(true)
  const [copied, setCopied] = useState(false)
  const [colorKeyPassword, setColorKeyPassword] = useState("")
  const [isColorKeyComplete, setIsColorKeyComplete] = useState(false)

  // Mock address generation
  const generateMockAddress = () => {
    const chars = '0123456789abcdef'
    let address = '0x'
    for (let i = 0; i < 40; i++) {
      address += chars[Math.floor(Math.random() * chars.length)]
    }
    return address
  }

  const handleCreateWallet = () => {
    setShowCreateWallet(true)
  }

  const handleUnlockWallet = () => {
    setShowUnlockWallet(true)
  }

  const handleColorKeyComplete = (password: string) => {
    setColorKeyPassword(password)
    setIsColorKeyComplete(true)
    
    // Simulate wallet unlock
    setTimeout(() => {
      setWalletState({
        ...walletState,
        address: generateMockAddress(),
        balance: "2.4567",
        isUnlocked: true
      })
      setShowUnlockWallet(false)
      setShowCreateWallet(false)
    }, 1000)
  }

  const handleLockWallet = () => {
    setWalletState({
      ...walletState,
      isUnlocked: false
    })
    setColorKeyPassword("")
    setIsColorKeyComplete(false)
  }

  const copyAddress = () => {
    if (walletState.address) {
      navigator.clipboard.writeText(walletState.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Not logged in state
  if (!walletState.isUnlocked && !showCreateWallet && !showUnlockWallet) {
    return (
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-lg w-full max-w-md mx-auto">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-orange-500/10 rounded-full">
              <Wallet className="w-12 h-12 text-orange-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white">ColorKey Wallet</h2>
          <p className="text-gray-400 text-sm mt-2">
            The world's most secure wallet with visual authentication
          </p>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <Button 
            onClick={handleCreateWallet}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            size="lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Wallet
          </Button>
          <Button 
            onClick={handleUnlockWallet}
            variant="outline"
            className="w-full border-gray-700 hover:bg-gray-800"
            size="lg"
          >
            <Unlock className="w-4 h-4 mr-2" />
            Unlock Existing Wallet
          </Button>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-xs text-gray-500">
            Powered by ColorKey visual authentication
          </p>
        </CardFooter>
      </Card>
    )
  }

  // Create/Unlock wallet with ColorKey
  if (showCreateWallet || showUnlockWallet) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-6">
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-orange-500/10 rounded-full">
                <Shield className="w-8 h-8 text-orange-500" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white">
              {showCreateWallet ? "Create Your Wallet" : "Unlock Your Wallet"}
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              Use ColorKey visual authentication to secure your wallet
            </p>
          </CardHeader>
        </Card>
        
        <ColorKeyDemo 
          onComplete={handleColorKeyComplete}
          mode={showCreateWallet ? "create" : "unlock"}
          hideDemo={true}
        />
      </div>
    )
  }

  // Unlocked wallet state
  return (
    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-lg w-full max-w-2xl mx-auto">
      <CardHeader className="border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-full">
              <Wallet className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">ColorKey Wallet</h2>
              <p className="text-xs text-gray-400">{walletState.network}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLockWallet}
            className="text-gray-400 hover:text-gray-200"
          >
            <Lock className="w-4 h-4 mr-2" />
            Lock
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Account Info */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <p className="text-gray-400">Account 1</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyAddress}
                className="text-gray-400 hover:text-gray-200"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg px-4 py-2 mb-4">
              <p className="font-mono text-sm text-gray-300">
                {walletState.address && formatAddress(walletState.address)}
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-2">
              <h3 className={cn(
                "text-3xl font-bold text-white transition-all",
                !showBalance && "blur-sm select-none"
              )}>
                {showBalance ? walletState.balance : "••••"} ETH
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
                className="text-gray-400 hover:text-gray-200"
              >
                {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Action Tabs */}
          <Tabs defaultValue="send" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
              <TabsTrigger value="send" className="data-[state=active]:bg-gray-700">
                <Send className="w-4 h-4 mr-2" />
                Send
              </TabsTrigger>
              <TabsTrigger value="receive" className="data-[state=active]:bg-gray-700">
                <Download className="w-4 h-4 mr-2" />
                Receive
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="send" className="space-y-4 mt-6">
              <div>
                <Label htmlFor="recipient" className="text-gray-300">
                  Recipient Address
                </Label>
                <Input
                  id="recipient"
                  placeholder="0x..."
                  className="bg-gray-800 border-gray-700 text-white mt-2"
                />
              </div>
              <div>
                <Label htmlFor="amount" className="text-gray-300">
                  Amount (ETH)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.0"
                  className="bg-gray-800 border-gray-700 text-white mt-2"
                />
              </div>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                <Send className="w-4 h-4 mr-2" />
                Send with ColorKey Confirmation
              </Button>
            </TabsContent>
            
            <TabsContent value="receive" className="text-center space-y-4 mt-6">
              <div className="bg-white p-4 rounded-lg inline-block">
                {/* QR Code would go here */}
                <div className="w-48 h-48 bg-gray-200 rounded flex items-center justify-center">
                  <p className="text-gray-500 text-sm">QR Code</p>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="font-mono text-xs text-gray-300 break-all">
                  {walletState.address}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={copyAddress}
                className="border-gray-700 hover:bg-gray-800"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Address
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-gray-800 mt-6">
        <div className="flex items-center justify-between w-full text-xs text-gray-500">
          <p>Secured by ColorKey</p>
          <p>16.8M times more secure</p>
        </div>
      </CardFooter>
    </Card>
  )
}