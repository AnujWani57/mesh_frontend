import type { Thresholds } from "./types";

// Runtime configuration read from Vite env vars.
// Set VITE_USE_DUMMY_API=false and VITE_API_BASE_URL to switch to a real backend.
export const config = {
  useDummyApi: import.meta.env.VITE_USE_DUMMY_API !== "false",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "",
  // simulated network latency for dummy mode (ms)
  dummyLatency: 350,
};

// Default gas / environment thresholds (see API_DOCUMENTATION.md).
// Persisted to localStorage so users can override them in Settings.
export const DEFAULT_THRESHOLDS: Thresholds = {
  temperature: { warning: 36, critical: 45 },
  humidity: { warning: 71, critical: 85 },
  methane: { warning: 1000, critical: 5000 },
  carbonMonoxide: { warning: 25, critical: 50 },
  oxygen: { warningLow: 19.5, criticalLow: 18, warningHigh: 23.5, criticalHigh: 25 },
};

export const THRESHOLDS_STORAGE_KEY = "minemesh.thresholds";
export const SESSION_STORAGE_KEY = "minemesh.session";
export const THEME_STORAGE_KEY = "minemesh.theme";
export const SETTINGS_STORAGE_KEY = "minemesh.settings";
