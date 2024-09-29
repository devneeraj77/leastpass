import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const PasswordGenerator = () => {
  const [passwordLength, setPasswordLength] = useState<number>(12);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [generatedPassword, setGeneratedPassword] = useState<string>("");
  const [passwordStrength, setPasswordStrength] = useState<
    "Very Weak" | "Weak" | "Medium" | "Strong"
  >("Very Weak");

  // shadcn toast hook
  const { toast } = useToast();

  const generatePassword = () => {
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let characterPool = lowercaseChars;
    if (includeUppercase) characterPool += uppercaseChars;
    if (includeNumbers) characterPool += numberChars;
    if (includeSymbols) characterPool += symbolChars;

    let password = "";
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * characterPool.length);
      password += characterPool[randomIndex];
    }

    setGeneratedPassword(password);
    evaluatePasswordStrength(password);
  };

  const evaluatePasswordStrength = (password: string) => {
    let strengthPoints = 0;

    if (password.length >= 8) strengthPoints++;
    if (/[A-Z]/.test(password)) strengthPoints++;
    if (/[0-9]/.test(password)) strengthPoints++;
    if (/[^A-Za-z0-9]/.test(password)) strengthPoints++;

    if (strengthPoints === 0) {
      setPasswordStrength("Very Weak");
    } else if (strengthPoints === 1) {
      setPasswordStrength("Weak");
    } else if (strengthPoints === 2 || strengthPoints === 3) {
      setPasswordStrength("Medium");
    } else {
      setPasswordStrength("Strong");
    }
  };

  // Copy password to clipboard and show toast
  const copyToClipboard = () => {
    if (generatedPassword) {
      navigator.clipboard
        .writeText(generatedPassword)
        .then(() => {
          toast({
            title: "Success",
            description: "Your password has been copied to the clipboard.",
            variant: "success",
          });
        })
        .catch(() => {
          toast({
            title: "Error",
            description: "Failed to copy password.",
            variant: "destructive",
          });
        });
    }
  };

  // Generate password on page load
  useEffect(() => {
    generatePassword();
  }, []);

  // Dynamically calculate the width and color of the strength bar
  const getStrengthBarProperties = () => {
    switch (passwordStrength) {
      case "Very Weak":
        return { width: "25%", backgroundColor: "#f87171" }; // Red for Very Weak
      case "Weak":
        return { width: "50%", backgroundColor: "#facc15" }; // Yellow for Weak
      case "Medium":
        return { width: "75%", backgroundColor: "#60a5fa" }; // Blue for Medium
      case "Strong":
        return { width: "100%", backgroundColor: "#34d399" }; // Green for Strong
      default:
        return { width: "25%", backgroundColor: "#f87171" }; // Default to Very Weak
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Dynamic Password Generator</h1>

      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <label className="block mb-2">Password Length: {passwordLength}</label>
        <input
          type="range"
          min="6"
          max="20"
          value={passwordLength}
          onChange={(e) => setPasswordLength(Number(e.target.value))}
          className="w-full mb-4"
        />

        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={includeUppercase}
            onChange={(e) => setIncludeUppercase(e.target.checked)}
            className="mr-2"
          />
          Include Uppercase Letters
        </label>

        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
            className="mr-2"
          />
          Include Numbers
        </label>

        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
            className="mr-2"
          />
          Include Symbols
        </label>

        <button
          onClick={generatePassword}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Generate Password
        </button>

        {generatedPassword && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p className="text-lg font-semibold">Generated Password:</p>
            <p className="text-sm text-gray-700 break-all">
              {generatedPassword}
            </p>

            {/* Copy button */}
            <Button className="mt-2" onClick={copyToClipboard}>
              Copy Password
            </Button>
          </div>
        )}

        {/* Password Strength Indicator */}
        {generatedPassword && (
          <div className="mt-4">
            <p className="text-sm font-semibold">
              Password Strength: {passwordStrength}
            </p>
            <div className="w-full h-2 rounded bg-gray-300 mt-2">
              <motion.div
                className="h-full rounded"
                initial={{ width: "0%" }}
                animate={getStrengthBarProperties()}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordGenerator;
