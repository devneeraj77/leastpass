"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { IconCopy, IconRefresh } from "@tabler/icons-react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { Checkbox, FormControlLabel } from "@mui/material";

const PasswordGenerator = () => {
  const [passwordLength, setPasswordLength] = useState<number>(12);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [generatedPassword, setGeneratedPassword] = useState<string>("");
  const [passwordStrength, setPasswordStrength] = useState<
    "Very Weak" | "Weak" | "Medium" | "Strong"
  >("Very Weak");

  const handleChange = (event: Event, newValue: number | number[]) => {
    setPasswordLength(newValue as number);
  };

  const handleChangeCheckboxU = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIncludeUppercase(event.target.checked);
  };

  const handleChangeCheckboxN = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIncludeNumbers(event.target.checked);
  };

  const handleChangeCheckboxS = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIncludeSymbols(event.target.checked);
  };

  const { toast } = useToast();

  // Memoize generatePassword with useCallback
  const generatePassword = useCallback(() => {
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
  }, [includeUppercase, includeNumbers, includeSymbols, passwordLength]);

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

  const copyToClipboard = () => {
    if (generatedPassword) {
      navigator.clipboard
        .writeText(generatedPassword)
        .then(() => {
          toast({
            title: "Success",
            description: "Your password has been copied to the clipboard.",
            variant: "default",
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

  const [rotation, setRotation] = useState(0);

  const handleClick = () => {
    setRotation((prev) => prev + 360);
  };

  // Generate password on page load
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

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
    <div className="flex flex-col items-center text-tp justify-center gap-4 bg-Backg w-80 md:w-[44vw] border-accent">
      <div className="h-32 bg-backgMuted w-full flex flex-col justify-between rounded-t-xl rounded-b-sm border-accent">
        <div className="mt-4 flex gap-2 px-4">
          <div className="basis-10/12 border-br py-2 m-auto rounded-md flex items-center overflow-x-hidden">
            {generatedPassword && (
              <p className="text-sm text-tAccent md:text-xl px-4 h-12 truncate whitespace-nowrap">
                {generatedPassword}
              </p>
            )}
          </div>

          <div className="basis-1/6 border-br rounded-md gap-1 flex">
            <Button
              className="text-tp bg-secondary font-bold transition duration-200 hover:bg-transpMuted hover:text-tMuted active:text-tAccent border-2 border-transparent active:bg-transLight shadow-none"
              onClick={copyToClipboard}
            >
              <IconCopy />
            </Button>
            <Button
              onClick={generatePassword}
              className="text-tp bg-secondary font-bold transition duration-200 hover:bg-transpMuted hover:text-tMuted active:text-tAccent border-2 border-transparent active:bg-transLight shadow-none"
            >
              <motion.div
                className="text-tp font-bold hover:bg-transpMuted hover:text-tMuted active:text-tAccent border-2 border-transparent"
                onClick={handleClick}
                animate={{ rotate: rotation }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <IconRefresh />
              </motion.div>
            </Button>
          </div>
        </div>

        {generatedPassword && (
          <div className="mt-4">
            <p className="text-sm font-semibold px-4">{passwordStrength}</p>
            <div className="w-full h-1 rounded mt-2">
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

      <div className="bg-backgMuted p-8 rounded w-full">
        <label className="block mb-2">Password Length: {passwordLength}</label>
        <Box>
          <Slider
            value={passwordLength}
            min={6}
            max={50}
            defaultValue={50}
            onChange={handleChange}
            aria-labelledby="password-length-slider"
            valueLabelDisplay="auto"
            sx={{
              color: "rgb(134, 186, 144)",
              "& .MuiSlider-thumb": {
                borderRadius: "9999px",
                backgroundColor: "rgb(8, 15, 15)",
              },
              "& .MuiSlider-track": {
                backgroundColor: "rgb(255, 252, 255)",
              },
              "& .MuiSlider-rail": {
                backgroundColor: "rgba(134, 186, 144, 0.5)",
              },
            }}
          />
        </Box>

        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={includeUppercase}
                onChange={handleChangeCheckboxU}
                color="default"
                sx={{
                  color: "rgb(8, 15, 15)",
                  "&.Mui-checked": {
                    color: "rgb(134, 186, 144)",
                  },
                }}
              />
            }
            label="Include Uppercase Letters"
            className="flex items-center"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={includeNumbers}
                onChange={handleChangeCheckboxN}
                color="default"
                sx={{
                  color: "rgb(8, 15, 15)",
                  "&.Mui-checked": {
                    color: "rgb(134, 186, 144)",
                  },
                }}
              />
            }
            label="Include Numbers"
            className="flex items-center"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={includeSymbols}
                onChange={handleChangeCheckboxS}
                color="default"
                sx={{
                  color: "rgb(8, 15, 15)",
                  "&.Mui-checked": {
                    color: "rgb(134, 186, 144)",
                  },
                }}
              />
            }
            label="Include Symbols"
            className="flex items-center"
          />
        </Box>
        <button
          onClick={generatePassword}
          className="px-8 py-2 mt-4 w-full rounded-md bg-secondary text-tp font-bold transition duration-200 hover:bg-transpMuted hover:text-tMuted active:text-tAccent border-2 border-transparent active:bg-transLight   hover:border-brh"
        >
          Invert it
        </button>
      </div>
    </div>
  );
};

export default PasswordGenerator;
