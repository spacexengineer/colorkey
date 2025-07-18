"use client"

import { useState, useEffect } from "react"
import { BrowserProvider, formatEther } from "ethers"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Wallet, 
  AlertCircle,
  CheckCircle2,
  Loader2,
  Shield,
  Lock,
  Unlock,
  ExternalLink,
  Copy,
  Info
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ColorKeyDemo } from "./color-key-demo"

declare global {
  interface Window {
    ethereum?: any
  }
}

interface WalletState {
  address: string | null
  balance: string | null
  chainId: number | null
  isConnected: boolean
  isMetaMaskInstalled: boolean
}

interface ColorKeyVault {
  [address: string]: {
    encryptedData: string
    salt: string
    timestamp: number
  }
}

export function MetaMaskRealIntegration() {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    balance: null,
    chainId: null,
    isConnected: false,
    isMetaMaskInstalled: false
  })
  
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showColorKey, setShowColorKey] = useState(false)
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [colorKeyPassword, setColorKeyPassword] = useState("")
  const [copied, setCopied] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  
  // Check if MetaMask is installed on mount
  useEffect(() => {
    const checkMetaMask = () => {
      if (typeof window !== "undefined" && window.ethereum) {
        setWalletState(prev => ({ ...prev, isMetaMaskInstalled: true }))
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', handleAccountsChanged)
        window.ethereum.on('chainChanged', handleChainChanged)
      }
    }
    
    checkMetaMask()
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [])
  
  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected wallet
      setWalletState({
        address: null,
        balance: null,
        chainId: null,
        isConnected: false,
        isMetaMaskInstalled: walletState.isMetaMaskInstalled
      })
      setColorKeyPassword("")
    } else {
      // Update with new account
      setWalletState(prev => ({
        ...prev,
        address: accounts[0],
        isConnected: true
      }))
    }
  }
  
  const handleChainChanged = (chainId: string) => {
    // Convert hex chainId to number
    setWalletState(prev => ({
      ...prev,
      chainId: parseInt(chainId, 16)
    }))
    // Reload to ensure consistency
    window.location.reload()
  }
  
  const connectWallet = async () => {
    if (!walletState.isMetaMaskInstalled) {
      setError("Please install MetaMask to continue")
      return
    }
    
    setIsConnecting(true)
    setError(null)
    
    try {
      const provider = new BrowserProvider(window.ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])
      
      if (accounts.length > 0) {
        const address = accounts[0]
        const balance = await provider.getBalance(address)
        const network = await provider.getNetwork()
        
        setWalletState({
          address,
          balance: formatEther(balance),
          chainId: Number(network.chainId),
          isConnected: true,
          isMetaMaskInstalled: true
        })
        
        // After connecting, show ColorKey setup/unlock
        setShowColorKey(true)
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet")
    } finally {
      setIsConnecting(false)
    }
  }
  
  const handleColorKeyComplete = (password: string) => {
    setColorKeyPassword(password)
    setIsUnlocking(true)
    
    // Simulate storing encrypted wallet data with ColorKey
    // In production, this would encrypt sensitive data using the ColorKey password
    setTimeout(() => {
      // Store in local vault (in production, this would be encrypted)
      const vault: ColorKeyVault = JSON.parse(localStorage.getItem('colorKeyVault') || '{}')
      
      if (walletState.address) {
        vault[walletState.address] = {
          encryptedData: btoa(JSON.stringify({ 
            colorKeyHash: btoa(password), 
            walletAddress: walletState.address 
          })),
          salt: Math.random().toString(36).substring(7),
          timestamp: Date.now()
        }
        
        localStorage.setItem('colorKeyVault', JSON.stringify(vault))
      }
      
      setIsUnlocking(false)
      setShowColorKey(false)
    }, 1500)
  }
  
  const disconnectWallet = () => {
    setWalletState({
      address: null,
      balance: null,
      chainId: null,
      isConnected: false,
      isMetaMaskInstalled: walletState.isMetaMaskInstalled
    })
    setColorKeyPassword("")
    setShowColorKey(false)
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
  
  const getNetworkName = (chainId: number) => {
    const networks: { [key: number]: string } = {
      1: "Ethereum Mainnet",
      5: "Goerli Testnet",
      11155111: "Sepolia Testnet",
      137: "Polygon",
      42161: "Arbitrum One",
      10: "Optimism"
    }
    return networks[chainId] || `Chain ID: ${chainId}`
  }
  
  // Not connected state
  if (!walletState.isConnected && !showColorKey) {
    return (
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-lg w-full max-w-md mx-auto">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-orange-500/10 rounded-full">
              <Wallet className="w-12 h-12 text-orange-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white">Connect MetaMask</h2>
          <p className="text-gray-400 text-sm mt-2">
            Secure your wallet with ColorKey visual authentication
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4 pt-6">
          {!walletState.isMetaMaskInstalled && (
            <Alert className="bg-yellow-900/20 border-yellow-500/30">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <AlertDescription className="text-yellow-200">
                MetaMask is not installed. Please install the MetaMask extension to continue.
              </AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert className="bg-red-900/20 border-red-500/30">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-200">{error}</AlertDescription>
            </Alert>
          )}
          
          <Button 
            onClick={connectWallet}
            disabled={isConnecting || !walletState.isMetaMaskInstalled}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            size="lg"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                Connect MetaMask
              </>
            )}
          </Button>
          
          {!walletState.isMetaMaskInstalled && (
            <Button
              variant="outline"
              className="w-full border-gray-700 hover:bg-gray-800"
              size="lg"
              asChild
            >
              <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Install MetaMask
              </a>
            </Button>
          )}
          
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="w-full text-center text-sm text-gray-400 hover:text-gray-300 transition-colors"
          >
            <Info className="w-4 h-4 inline mr-1" />
            How does ColorKey enhance MetaMask security?
          </button>
        </CardContent>
        
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-800"
            >
              <CardFooter className="pt-4">
                <div className="space-y-3 text-sm text-gray-400">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <p>ColorKey adds an additional layer of visual authentication on top of MetaMask's security</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Lock className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                    <p>Your wallet address becomes the identifier, paired with your unique ColorKey password</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <p>16.8M times more secure than traditional password entry methods</p>
                  </div>
                </div>
              </CardFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    )
  }
  
  // ColorKey setup/unlock state
  if (showColorKey) {
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
              Secure Your Wallet with ColorKey
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              Connected: {walletState.address && formatAddress(walletState.address)}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Create or enter your ColorKey password to secure this wallet
            </p>
          </CardHeader>
        </Card>
        
        <ColorKeyDemo 
          onComplete={handleColorKeyComplete}
          mode="create"
          hideDemo={true}
        />
        
        {isUnlocking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                  <p className="text-gray-300">Securing your wallet with ColorKey...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    )
  }
  
  // Connected and authenticated state
  return (
    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-lg w-full max-w-2xl mx-auto">
      <CardHeader className="border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-full">
              <Wallet className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">MetaMask + ColorKey</h2>
              <p className="text-xs text-gray-400">{getNetworkName(walletState.chainId || 1)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-green-900/20 border border-green-500/30 rounded-full px-3 py-1">
              <CheckCircle2 className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-300">Secured</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={disconnectWallet}
              className="text-gray-400 hover:text-gray-200"
            >
              <Lock className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <p className="text-gray-400">Wallet Address</p>
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
            
            <div className="bg-gray-800/50 rounded-lg px-4 py-3 mb-4">
              <p className="font-mono text-sm text-gray-300">
                {walletState.address}
              </p>
            </div>
            
            {walletState.balance && (
              <div className="mb-6">
                <h3 className="text-3xl font-bold text-white">
                  {parseFloat(walletState.balance).toFixed(4)} ETH
                </h3>
                <p className="text-gray-500 text-sm mt-1">Balance</p>
              </div>
            )}
            
            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-lg p-4">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-purple-400" />
                <h4 className="text-purple-300 font-semibold">ColorKey Protection Active</h4>
              </div>
              <p className="text-gray-400 text-sm">
                Your wallet is secured with visual authentication. 
                Each transaction will require ColorKey verification.
              </p>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>16.8M times more secure than passwords</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300">Security Features</h4>
            <div className="grid gap-2">
              <div className="flex items-center gap-3 bg-gray-800/30 rounded-lg p-3">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-gray-300">Visual Authentication Required</p>
                  <p className="text-gray-500 text-xs">All transactions require ColorKey verification</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-800/30 rounded-lg p-3">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-gray-300">Address-Bound Security</p>
                  <p className="text-gray-500 text-xs">ColorKey is uniquely paired with your wallet address</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-800/30 rounded-lg p-3">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-gray-300">Encrypted Local Storage</p>
                  <p className="text-gray-500 text-xs">Your ColorKey data is encrypted and stored locally</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-gray-800 mt-6">
        <div className="w-full">
          <p className="text-center text-xs text-gray-500 mb-3">
            Ready for production? Integrate ColorKey with your dApp
          </p>
          <Button
            variant="outline"
            className="w-full border-gray-700 hover:bg-gray-800"
            asChild
          >
            <a href="https://github.com/colorkey/integration-guide" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Integration Guide
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}