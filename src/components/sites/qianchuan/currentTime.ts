"use client";

import { useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

export function refreshCurrentTime() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) timer = setInterval(refreshCurrentTime, 1000);
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

// Minute-level snapshot stays stable between ticks and avoids hydration mismatch.
const getSnapshot = () => Math.floor(Date.now() / 60000) * 60000;
const getServerSnapshot = () => 0;
const pad = (value: number) => String(value).padStart(2, "0");

export function useCurrentTime() {
  const timestamp = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const date = new Date(timestamp);
  return {
    timestamp,
    today: timestamp ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` : "",
    label: timestamp ? `${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}` : "--",
  };
}
