import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const useLocalStorage = <T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState(initialValue);

  useEffect(() => {
    // Retrieve from localStorage
    const item = window.localStorage.getItem(key);
    if (item) {
      setStoredValue(JSON.parse(item));
    } else if (key === "clientKey") {
      const newClientKey = uuidv4();
      window.localStorage.setItem(key, JSON.stringify(newClientKey));
      setStoredValue(newClientKey as unknown as T);
    }
  }, [key]);

  const setValue = (value: T) => {
    // Save state
    setStoredValue(value);
    // Save to localStorage
    window.localStorage.setItem(key, JSON.stringify(value));
  };
  return [storedValue, setValue];
};

export default useLocalStorage;
