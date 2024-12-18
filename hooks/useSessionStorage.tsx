"use client";

import { useEffect, useState } from "react";

export function useSessionStorage<T>(key: string, data: T) {
  const [value, setValue] = useState<T>(data);

  useEffect(() => {
    const storedValue = sessionStorage.getItem(key);
    if (storedValue) {
      setValue(JSON.parse(storedValue));
    }
  }, [key]);

  const updateValue = (newValue: T) => {
    setValue(newValue);
    sessionStorage.setItem(key, JSON.stringify(newValue));
  };

  return { value, updateValue };
}
