import { useEffect, useState } from "react";
import { generateClientKey } from "@/lib/clientKey";

const useLocalStorage = <T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState(initialValue);

  useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage) {
      console.error("localStorage is not defined");
      return;
    }

    // Retrieve from localStorage
    const item = window.localStorage.getItem(key);
    if (item) {
      setStoredValue(JSON.parse(item));
    } else if (key === "clientKey") {
      const newClientKey = generateClientKey();
      window.localStorage.setItem(key, JSON.stringify(newClientKey));
      setStoredValue(newClientKey as unknown as T);
    }
  }, [key]);

  const setValue = (value: T) => {
    if (typeof window === "undefined" || !window.localStorage) {
      console.error("localStorage is not defined");
      return;
    }

    // Save state
    setStoredValue(value);
    // Save to localStorage
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  const generateClientKey = () => {
    if (typeof window === "undefined" || !window.localStorage) {
      console.error("localStorage is not defined");
      return;
    }

    let clientKey = window.localStorage.getItem("clientKey");
    if (!clientKey) {
      clientKey = generateClientKey();
      window.localStorage.setItem("clientKey", clientKey);
    }
    return clientKey;
  };

  const getClientKey = () => {
    if (typeof window === "undefined" || !window.localStorage) {
      console.error("localStorage is not defined");
      return null;
    }

    return window.localStorage.getItem("clientKey");
  };

  return [storedValue, setValue, generateClientKey, getClientKey];
};

export default useLocalStorage;
