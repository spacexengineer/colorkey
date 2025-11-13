"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  History,
  StopCircle,
  Wallet,
  Keyboard,
  Shuffle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
type HistoryEntry = {
  step: number;
  hyperplaneState: string[][];
  selectedQuadrant: number;
  isCorrect: boolean;
  passwordChar: string;
};

// Constants
const CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_-+=[]{}|;:,.<>?",
};
const KEY_POOL = ["Q", "W", "E", "R", "A", "S", "D", "F", "Z", "X", "C", "V"];

// Fisher-Yates Shuffle
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Helper to generate a hyperplane state
const generateHyperplaneForChar = (
  targetChar: string,
  quadrantCount: number,
  charsPerQuadrant: number,
  characterSet: string
): string[][] => {
  console.log(`generateHyperplaneForChar called with charsPerQuadrant: ${charsPerQuadrant}`);
  const correctQuadrantIndex = Math.floor(Math.random() * quadrantCount);
  const hyperplane: string[][] = [];

  for (let i = 0; i < quadrantCount; i++) {
    const quadrantChars: string[] = [];
    const availableChars = characterSet.split('');

    if (i === correctQuadrantIndex) {
      // Add target character first
      quadrantChars.push(targetChar);
      // Remove target char from available options
      const remainingChars = availableChars.filter(c => c !== targetChar);

      // Fill rest with random characters (allowing duplicates if needed)
      while (quadrantChars.length < charsPerQuadrant) {
        const randomChar = remainingChars[Math.floor(Math.random() * remainingChars.length)];
        quadrantChars.push(randomChar);
      }
    } else {
      // Remove target char from available options
      const remainingChars = availableChars.filter(c => c !== targetChar);

      // Fill with random characters (allowing duplicates if needed)
      while (quadrantChars.length < charsPerQuadrant) {
        const randomChar = remainingChars[Math.floor(Math.random() * remainingChars.length)];
        quadrantChars.push(randomChar);
      }
    }

    console.log(`Quadrant ${i} generated with ${quadrantChars.length} characters:`, quadrantChars);
    // Shuffle the quadrant
    hyperplane.push(shuffleArray(quadrantChars));
  }
  return hyperplane;
};



interface ColorKeyDemoProps {
  onComplete?: (password: string) => void;
  mode?: "demo" | "create" | "unlock";
  hideDemo?: boolean;
}

export function ColorKeyDemo({
  onComplete,
  mode = "demo",
  hideDemo = false,
}: ColorKeyDemoProps) {
  // Core State
  // Client-side mounting state to fix hydration
  const [isMounted, setIsMounted] = useState(false);
  const [masterPassword, setMasterPassword] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [hyperplane, setHyperplane] = useState<string[][]>([]);
  const [errorQuadrant, setErrorQuadrant] = useState<number | null>(null);
  const [successQuadrant, setSuccessQuadrant] = useState<number | null>(null);
  const [keyboardSelection, setKeyboardSelection] = useState<number | null>(
    null
  );
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isGridFocused, setIsGridFocused] = useState(false);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [isSubmissionFailed, setIsSubmissionFailed] = useState(false);
  const [showIncorrectSelectionError, setShowIncorrectSelectionError] =
    useState(false);
  const [flashErrorOnHyperplanes, setFlashErrorOnHyperplanes] = useState(false);

  // History & Replay State
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayStep, setReplayStep] = useState(0);

  // Settings State
  const [showControls, setShowControls] = useState(true);
  const [showKeyMapping, setShowKeyMapping] = useState(true);
  const [showFeedback, setShowFeedback] = useState(true);
  const [showKeyPrompt, setShowKeyPrompt] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showMathDetails, setShowMathDetails] = useState(false);
  const [numQuadrants, setNumQuadrants] = useState(4);
  const [charsPerQuadrant, setCharsPerQuadrant] = useState(6);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  // Device detection and mouse control
  const [isMobile, setIsMobile] = useState(false);
  const [mouseEnabled, setMouseEnabled] = useState(false);

  const characterSet = useMemo(() => {
    let set = "";
    if (includeUppercase) set += CHAR_SETS.uppercase;
    if (includeLowercase) set += CHAR_SETS.lowercase;
    if (includeNumbers) set += CHAR_SETS.numbers;
    if (includeSymbols) set += CHAR_SETS.symbols;
    return set || CHAR_SETS.uppercase; // Fallback
  }, [includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const cleanMasterPassword = useMemo(() => {
    return masterPassword;
  }, [masterPassword]);

  const generateNextHyperplane = useCallback(
    (step: number) => {
      // Only generate on client-side to prevent hydration mismatch
      if (!isMounted) return;
      if (cleanMasterPassword && step < cleanMasterPassword.length) {
        const targetChar = cleanMasterPassword[step];
        if (characterSet.includes(targetChar)) {
          const newHyperplanes = generateHyperplaneForChar(
            targetChar,
            numQuadrants,
            charsPerQuadrant,
            characterSet
          );
          setHyperplane(shuffleArray(newHyperplanes));
        } else {
          setHyperplane(
            Array.from({ length: numQuadrants }, () =>
              Array(charsPerQuadrant).fill("?")
            )
          );
        }
      } else {
        setHyperplane(
          Array.from({ length: numQuadrants }, () =>
            Array(charsPerQuadrant).fill("•")
          )
        );
      }
    },
    [
      cleanMasterPassword,
      numQuadrants,
      charsPerQuadrant,
      characterSet,
      isMounted,
    ]
  );

  const isActive = cleanMasterPassword.length > 0;
  const [isComplete, setIsComplete] = useState(false);
  const canSubmit =
    isActive && loginPassword.length === cleanMasterPassword.length;

  const resetState = () => {
    setLoginPassword("");
    setCurrentStep(0);
    setHistory([]);
    setIsSubmissionFailed(false);
    setIsComplete(false);
    setIsGridFocused(false);
    setShowIncorrectSelectionError(false);
    setFlashErrorOnHyperplanes(false);
  };

  const handleFullRestart = () => {
    setMasterPassword("");
    resetState();
  };

  const handleGameRestart = () => {
    resetState();
  };

  // Mount effect to fix hydration and detect device type
  useEffect(() => {
    setIsMounted(true);

    // Detect device type
    const checkDevice = () => {
      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const mobile = isTouch || isMobileUA;
      setIsMobile(mobile);
      // Enable mouse clicks by default on mobile, disable on desktop
      setMouseEnabled(mobile);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);
  useEffect(() => {
    if (!isReplaying && isMounted) {
      generateNextHyperplane(currentStep);
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
  ]);

  // Force re-render when sizing parameters change
  useEffect(() => {
    // This effect ensures the component re-renders when sizing parameters change
    // triggering recalculation of all dynamic sizing values
  }, [numQuadrants, charsPerQuadrant]);

  const handleQuadrantSelection = useCallback(
    (selectedIndex: number) => {
      if (!isActive || isComplete || isReplaying) return;

      // Get the character from the selected quadrant
      const quadrantChars = hyperplane[selectedIndex] || [];

      // If we're within password bounds, try to select the password character if it exists in this quadrant
      let selectedChar = "?";
      if (currentStep < cleanMasterPassword.length) {
        const targetChar = cleanMasterPassword[currentStep];
        if (quadrantChars.includes(targetChar)) {
          selectedChar = targetChar; // Select the password character
        } else {
          selectedChar = quadrantChars[0] || "?"; // Fallback to first character
        }
      } else {
        // Beyond password length, just take the first character
        selectedChar = quadrantChars[0] || "?";
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
      ]);

      // Always add character to login password and increment step
      setLoginPassword((prev) => prev + selectedChar);
      setCurrentStep((prev) => prev + 1);

      // Check if correct only if we're within the original password bounds
      const isCorrect =
        currentStep < cleanMasterPassword.length &&
        quadrantChars.includes(cleanMasterPassword[currentStep]);

      if (showFeedback) {
        if (isCorrect) {
          setSuccessQuadrant(selectedIndex);
          setTimeout(() => setSuccessQuadrant(null), 300);
        } else {
          setErrorQuadrant(selectedIndex);
          setTimeout(() => setErrorQuadrant(null), 300);
        }
      }

      // Always generate next hyperplane after selection
      setTimeout(() => {
        // If we're beyond password length, use a random character from the set for generation
        const nextChar =
          currentStep + 1 < cleanMasterPassword.length
            ? cleanMasterPassword[currentStep + 1]
            : characterSet[Math.floor(Math.random() * characterSet.length)];
        const newHyperplanes = generateHyperplaneForChar(
          nextChar,
          numQuadrants,
          charsPerQuadrant,
          characterSet
        );
        setHyperplane(shuffleArray(newHyperplanes));
      }, 400);
    },
    [
      cleanMasterPassword,
      currentStep,
      hyperplane,
      isComplete,
      isActive,
      showFeedback,
      isReplaying,
      numQuadrants,
      charsPerQuadrant,
      characterSet,
    ]
  );

  const keyMap = useMemo(() => {
    const map: { [key: string]: number } = {};
    if (numQuadrants <= 4) {
      map["arrowup"] = 0;
      map["arrowright"] = 1;
      map["arrowdown"] = 2;
      map["arrowleft"] = 3;
    } else {
      for (let i = 0; i < numQuadrants; i++) {
        map[KEY_POOL[i].toLowerCase()] = i;
      }
    }
    return map;
  }, [numQuadrants]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        !isGridFocused ||
        isInputFocused ||
        !isActive ||
        isComplete ||
        isReplaying
      )
        return;

      const key = e.key.toLowerCase();
      if (key in keyMap) {
        e.preventDefault();
        setPressedKey(e.key.toUpperCase());
        setTimeout(() => setPressedKey(null), 200);

        const quadrantIndex = keyMap[key];
        if (showFeedback) {
          setKeyboardSelection(quadrantIndex);
          setTimeout(() => setKeyboardSelection(null), 200);
        }
        handleQuadrantSelection(quadrantIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    handleQuadrantSelection,
    isActive,
    isComplete,
    showFeedback,
    keyMap,
    isInputFocused,
    isReplaying,
    isGridFocused,
  ]);

  // Handle click outside to unfocus grid
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isGridFocused && !target.closest("[data-grid-container]")) {
        setIsGridFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isGridFocused]);

  const handleMasterPasswordChange = (value: string) => {
    setMasterPassword(value);
    resetState();
  };

  const handleSubmit = () => {
    if (loginPassword === cleanMasterPassword) {
      setIsComplete(true);
      // Call onComplete callback for MetaMask integration
      if (onComplete) {
        onComplete(cleanMasterPassword);
      }
    } else {
      setIsSubmissionFailed(true);
      setShowIncorrectSelectionError(true);
      setFlashErrorOnHyperplanes(true);

      setTimeout(() => {
        setIsSubmissionFailed(false);
        setShowIncorrectSelectionError(false);
        setFlashErrorOnHyperplanes(false);
        handleGameRestart();
      }, 2000);
    }
  };

  const handleBacktrack = () => {
    if (currentStep > 0) {
      setLoginPassword((prev) => prev.slice(0, -1));
      setCurrentStep((prev) => prev - 1);
      setHistory((prev) => prev.slice(0, -1));
    }
  };

  // --- Replay Logic ---
  const restoreStateAfterReplay = useCallback(() => {
    const finalCorrectStep = history.filter((h) => h.isCorrect).length;
    setCurrentStep(finalCorrectStep);
    setLoginPassword(
      history
        .filter((h) => h.isCorrect)
        .map((h) => h.passwordChar)
        .join("")
    );
    generateNextHyperplane(finalCorrectStep);
  }, [history, generateNextHyperplane]);

  const handleReplay = () => {
    setIsReplaying(true);
    setReplayStep(0);
  };

  const handleStopReplay = useCallback(() => {
    setIsReplaying(false);
    setReplayStep(0);
    restoreStateAfterReplay();
  }, [restoreStateAfterReplay]);

  useEffect(() => {
    if (!isReplaying) return;

    if (replayStep >= history.length) {
      setTimeout(handleStopReplay, 1000);
      return;
    }

    const item = history[replayStep];
    setHyperplane(item.hyperplaneState);
    setLoginPassword(
      history
        .slice(0, replayStep)
        .filter((h) => h.isCorrect)
        .map((h) => h.passwordChar)
        .join("")
    );

    if (item.isCorrect) {
      setSuccessQuadrant(item.selectedQuadrant);
    } else {
      setErrorQuadrant(item.selectedQuadrant);
    }

    const timeoutId = setTimeout(() => {
      setSuccessQuadrant(null);
      setErrorQuadrant(null);
      setReplayStep((prev) => prev + 1);
    }, 1200);

    return () => clearTimeout(timeoutId);
  }, [isReplaying, replayStep, history, handleStopReplay]);
  // --- End Replay Logic ---

  const characterGridCols = useMemo(() => {
    const cols = Math.ceil(Math.sqrt(charsPerQuadrant));
    return `repeat(${cols}, 1fr)`;
  }, [charsPerQuadrant]);

  // Keep character text size constant
  const getCharacterCellSize = useMemo(() => {
    return "text-sm sm:text-base";
  }, []);

  const getQuadrantPadding = useMemo(() => {
    // Maintain consistent padding regardless of character count
    return "p-2 sm:p-3";
  }, []);

  const getInstruction = () => {
    if (isSubmissionFailed)
      return (
        <span className="text-red-400 font-bold">
          Wrong password! Restarting...
        </span>
      );
    if (isReplaying)
      return (
        <span className="text-cyan-400 font-bold">Replaying history...</span>
      );
    if (isComplete)
      return (
        <span className="text-green-400 font-bold flex items-center justify-center gap-2">
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <CheckCircle2 className="w-5 h-5" />
          </motion.span>
          Access Granted
        </span>
      );
    if (isActive) {
      // Check if any character in the password is not in the selected character sets
      const invalidChars = cleanMasterPassword
        .split("")
        .filter((char) => !characterSet.includes(char));

      if (invalidChars.length > 0) {
        const uniqueInvalidChars = [...new Set(invalidChars)];
        return (
          <span className="text-yellow-400 font-bold">
            Character{uniqueInvalidChars.length > 1 ? "s" : ""} '
            {uniqueInvalidChars.join("', '")}' not in selected set!
          </span>
        );
      }

      if (currentStep < cleanMasterPassword.length) {
        return (
          <span>
            Select quadrant with:{" "}
            <strong className="text-blue-400 font-bold">
              {cleanMasterPassword[currentStep]}
            </strong>
          </span>
        );
      } else {
        return (
          <span className="text-gray-400">
            Continue selecting quadrants or click Submit when ready.
          </span>
        );
      }
    }
    return <span className="text-gray-500">Create a password to begin.</span>;
  };

  return (
    <div className="flex justify-center items-start min-h-screen w-full p-4">
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-lg w-full max-w-7xl overflow-auto">
      <fieldset disabled={isReplaying} className="group">
        {mode !== "demo" && (
          <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-lg p-4 mb-6 mx-4 sm:mx-6">
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-orange-400" />
              <div>
                <h3 className="text-orange-400 font-semibold text-sm">
                  {mode === "create" ? "Wallet Creation" : "Wallet Unlock"}
                </h3>
                <p className="text-orange-300/80 text-xs mt-1">
                  {mode === "create"
                    ? "Create a secure password using ColorKey visual authentication"
                    : "Enter your password using ColorKey visual authentication"}
                </p>
              </div>
            </div>
          </div>
        )}

        <div
          className={cn(
            "flex",
            hideDemo ? "flex-col" : "flex-col lg:flex-row"
          )}
        >
          <div
            className={cn(
              "flex-1 min-w-0",
              "border-b lg:border-b-0 lg:border-r border-gray-800"
            )}
          >
            {/* Main content wrapper with controls on the side */}
            <div className={cn(
              "flex h-full overflow-hidden",
              isMobile ? "flex-col" : "flex-row"
            )}>
              {/* Control Buttons Panel - Left Side on desktop, top on mobile */}
              <div className={cn(
                "flex gap-3 p-4 flex-shrink-0",
                isMobile
                  ? "flex-row justify-center flex-wrap border-b border-gray-800"
                  : "flex-col justify-center border-r border-gray-800 w-auto min-w-[160px]"
              )}>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Shuffle the current hyperplane
                    if (isActive && !isComplete && !isReplaying && hyperplane.length > 0) {
                      setHyperplane(shuffleArray(hyperplane));
                    }
                  }}
                  disabled={!isActive || isComplete || isReplaying}
                  size={isMobile ? "sm" : "default"}
                  className={cn(
                    "flex items-center gap-2 border-cyan-500 text-cyan-400 hover:bg-cyan-900/20 hover:text-cyan-300 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed",
                    !isMobile && "min-w-[140px]"
                  )}
                >
                  <Shuffle className="w-4 h-4" />
                  <span>Shuffle</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={handleBacktrack}
                  disabled={currentStep === 0}
                  size={isMobile ? "sm" : "default"}
                  className={cn(
                    "flex items-center gap-2 border-yellow-500 text-yellow-400 hover:bg-yellow-900/20 hover:text-yellow-300 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed",
                    !isMobile && "min-w-[140px]"
                  )}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Backspace</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={handleGameRestart}
                  disabled={!isActive}
                  size={isMobile ? "sm" : "default"}
                  className={cn(
                    "flex items-center gap-2 border-red-500 text-red-400 hover:bg-red-900/20 hover:text-red-300 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed",
                    !isMobile && "min-w-[140px]"
                  )}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </Button>

                {!isMobile && isActive && !isComplete && !isReplaying && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <Button
                      onClick={() => {
                        setIsGridFocused(true);
                        const gridElement = document.querySelector('[data-grid-container]') as HTMLElement;
                        gridElement?.focus();
                      }}
                      variant="outline"
                      size="sm"
                      className={cn(
                        "border transition-all",
                        isGridFocused
                          ? "border-blue-500/50 text-blue-300 bg-blue-900/20"
                          : "border-blue-500/30 text-blue-300 hover:text-blue-300 hover:bg-blue-900/30 hover:border-blue-400 bg-blue-900/10"
                      )}
                    >
                      <Keyboard className="w-3 h-3 mr-2" />
                      Keyboard
                    </Button>
                  </div>
                )}
              </div>

              {/* Main content area */}
              <div className="flex-1 p-4 sm:p-6 overflow-auto min-w-0 min-h-0 w-full">
            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <div>
                  <Label
                    htmlFor="master-password-input"
                    className="text-sm font-medium text-gray-300"
                  >
                    {mode === "create"
                      ? "Create Your Wallet Password"
                      : mode === "unlock"
                      ? "Enter Your Wallet Password"
                      : "Create a Password"}
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
                    <Label
                      htmlFor="login-password-input"
                      className="text-sm font-medium text-gray-300"
                    >
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


            {/* Main Grid Container with overflow protection */}
            <div className="flex justify-center overflow-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isReplaying ? `replay-${replayStep}-${numQuadrants}-${charsPerQuadrant}` : `step-${currentStep}-${numQuadrants}-${charsPerQuadrant}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="w-fit"
                >
                  <motion.div
                    animate={isComplete ? { scale: [1, 1.02, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div
                            key={`grid-${numQuadrants}-${charsPerQuadrant}`}
                            data-grid-container
                            className={cn(
                              "grid w-fit rounded-lg border-2 transition-all duration-300 cursor-pointer relative mx-auto",
                              charsPerQuadrant <= 4 ? "gap-6 sm:gap-8 p-8 sm:p-10" :
                              charsPerQuadrant <= 6 ? "gap-4 sm:gap-6 p-6 sm:p-8" :
                              charsPerQuadrant <= 9 ? "gap-3 sm:gap-4 p-4 sm:p-6" :
                              charsPerQuadrant <= 12 ? "gap-2 sm:gap-3 p-3 sm:p-4" :
                              "gap-2 p-2 sm:p-3",
                              !mouseEnabled && !isMobile && "cursor-not-allowed",
                              isGridFocused &&
                                isActive &&
                                !isComplete &&
                                !isReplaying
                                ? "border-blue-500/50 bg-blue-900/10 shadow-lg shadow-blue-500/20 ring-2 ring-blue-400/50"
                                : "border-cyan-400/40 bg-cyan-900/5 shadow-lg shadow-cyan-400/30 hover:border-cyan-400/60 hover:shadow-xl hover:shadow-cyan-400/40"
                            )}
                            animate={
                              !isGridFocused &&
                              isActive &&
                              !isComplete &&
                              !isReplaying
                                ? {
                                    boxShadow: [
                                      "0 4px 6px -1px rgba(34, 211, 238, 0.3), 0 2px 4px -1px rgba(34, 211, 238, 0.2), 0 0 20px rgba(34, 211, 238, 0.1)",
                                      "0 10px 15px -3px rgba(34, 211, 238, 0.4), 0 4px 6px -2px rgba(34, 211, 238, 0.3), 0 0 30px rgba(34, 211, 238, 0.2)",
                                      "0 4px 6px -1px rgba(34, 211, 238, 0.3), 0 2px 4px -1px rgba(34, 211, 238, 0.2), 0 0 20px rgba(34, 211, 238, 0.1)",
                                    ],
                                    borderColor: [
                                      "rgba(34, 211, 238, 0.4)",
                                      "rgba(34, 211, 238, 0.7)",
                                      "rgba(34, 211, 238, 0.4)",
                                    ],
                                  }
                                : {}
                            }
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            onClick={() =>
                              !isInputFocused && setIsGridFocused(true)
                            }
                            onBlur={() => setIsGridFocused(false)}
                            tabIndex={0}
                            style={{
                              gridTemplateColumns:
                                numQuadrants === 4
                                  ? 'repeat(2, 1fr)'
                                  : numQuadrants <= 6
                                  ? 'repeat(3, 1fr)'
                                  : numQuadrants <= 9
                                  ? 'repeat(3, 1fr)'
                                  : 'repeat(4, 1fr)',
                              touchAction: 'manipulation',
                              width: 'fit-content'
                            }}
                          >
                          {hyperplane
                            .slice(0, numQuadrants)
                            .map((quadrant, quadrantIndex) => (
                              <motion.button
                                key={`quadrant-${quadrantIndex}-${numQuadrants}-${charsPerQuadrant}`}
                                onClick={() =>
                                  handleQuadrantSelection(quadrantIndex)
                                }
                                animate={{
                                  x:
                                    showFeedback &&
                                    errorQuadrant === quadrantIndex
                                      ? [-5, 5, -5, 5, 0]
                                      : 0,
                                }}
                                transition={{ duration: 0.3 }}
                                className={cn(
                                  "aspect-square rounded-lg transition-all duration-200 relative overflow-hidden",
                                  getQuadrantPadding,
                                  "focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950",
                                  // Dynamic sizes - increase or maintain size as character count increases
                                  charsPerQuadrant <= 4 ? "min-h-[100px] min-w-[100px]" :
                                  charsPerQuadrant <= 6 ? "min-h-[120px] min-w-[120px]" :
                                  charsPerQuadrant <= 9 ? "min-h-[140px] min-w-[140px]" :
                                  charsPerQuadrant <= 12 ? "min-h-[160px] min-w-[160px]" :
                                  "min-h-[180px] min-w-[180px]",
                                  !isActive &&
                                    "bg-gray-800/20 border-gray-700/50 cursor-not-allowed",
                                  isActive &&
                                    !isComplete &&
                                    "bg-gray-800/30 border border-gray-700 hover:border-blue-500 hover:bg-blue-900/20 active:scale-95",
                                  showFeedback &&
                                    successQuadrant === quadrantIndex &&
                                    "border-green-500 bg-green-900/30",
                                  showFeedback &&
                                    isComplete &&
                                    "bg-green-800/20 border-green-700 cursor-default",
                                  showFeedback &&
                                    errorQuadrant === quadrantIndex &&
                                    "border-red-500",
                                  showFeedback &&
                                    keyboardSelection === quadrantIndex &&
                                    "border-blue-400 ring-2 ring-blue-400",
                                  flashErrorOnHyperplanes &&
                                    "animate-pulse border-red-500 shadow-lg shadow-red-500/50",
                                  !mouseEnabled && !isMobile && "pointer-events-none"
                                )}
                                style={{
                                  touchAction: 'manipulation'
                                }}
                                aria-label={`Select quadrant ${
                                  quadrantIndex + 1
                                }`}
                                disabled={!isActive || isComplete}
                              >
                                <div
                                  className={cn(
                                    "grid w-full h-full",
                                    charsPerQuadrant <= 4 ? "gap-2 p-1" :
                                    charsPerQuadrant <= 6 ? "gap-1.5 p-0.5" :
                                    charsPerQuadrant <= 9 ? "gap-1 p-0.5" :
                                    charsPerQuadrant <= 12 ? "gap-0.5 p-0.5" :
                                    "gap-0.5 p-0"
                                  )}
                                  style={{
                                    gridTemplateColumns: characterGridCols,
                                  }}
                                >
                                  {(() => {
                                    console.log(`Rendering quadrant ${quadrantIndex} with ${quadrant.length} characters:`, quadrant);
                                    return quadrant.map((char, charIndex) => (
                                    <div
                                      key={`char-${charIndex}-${charsPerQuadrant}`}
                                      className="aspect-square flex items-center justify-center rounded-sm bg-black/10 border border-white/5 overflow-hidden min-h-[20px] min-w-[20px]"
                                    >
                                      <span
                                        className={cn(
                                          "font-mono pointer-events-none leading-none",
                                          getCharacterCellSize,
                                          isActive
                                            ? "text-gray-400"
                                            : "text-gray-600"
                                        )}
                                        aria-hidden="true"
                                      >
                                        {char}
                                      </span>
                                    </div>
                                  ));
                                  })()}
                                </div>
                                {/* Hyperplane Number Indicator */}
                                <div className="absolute bottom-1 right-1 bg-gray-800/80 text-gray-300 text-xs rounded px-1 py-0.5 pointer-events-none">
                                  {quadrantIndex + 1}
                                </div>
                              </motion.button>
                            ))}
                        </motion.div>
                      </TooltipTrigger>
                      {!isMobile && !mouseEnabled && !isGridFocused && (
                        <TooltipContent>
                          <p>Click "Keyboard" button to use arrow keys</p>
                        </TooltipContent>
                      )}
                      {!isMobile && !mouseEnabled && isGridFocused && (
                        <TooltipContent>
                          <p>Use arrow keys to select quadrants</p>
                        </TooltipContent>
                      )}
                      {isMobile && (
                        <TooltipContent>
                          <p>Tap quadrants to select</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </motion.div>
              </motion.div>
            </AnimatePresence>
            </div>

            {/* Submit Button - Below the grid for better visibility */}
            {isActive && loginPassword.length > 0 && (
              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  onClick={handleSubmit}
                  disabled={!isActive}
                  className="min-w-[200px] border-purple-500 text-purple-400 hover:bg-purple-900/20 hover:text-purple-300 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Submit Password
                </Button>
              </div>
            )}

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
            </div>
          </div>

          {!hideDemo && (
            <div className="w-full lg:w-80 lg:flex-shrink-0 bg-gray-900 p-4 sm:p-6 overflow-y-auto">
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
                        onValueChange={(v) => {
                          setNumQuadrants(v[0]);
                          // Clear existing hyperplane and force regeneration
                          setHyperplane([]);
                          if (isActive && isMounted) {
                            setTimeout(() => generateNextHyperplane(currentStep), 0);
                          }
                        }}
                        min={4}
                        max={10}
                        step={1}
                      />
                      <SettingsSlider
                        label="Characters per Hyperplane"
                        value={charsPerQuadrant}
                        onValueChange={(v) => {
                          setCharsPerQuadrant(Math.min(v[0], 12));
                          // Clear existing hyperplane and force regeneration
                          setHyperplane([]);
                          if (isActive && isMounted) {
                            setTimeout(() => generateNextHyperplane(currentStep), 0);
                          }
                        }}
                        min={4}
                        max={12}
                        step={1}
                      />
                      <div className="space-y-2 rounded-lg border border-gray-800 p-3 bg-gray-900/50">
                        <Label className="text-gray-300 text-sm">
                          Character Sets
                        </Label>
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
                            <span className="font-medium">
                              Why ColorKey is More Secure
                            </span>
                          </div>
                          <div
                            className={cn(
                              "transition-transform duration-200",
                              showMathDetails ? "rotate-180" : ""
                            )}
                          >
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
                                  <h4 className="text-cyan-400 font-semibold mb-2">
                                    Security Comparison
                                  </h4>
                                  <div className="space-y-2">
                                    <div>
                                      <span className="text-gray-300">
                                        Traditional password guessing:
                                      </span>
                                      <div className="font-mono text-gray-500">
                                        {(62 ** 12).toExponential(1)} attempts needed
                                      </div>
                                    </div>
                                    <div>
                                      <span className="text-cyan-300">
                                        ColorKey attack difficulty:
                                      </span>
                                      <div className="font-mono text-cyan-400">
                                        {((numQuadrants ** 12) * (charsPerQuadrant ** 12)).toExponential(1)} attempts needed
                                      </div>
                                    </div>
                                    <div className="pt-2 border-t border-gray-700">
                                      <span className="text-green-400 font-medium">
                                        🔒 {(((numQuadrants ** 12) * (charsPerQuadrant ** 12)) / (62 ** 12)).toExponential(1)}x harder to crack
                                      </span>
                                      <div className="text-xs text-gray-400 mt-1">
                                        Requires both password knowledge AND visual layout memory
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <span>
                                      Attacker needs both password AND correct quadrant positions (1 in {numQuadrants} chance per character)
                                    </span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <span>
                                      Layouts randomize dynamically - replay attacks impossible
                                    </span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <span>
                                      Screen recording and keyloggers become
                                      useless
                                    </span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <span>
                                      Visual memory required - resistant to
                                      shoulder surfing
                                    </span>
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
          )}
        </div>
        {history.length > 0 && (
          <CardFooter className="flex justify-center bg-gray-900/50 border-t border-gray-800 p-4 sm:p-6">
            {isReplaying ? (
              <Button
                variant="outline"
                onClick={handleStopReplay}
                className="min-w-[140px] border-cyan-500 text-cyan-400 hover:bg-cyan-900/20 hover:text-cyan-300 bg-transparent"
              >
                <StopCircle className="w-4 h-4 mr-2" /> Stop Replay
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handleReplay}
                disabled={history.length === 0}
                className="min-w-[140px] border-cyan-500 text-cyan-400 hover:bg-cyan-900/20 hover:text-cyan-300 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <History className="w-4 h-4 mr-2" /> Replay History
              </Button>
            )}
          </CardFooter>
        )}
      </fieldset>
    </Card>
    </div>
  );
}

const KeyMappingLegend = ({
  keyMap,
  pressedKey,
}: {
  keyMap: { [key: string]: number };
  pressedKey: string | null;
}) => {
  const isArrowMapping = "arrowup" in keyMap;
  const quadrantNames = [
    "Top Left",
    "Top Right",
    "Bottom Left",
    "Bottom Right",
  ];

  const renderKey = (key: string, quadrant: number) => {
    const displayKey = key.startsWith("arrow") ? key.replace("arrow", "") : key;
    const Icon =
      key === "arrowup"
        ? ArrowUp
        : key === "arrowright"
        ? ArrowRight
        : key === "arrowdown"
        ? ArrowDown
        : ArrowLeft;
    const quadrantName = `Quadrant ${quadrant + 1}`;

    return (
      <div
        key={key}
        className={cn(
          "flex items-center gap-1.5 border border-gray-700 bg-gray-800/30 rounded-md px-2 py-1 transition-all duration-100",
          pressedKey === key.toUpperCase() &&
            "bg-blue-500/50 ring-2 ring-blue-400"
        )}
      >
        {isArrowMapping ? (
          <Icon className="w-3 h-3" />
        ) : (
          <span className="font-mono font-bold w-3 text-center">
            {displayKey.toUpperCase()}
          </span>
        )}
        <span className="text-gray-500">→</span>
        <span className="text-gray-300">{quadrantName}</span>
      </div>
    );
  };

  return (
    <div className="text-center space-y-2">
      <h4 className="text-sm font-medium text-gray-400">Keyboard Mappings</h4>
      <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
        {Object.entries(keyMap).map(([key, quadrant]) =>
          renderKey(key, quadrant)
        )}
      </div>
    </div>
  );
};

const SettingsToggle = ({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) => (
  <div className="flex items-center justify-between rounded-lg border border-gray-800 p-3 bg-gray-900/50 first:mt-2">
    <Label htmlFor={id} className="text-gray-300 cursor-pointer text-sm">
      {label}
    </Label>
    <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
  </div>
);

const SettingsSlider = ({
  label,
  value,
  onValueChange,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  onValueChange: (value: number[]) => void;
  min: number;
  max: number;
  step: number;
}) => (
  <div className="rounded-lg border border-gray-800 p-3 bg-gray-900/50 space-y-3">
    <div className="flex justify-between items-center">
      <Label className="text-gray-300 text-sm">{label}</Label>
      <span className="text-sm font-bold text-blue-400">{value}</span>
    </div>
    <Slider
      value={[value]}
      onValueChange={onValueChange}
      min={min}
      max={max}
      step={step}
    />
  </div>
);
