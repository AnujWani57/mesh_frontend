import { DEFAULT_THRESHOLDS, THRESHOLDS_STORAGE_KEY } from "./config";
import type { HealthStatus, SensorReadings, Thresholds } from "./types";

export function loadThresholds(): Thresholds {
  if (typeof window === "undefined") return DEFAULT_THRESHOLDS;
  try {
    const raw = window.localStorage.getItem(THRESHOLDS_STORAGE_KEY);
    if (!raw) return DEFAULT_THRESHOLDS;
    return { ...DEFAULT_THRESHOLDS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_THRESHOLDS;
  }
}

export function saveThresholds(t: Thresholds) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THRESHOLDS_STORAGE_KEY, JSON.stringify(t));
}

type Metric = keyof SensorReadings;

export function evaluateMetric(
  metric: Metric,
  value: number,
  t: Thresholds = DEFAULT_THRESHOLDS,
): HealthStatus {
  switch (metric) {
    case "temperature":
      if (value >= t.temperature.critical) return "critical";
      if (value >= t.temperature.warning) return "warning";
      return "safe";
    case "humidity":
      if (value >= t.humidity.critical) return "critical";
      if (value >= t.humidity.warning) return "warning";
      return "safe";
    case "methane":
      if (value >= t.methane.critical) return "critical";
      if (value >= t.methane.warning) return "warning";
      return "safe";
    case "carbonMonoxide":
      if (value >= t.carbonMonoxide.critical) return "critical";
      if (value >= t.carbonMonoxide.warning) return "warning";
      return "safe";
    case "oxygen":
      if (value <= t.oxygen.criticalLow || value >= t.oxygen.criticalHigh) return "critical";
      if (value <= t.oxygen.warningLow || value >= t.oxygen.warningHigh) return "warning";
      return "safe";
    default:
      return "safe";
  }
}

export function evaluateReadings(
  readings: SensorReadings,
  t: Thresholds = DEFAULT_THRESHOLDS,
): HealthStatus {
  const statuses = (Object.keys(readings) as Metric[]).map((m) =>
    evaluateMetric(m, readings[m], t),
  );
  if (statuses.includes("critical")) return "critical";
  if (statuses.includes("warning")) return "warning";
  return "safe";
}

export const METRIC_META: Record<
  Metric,
  { label: string; unit: string; icon: string }
> = {
  temperature: { label: "Temperature", unit: "°C", icon: "thermometer" },
  humidity: { label: "Humidity", unit: "%", icon: "droplets" },
  methane: { label: "Methane (CH₄)", unit: "ppm", icon: "flame" },
  carbonMonoxide: { label: "Carbon Monoxide (CO)", unit: "ppm", icon: "wind" },
  oxygen: { label: "Oxygen (O₂)", unit: "%", icon: "activity" },
};
