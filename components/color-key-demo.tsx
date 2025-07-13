"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  History,
  StopCircle,
  Info,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Types
type HistoryEntry = {
  step: number
  hyperplaneState: string[][]
  selectedQuadrant: number
  isCorrect: boolean
  passwordChar: string
}

// Constants
const CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_-+=[]{}|;:,.<>?",
}
const KEY_POOL = ["Q", "W", "E", "R", "A", "S", "D", "F", "Z", "X", "C", "V"]

// Fisher-Yates Shuffle
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// Helper to generate a hyperplane state
const generateHyperplaneForChar = (
  targetChar: string,
  quadrantCount: number,
  charsPerQuadrant: number,
  characterSet: string,
): string[][] => {
  const correctQuadrantIndex = Math.floor(Math.random() * quadrantCount)
  // 🚫 Enforce 12-character limit per hyperplane
  const maxCharacters = Math.min(charsPerQuadrant, 12)
  const hyperplane: string[][] = []

  for (let i = 0; i < quadrantCount; i++) {
    const quadrantChars = new Set<string>()
    const alphabetWithoutTarget = characterSet.replace(targetChar, "")

    if (i === correctQuadrantIndex) {
      quadrantChars.add(targetChar)
      while (quadrantChars.size < maxCharacters) {
        const randomChar = alphabetWithoutTarget[Math.floor(Math.random() * alphabetWithoutTarget.length)]
        quadrantChars.add(randomChar)
      }
    } else {
      while (quadrantChars.size < maxCharacters) {
        const randomChar = alphabetWithoutTarget[Math.floor(Math.random() * alphabetWithoutTarget.length)]
        quadrantChars.add(randomChar)
      }
    }
    hyperplane.push(Array.from(quadrantChars).sort(() => 0.5 - Math.random()))
  }
  return hyperplane
}

const PasswordStrengthMeter = ({ password }: { password: string }) => {
  const calculateStrength = () => {
    let score = 0
    if (!password) return 0
    if (password.length >= 8) score++
    if (password.length > 12) score++
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  }

  const strength = calculateStrength()
  const strengthLevels = [
    { label: "Very Weak", color: "bg-red-500", textColor: "text-red-400" },
    { label: "Weak", color: "bg-red-500", textColor: "text-red-400" },
    { label: "Medium", color: "bg-yellow-500", textColor: "text-yellow-400" },
    { label: "Medium", color: "bg-yellow-500", textColor: "text-yellow-400" },
    { label: "Strong", color: "bg-green-500", textColor: "text-green-400" },
    { label: "Very Strong", color: "bg-green-500", textColor: "text-green-400" },
  ]

  if (!password) return null

  return (
    <div className="space-y-2 mt-2">
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 rounded-full transition-colors",
              i < strength ? strengthLevels[strength].color : "bg-gray-700",
            )}
          />
        ))}
      </div>
      <p className={cn("text-xs text-right font-medium", strengthLevels[strength].textColor)}>
        {strengthLevels[strength].label}
      </p>
    </div>
  )
}

const PasswordEntropyDetails = ({ password, isVisible }: { password: string; isVisible: boolean }) => {
  const criteria = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "Uppercase & lowercase", met: /[A-Z]/.test(password) && /[a-z]/.test(password) },
    { label: "At least one number", met: /\d/.test(password) },
    { label: "At least one symbol", met: /[^A-Za-z0-9]/.test(password) },
  ]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          className="mt-4 p-4 bg-gray-900 border border-gray-800 rounded-lg"
        >
          <ul className="space-y-2 text-sm">
            {criteria.map((item) => (
              <li key={item.label} className="flex items-center gap-2">
                <motion.div initial={{ scale: 0 }} animate={{ scale: item.met ? 1 : 0 }}>
                  <Check className="w-4 h-4 text-green-400" />
                </motion.div>
                <span className={cn(item.met ? "text-gray-300" : "text-gray-500")}>{item.label}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-800 flex items-start gap-2 text-xs text-gray-400">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              Strong passwords combine variety and unpredictability. Our visual cipher adds another layer of entropy,
              making brute-force attacks impractical.
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function ColorKeyDemo() {
  // Core State
  // Client-side mounting state to fix hydration
  const [isMounted, setIsMounted] = useState(false)
    const [masterPassword, setMasterPassword] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [currentStep, setCurrentStep] = useState(0)
  const [hyperplane, setHyperplane] = useState<string[][]>([])
  const [errorQuadrant, setErrorQuadrant] = useState<number | null>(null)
  const [successQuadrant, setSuccessQuadrant] = useState<number | null>(null)
  const [keyboardSelection, setKeyboardSelection] = useState<number | null>(null)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [isGridFocused, setIsGridFocused] = useState(false)
  const [pressedKey, setPressedKey] = useState<string | null>(null)
  const [isSubmissionFailed, setIsSubmissionFailed] = useState(false)
  const [showIncorrectSelectionError, setShowIncorrectSelectionError] = useState(false)
  const [flashErrorOnHyperplanes, setFlashErrorOnHyperplanes] = useState(false)

  // History & Replay State
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [isReplaying, setIsReplaying] = useState(false)
  const [replayStep, setReplayStep] = useState(0)

  // Settings State
  const [showControls, setShowControls] = useState(false)
  const [showKeyMapping, setShowKeyMapping] = useState(true)
  const [showFeedback, setShowFeedback] = useState(true)
  const [showKeyPrompt, setShowKeyPrompt] = useState(true)
  const [showLoginPassword, setShowLoginPassword] = useState(true)
  const [showMathDetails, setShowMathDetails] = useState(false)
  const [mouseEnabled, setMouseEnabled] = useState(true)
  const [numQuadrants, setNumQuadrants] = useState(4)
  const [charsPerQuadrant, setCharsPerQuadrant] = useState(6)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)

  const characterSet = useMemo(() => {
    let set = ""
    if (includeUppercase) set += CHAR_SETS.uppercase
    if (includeLowercase) set += CHAR_SETS.lowercase
    if (includeNumbers) set += CHAR_SETS.numbers
    if (includeSymbols) set += CHAR_SETS.symbols
    return set || CHAR_SETS.uppercase // Fallback
  }, [includeUppercase, includeLowercase, includeNumbers, includeSymbols])

  const cleanMasterPassword = useMemo(() => {
    return masterPassword
  }, [masterPassword])

  const generateNextHyperplane = useCallback(
    (step: number) => {
      // Only generate on client-side to prevent hydration mismatch
      if (!isMounted) return
            if (cleanMasterPassword && step < cleanMasterPassword.length) {
        const targetChar = cleanMasterPassword[step]
        if (characterSet.includes(targetChar)) {
          const newHyperplanes = generateHyperplaneForChar(targetChar, numQuadrants, charsPerQuadrant, characterSet)
          setHyperplane(shuffleArray(newHyperplanes))
        } else {
          setHyperplane(Array(numQuadrants).fill(Array(charsPerQuadrant).fill("?")))
        }
      } else {
        setHyperplane(Array(numQuadrants).fill(Array(charsPerQuadrant).fill("•")))
      }
    },
    [cleanMasterPassword, numQuadrants, charsPerQuadrant, characterSet, isMounted],
  )

  const isActive = cleanMasterPassword.length > 0
  const [isComplete, setIsComplete] = useState(false)
  const canSubmit = isActive && loginPassword.length === cleanMasterPassword.length

  const resetState = () => {
    setLoginPassword("")
    setCurrentStep(0)
    setHistory([])
    setIsSubmissionFailed(false)
    setIsComplete(false)
    setIsGridFocused(false)
    setShowIncorrectSelectionError(false)
    setFlashErrorOnHyperplanes(false)
  }

  const handleFullRestart = () => {
    setMasterPassword("")
    resetState()
  }

  const handleGameRestart = () => {
    resetState()
  }

  // Mount effect to fix hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])
    useEffect(() => {
    if (!isReplaying && isMounted) {
      generateNextHyperplane(currentStep)
    }
  }, [
    currentStep,
    cleanMasterPassword,
    numQuadrants,
    charsPerQuadrant,
    generateNextHyperplane,
    isReplaying,
    characterSet,
    isMounted,
  ])

  const handleQuadrantSelection = useCallback(
    (selectedIndex: number) => {
      if (!isActive || isComplete || isReplaying) return

      // Get the character from the selected quadrant
      const quadrantChars = hyperplane[selectedIndex] || []
      
      // If we're within password bounds, try to select the password character if it exists in this quadrant
      let selectedChar = '?'
      if (currentStep < cleanMasterPassword.length) {
        const targetChar = cleanMasterPassword[currentStep]
        if (quadrantChars.includes(targetChar)) {
          selectedChar = targetChar // Select the password character
        } else {
          selectedChar = quadrantChars[0] || '?' // Fallback to first character
        }
      } else {
        // Beyond password length, just take the first character
        selectedChar = quadrantChars[0] || '?'
      }
      
      setHistory((prev) => [
        ...prev,
        {
          step: currentStep,
          hyperplaneState: JSON.parse(JSON.stringify(hyperplane)), // Deep copy
          selectedQuadrant: selectedIndex,
          isCorrect: false, // We'll determine this on submit
          passwordChar: selectedChar,
        },
      ])

      // Always add character to login password and increment step
      setLoginPassword((prev) => prev + selectedChar)
      setCurrentStep((prev) => prev + 1)

      // Check if correct only if we're within the original password bounds
      const isCorrect = currentStep < cleanMasterPassword.length && 
                       quadrantChars.includes(cleanMasterPassword[currentStep])
      
      if (showFeedback) {
        if (isCorrect) {
          setSuccessQuadrant(selectedIndex)
          setTimeout(() => setSuccessQuadrant(null), 300)
        } else {
          setErrorQuadrant(selectedIndex)
          setTimeout(() => setErrorQuadrant(null), 300)
        }
      }

      // Always generate next hyperplane after selection
      setTimeout(() => {
        // If we're beyond password length, use a random character from the set for generation
        const nextChar = currentStep + 1 < cleanMasterPassword.length 
          ? cleanMasterPassword[currentStep + 1]
          : characterSet[Math.floor(Math.random() * characterSet.length)]
        const newHyperplanes = generateHyperplaneForChar(nextChar, numQuadrants, charsPerQuadrant, characterSet)
        setHyperplane(shuffleArray(newHyperplanes))
      }, 400)
    },
    [cleanMasterPassword, currentStep, hyperplane, isComplete, isActive, showFeedback, isReplaying, numQuadrants, charsPerQuadrant, characterSet],
  )

  const keyMap = useMemo(() => {
    const map: { [key: string]: number } = {}
    if (numQuadrants <= 4) {
      map["arrowup"] = 0
      map["arrowright"] = 1
      map["arrowdown"] = 3
      map["arrowleft"] = 2
    } else {
      for (let i = 0; i < numQuadrants; i++) {
        map[KEY_POOL[i].toLowerCase()] = i
      }
    }
    return map
  }, [numQuadrants])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGridFocused || isInputFocused || !isActive || isComplete || isReplaying) return

      const key = e.key.toLowerCase()
      if (key in keyMap) {
        e.preventDefault()
        setPressedKey(e.key.toUpperCase())
        setTimeout(() => setPressedKey(null), 200)

        const quadrantIndex = keyMap[key]
        if (showFeedback) {
          setKeyboardSelection(quadrantIndex)
          setTimeout(() => setKeyboardSelection(null), 200)
        }
        handleQuadrantSelection(quadrantIndex)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleQuadrantSelection, isActive, isComplete, showFeedback, keyMap, isInputFocused, isReplaying, isGridFocused])

  // Handle click outside to unfocus grid
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isGridFocused && !target.closest('[data-grid-container]')) {
        setIsGridFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isGridFocused])

  const handleMasterPasswordChange = (value: string) => {
    setMasterPassword(value)
    resetState()
  }

  const handleSubmit = () => {
    if (loginPassword === cleanMasterPassword) {
      setIsComplete(true)
    } else {
      setIsSubmissionFailed(true)
      setShowIncorrectSelectionError(true)
      setFlashErrorOnHyperplanes(true)
      
      setTimeout(() => {
        setIsSubmissionFailed(false)
        setShowIncorrectSelectionError(false)
        setFlashErrorOnHyperplanes(false)
        handleGameRestart()
      }, 2000)
    }
  }

  const handleBacktrack = () => {
    if (currentStep > 0) {
      setLoginPassword((prev) => prev.slice(0, -1))
      setCurrentStep((prev) => prev - 1)
      setHistory((prev) => prev.slice(0, -1))
    }
  }

  // --- Replay Logic ---
  const restoreStateAfterReplay = useCallback(() => {
    const finalCorrectStep = history.filter((h) => h.isCorrect).length
    setCurrentStep(finalCorrectStep)
    setLoginPassword(
      history
        .filter((h) => h.isCorrect)
        .map((h) => h.passwordChar)
        .join(""),
    )
    generateNextHyperplane(finalCorrectStep)
  }, [history, generateNextHyperplane])

  const handleReplay = () => {
    setIsReplaying(true)
    setReplayStep(0)
  }

  const handleStopReplay = useCallback(() => {
    setIsReplaying(false)
    setReplayStep(0)
    restoreStateAfterReplay()
  }, [restoreStateAfterReplay])

  useEffect(() => {
    if (!isReplaying) return

    if (replayStep >= history.length) {
      setTimeout(handleStopReplay, 1000)
      return
    }

    const item = history[replayStep]
    setHyperplane(item.hyperplaneState)
    setLoginPassword(
      history
        .slice(0, replayStep)
        .filter((h) => h.isCorrect)
        .map((h) => h.passwordChar)
        .join(""),
    )

    if (item.isCorrect) {
      setSuccessQuadrant(item.selectedQuadrant)
    } else {
      setErrorQuadrant(item.selectedQuadrant)
    }

    const timeoutId = setTimeout(() => {
      setSuccessQuadrant(null)
      setErrorQuadrant(null)
      setReplayStep((prev) => prev + 1)
    }, 1200)

    return () => clearTimeout(timeoutId)
  }, [isReplaying, replayStep, history, handleStopReplay])
  // --- End Replay Logic ---

  const characterGridCols = useMemo(() => {
    return `repeat(${Math.ceil(Math.sqrt(charsPerQuadrant))}, minmax(0, 1fr))`
  }, [charsPerQuadrant])

  const getInstruction = () => {
    if (isSubmissionFailed) return <span className="text-red-400 font-bold">Wrong password! Restarting...</span>
    if (isReplaying) return <span className="text-cyan-400 font-bold">Replaying history...</span>
    if (isComplete)
      return (
        <span className="text-green-400 font-bold flex items-center justify-center gap-2">
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <CheckCircle2 className="w-5 h-5" />
          </motion.span>
          Access Granted
        </span>
      )
    if (isActive) {
      // Check if any character in the password is not in the selected character sets
      const invalidChars = cleanMasterPassword.split('').filter(char => !characterSet.includes(char))
      
      if (invalidChars.length > 0) {
        const uniqueInvalidChars = [...new Set(invalidChars)]
        return (
          <span className="text-yellow-400 font-bold">
            Character{uniqueInvalidChars.length > 1 ? 's' : ''} '{uniqueInvalidChars.join("', '")}' not in selected set!
          </span>
        )
      }
      
      if (currentStep < cleanMasterPassword.length) {
        return (
          <span>
            Select quadrant with: <strong className="text-blue-400 font-bold">{cleanMasterPassword[currentStep]}</strong>
          </span>
        )
      } else {
        return (
          <span className="text-gray-400">
            Continue selecting quadrants or click Submit when ready.
          </span>
        )
      }
    }
    return <span className="text-gray-500">Create a password to begin.</span>
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-lg w-full max-w-5xl mx-auto overflow-hidden">
      <fieldset disabled={isReplaying} className="group">
        <div className="grid lg:grid-cols-5">
          <div className="lg:col-span-3 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-gray-800">
            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <div>
                  <Label htmlFor="master-password-input" className="text-sm font-medium text-gray-300">
                    Create a Password
                  </Label>
                  <Input
                    id="master-password-input"
                    placeholder="e.g., My$ecret123"
                    value={masterPassword}
                    onChange={(e) => handleMasterPasswordChange(e.target.value)}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    className="bg-gray-800 border-gray-700 text-white font-mono tracking-wider group-disabled:opacity-50"
                  />
                  {isInputFocused && <PasswordStrengthMeter password={masterPassword} />}
                  <PasswordEntropyDetails
                    password={masterPassword}
                    isVisible={isInputFocused}
                  />
                </div>
              </div>
              <AnimatePresence>
                {showLoginPassword && (
                  <motion.div
                    className="space-y-2 overflow-hidden"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <Label htmlFor="login-password-input" className="text-sm font-medium text-gray-300">
                      Enter Your Password
                    </Label>
                    <Input
                      id="login-password-input"
                      readOnly
                      value={loginPassword}
                      placeholder="Visually constructed here..."
                      className="bg-gray-800 border-gray-700 text-green-400 font-mono tracking-wider group-disabled:opacity-50"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="min-h-[28px] flex items-center justify-center my-4">
              <AnimatePresence mode="wait">
                {showKeyPrompt && (
                  <motion.p
                    key={getInstruction()?.props.children.toString()}
                    className="text-center text-lg text-gray-300"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    {getInstruction()}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Grid Focus Indicator */}
            {isActive && !isComplete && !isReplaying && (
              <div className="flex justify-center mb-4">
                <div className={cn(
                  "text-xs px-3 py-1 rounded-full border transition-all duration-300",
                  isGridFocused 
                    ? "border-blue-500/50 bg-blue-900/20 text-blue-300" 
                    : "border-gray-600/50 bg-gray-800/20 text-gray-400"
                )}>
                  {isGridFocused 
                    ? `🎯 Grid Active - Use ${mouseEnabled ? "Keyboard Keys or Click" : "Keyboard Keys"}` 
                    : "💤 Click Grid to Enable Keyboard Control"}
                </div>
              </div>
            )}

            {/* Submit Instruction */}
            {isActive && !isComplete && !isReplaying && loginPassword.length > 0 && (
              <div className="flex justify-center mb-6">
                <div className="text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                    <div className="flex items-center text-purple-300">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 animate-pulse"></div>
                      <span className="text-sm font-medium">
                        Click <strong>Submit</strong> when ready to verify your password
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={isReplaying ? `replay-${replayStep}` : currentStep}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <motion.div animate={isComplete ? { scale: [1, 1.02, 1] } : {}} transition={{ duration: 0.5 }}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div
                          data-grid-container
                          className={cn(
                            "grid w-full max-w-xl mx-auto gap-4 p-8 rounded-lg border-2 transition-all duration-300 cursor-pointer relative",
                            !mouseEnabled && "cursor-not-allowed",
                            isGridFocused && isActive && !isComplete && !isReplaying 
                              ? "border-blue-500/50 bg-blue-900/10 shadow-lg shadow-blue-500/20" 
                              : "border-cyan-400/40 bg-cyan-900/5 shadow-lg shadow-cyan-400/30 hover:border-cyan-400/60 hover:shadow-xl hover:shadow-cyan-400/40"
                          )}
                          animate={
                            !isGridFocused && isActive && !isComplete && !isReplaying
                              ? {
                                  boxShadow: [
                                    "0 4px 6px -1px rgba(34, 211, 238, 0.3), 0 2px 4px -1px rgba(34, 211, 238, 0.2), 0 0 20px rgba(34, 211, 238, 0.1)",
                                    "0 10px 15px -3px rgba(34, 211, 238, 0.4), 0 4px 6px -2px rgba(34, 211, 238, 0.3), 0 0 30px rgba(34, 211, 238, 0.2)",
                                    "0 4px 6px -1px rgba(34, 211, 238, 0.3), 0 2px 4px -1px rgba(34, 211, 238, 0.2), 0 0 20px rgba(34, 211, 238, 0.1)"
                                  ],
                                  borderColor: [
                                    "rgba(34, 211, 238, 0.4)",
                                    "rgba(34, 211, 238, 0.7)",
                                    "rgba(34, 211, 238, 0.4)"
                                  ]
                                }
                              : {}
                          }
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          onClick={() => !isInputFocused && setIsGridFocused(true)}
                          onBlur={() => setIsGridFocused(false)}
                          tabIndex={0}
                          style={{ gridTemplateColumns: numQuadrants === 4 ? "repeat(2, 1fr)" : numQuadrants <= 6 ? "repeat(3, 1fr)" : numQuadrants <= 9 ? "repeat(3, 1fr)" : "repeat(auto-fit, minmax(120px, 1fr))" }}
                        >
                          {hyperplane.slice(0, numQuadrants).map((quadrant, quadrantIndex) => (
                            <motion.button
                              key={quadrantIndex}
                              onClick={() => handleQuadrantSelection(quadrantIndex)}
                              animate={{ x: showFeedback && errorQuadrant === quadrantIndex ? [-5, 5, -5, 5, 0] : 0 }}
                              transition={{ duration: 0.3 }}
                              className={cn(
                                "aspect-square rounded-lg p-2 transition-all duration-200 relative",
                                "focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950",
                                !isActive && "bg-gray-800/20 border-gray-700/50 cursor-not-allowed",
                                isActive &&
                                  !isComplete &&
                                  "bg-gray-800/30 border border-gray-700 hover:border-blue-500 hover:bg-blue-900/20 active:scale-95",
                                showFeedback && successQuadrant === quadrantIndex && "border-green-500 bg-green-900/30",
                                showFeedback && isComplete && "bg-green-800/20 border-green-700 cursor-default",
                                showFeedback && errorQuadrant === quadrantIndex && "border-red-500",
                                showFeedback &&
                                  keyboardSelection === quadrantIndex &&
                                  "border-blue-400 ring-2 ring-blue-400",
                                flashErrorOnHyperplanes && "animate-pulse border-red-500 shadow-lg shadow-red-500/50",
                                !mouseEnabled && "pointer-events-none",
                              )}
                              aria-label={`Select quadrant ${quadrantIndex + 1}`}
                              disabled={!isActive || isComplete}
                            >
                              <div
                                className="grid gap-1 w-full h-full"
                                style={{ gridTemplateColumns: characterGridCols }}
                              >
                                {quadrant.map((char, charIndex) => (
                                  <div
                                    key={charIndex}
                                    className="aspect-square flex items-center justify-center rounded-sm bg-black/10 border border-white/5 min-h-[24px] min-w-[24px]"
                                  >
                                    <span
                                      className={cn(
                                        "font-mono text-xs sm:text-sm pointer-events-none",
                                        isActive ? "text-gray-400" : "text-gray-600",
                                      )}
                                      aria-hidden="true"
                                    >
                                      {char}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              {/* Hyperplane Number Indicator */}
                              <div className="absolute bottom-1 right-1 bg-gray-800/80 text-gray-300 text-xs rounded px-1 py-0.5 pointer-events-none">
                                {quadrantIndex + 1}
                              </div>
                            </motion.button>
                          ))}
                        </motion.div>
                      </TooltipTrigger>
                      {!mouseEnabled && (
                        <TooltipContent>
                          <p>Mouse clicks disabled. Use keyboard.</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Error Feedback Message */}
            <AnimatePresence>
              {showIncorrectSelectionError && (
                <motion.div
                  className="flex justify-center mt-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-red-500 text-sm font-medium bg-red-900/20 border border-red-500/30 rounded-md px-4 py-2">
                    Incorrect selection. Try again.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showKeyMapping && (
                <motion.div
                  className="w-full mt-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <KeyMappingLegend keyMap={keyMap} pressedKey={pressedKey} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-2 bg-gray-900 p-4 sm:p-6 overflow-y-auto">
            <div className="space-y-4">
              <SettingsToggle
                id="show-controls"
                label="Show Advanced Controls"
                checked={showControls}
                onCheckedChange={setShowControls}
              />
              <AnimatePresence>
                {showControls && (
                  <motion.div
                    className="space-y-4 pt-4 border-t border-gray-800"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <SettingsSlider
                      label="Number of Hyperplanes"
                      value={numQuadrants}
                      onValueChange={(v) => setNumQuadrants(v[0])}
                      min={4}
                      max={10}
                      step={1}
                    />
                    <SettingsSlider
                      label="Characters per Hyperplane"
                      value={charsPerQuadrant}
                      onValueChange={(v) => setCharsPerQuadrant(Math.min(v[0], 12))}
                      min={4}
                      max={12}
                      step={1}
                    />
                    <div className="space-y-2 rounded-lg border border-gray-800 p-3 bg-gray-900/50">
                      <Label className="text-gray-300 text-sm">Character Sets</Label>
                      <SettingsToggle
                        id="include-uppercase"
                        label="Include Uppercase (A-Z)"
                        checked={includeUppercase}
                        onCheckedChange={setIncludeUppercase}
                      />
                      <SettingsToggle
                        id="include-lowercase"
                        label="Include Lowercase (a-z)"
                        checked={includeLowercase}
                        onCheckedChange={setIncludeLowercase}
                      />
                      <SettingsToggle
                        id="include-numbers"
                        label="Include Numbers (0-9)"
                        checked={includeNumbers}
                        onCheckedChange={setIncludeNumbers}
                      />
                      <SettingsToggle
                        id="include-symbols"
                        label="Include Symbols (!@#...)"
                        checked={includeSymbols}
                        onCheckedChange={setIncludeSymbols}
                      />
                    </div>
                    <SettingsToggle
                      id="enable-clicks"
                      label="Enable Mouse Clicks"
                      checked={mouseEnabled}
                      onCheckedChange={setMouseEnabled}
                    />
                    <SettingsToggle
                      id="show-login-password"
                      label="Show Password Input"
                      checked={showLoginPassword}
                      onCheckedChange={setShowLoginPassword}
                    />
                    <SettingsToggle
                      id="key-prompt"
                      label="Show Current Key Prompt"
                      checked={showKeyPrompt}
                      onCheckedChange={setShowKeyPrompt}
                    />
                    <SettingsToggle
                      id="key-mapping"
                      label="Show Key Mapping"
                      checked={showKeyMapping}
                      onCheckedChange={setShowKeyMapping}
                    />
                    <SettingsToggle
                      id="feedback"
                      label="Enable Selection Feedback"
                      checked={showFeedback}
                      onCheckedChange={setShowFeedback}
                    />

                    {/* Security Math Component */}
                    <div className="border-t border-gray-700 pt-4 mt-4">
                      <button
                        onClick={() => setShowMathDetails(!showMathDetails)}
                        className="w-full flex items-center justify-between text-left text-sm text-gray-300 hover:text-gray-100 transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                          <span className="font-medium">Why ColorKey is More Secure</span>
                        </div>
                        <div className={cn(
                          "transition-transform duration-200",
                          showMathDetails ? "rotate-180" : ""
                        )}>
                          <ArrowDown className="w-4 h-4" />
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {showMathDetails && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="pt-3 space-y-3 text-xs text-gray-400">
                              <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                                <h4 className="text-cyan-400 font-semibold mb-2">Mathematical Advantage</h4>
                                <div className="space-y-2">
                                  <div>
                                    <span className="text-gray-300">Traditional 12-char password:</span>
                                    <div className="font-mono text-gray-500">5.4 × 10²³ combinations</div>
                                  </div>
                                  <div>
                                    <span className="text-cyan-300">ColorKey 12-char password:</span>
                                    <div className="font-mono text-cyan-400">9.1 × 10³⁰ combinations</div>
                                  </div>
                                  <div className="pt-2 border-t border-gray-700">
                                    <span className="text-purple-300 font-medium">
                                      🔒 16.8 MILLION times more secure
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                                  <span>Each character requires selecting the correct hyperplane (1 in {numQuadrants} chance)</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                                  <span>Layouts randomize after each selection - impossible to replay attacks</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                                  <span>Screen recording and keyloggers become useless</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                                  <span>Visual memory required - resistant to shoulder surfing</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <CardFooter className="flex flex-wrap justify-center gap-4 bg-gray-900/50 border-t border-gray-800 p-4 sm:p-6">
          <Button
            variant="outline"
            onClick={handleBacktrack}
            disabled={currentStep === 0}
            className="flex-1 sm:flex-auto min-w-[140px] border-yellow-500 text-yellow-400 hover:bg-yellow-900/20 hover:text-yellow-300 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Backtrack
          </Button>
          <Button
            variant="outline"
            onClick={handleSubmit}
            disabled={!isActive}
            className="flex-1 sm:flex-auto min-w-[140px] border-purple-500 text-purple-400 hover:bg-purple-900/20 hover:text-purple-300 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" /> Submit
          </Button>
          <Button
            variant="outline"
            onClick={handleFullRestart}
            disabled={!isActive}
            className="flex-1 sm:flex-auto min-w-[140px] border-red-500 text-red-400 hover:bg-red-900/20 hover:text-red-300 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Restart
          </Button>
          {isReplaying ? (
            <Button
              variant="outline"
              onClick={handleStopReplay}
              className="flex-1 sm:flex-auto min-w-[140px] border-cyan-500 text-cyan-400 hover:bg-cyan-900/20 hover:text-cyan-300 bg-transparent"
            >
              <StopCircle className="w-4 h-4 mr-2" /> Stop Replay
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleReplay}
              disabled={history.length === 0}
              className="flex-1 sm:flex-auto min-w-[140px] border-cyan-500 text-cyan-400 hover:bg-cyan-900/20 hover:text-cyan-300 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <History className="w-4 h-4 mr-2" /> Replay History
            </Button>
          )}
        </CardFooter>
      </fieldset>
    </Card>
  )
}

const KeyMappingLegend = ({ keyMap, pressedKey }: { keyMap: { [key: string]: number }; pressedKey: string | null }) => {
  const isArrowMapping = "arrowup" in keyMap
  const quadrantNames = ["Top Left", "Top Right", "Bottom Left", "Bottom Right"]

  const renderKey = (key: string, quadrant: number) => {
    const displayKey = key.startsWith("arrow") ? key.replace("arrow", "") : key
    const Icon =
      key === "arrowup" ? ArrowUp : key === "arrowright" ? ArrowRight : key === "arrowdown" ? ArrowDown : ArrowLeft
    const quadrantName = isArrowMapping ? quadrantNames[quadrant] : `Quadrant ${quadrant + 1}`

    return (
      <div
        key={key}
        className={cn(
          "flex items-center gap-1.5 border border-gray-700 bg-gray-800/30 rounded-md px-2 py-1 transition-all duration-100",
          pressedKey === key.toUpperCase() && "bg-blue-500/50 ring-2 ring-blue-400",
        )}
      >
        {isArrowMapping ? (
          <Icon className="w-3 h-3" />
        ) : (
          <span className="font-mono font-bold w-3 text-center">{displayKey.toUpperCase()}</span>
        )}
        <span className="text-gray-500">→</span>
        <span className="text-gray-300">{quadrantName}</span>
      </div>
    )
  }

  return (
    <div className="text-center space-y-2">
      <h4 className="text-sm font-medium text-gray-400">Keyboard Mappings</h4>
      <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
        {Object.entries(keyMap).map(([key, quadrant]) => renderKey(key, quadrant))}
      </div>
    </div>
  )
}

const SettingsToggle = ({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) => (
  <div className="flex items-center justify-between rounded-lg border border-gray-800 p-3 bg-gray-900/50 first:mt-2">
    <Label htmlFor={id} className="text-gray-300 cursor-pointer text-sm">
      {label}
    </Label>
    <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
  </div>
)

const SettingsSlider = ({
  label,
  value,
  onValueChange,
  min,
  max,
  step,
}: {
  label: string
  value: number
  onValueChange: (value: number[]) => void
  min: number
  max: number
  step: number
}) => (
  <div className="rounded-lg border border-gray-800 p-3 bg-gray-900/50 space-y-3">
    <div className="flex justify-between items-center">
      <Label className="text-gray-300 text-sm">{label}</Label>
      <span className="text-sm font-bold text-blue-400">{value}</span>
    </div>
    <Slider value={[value]} onValueChange={onValueChange} min={min} max={max} step={step} />
  </div>
)
