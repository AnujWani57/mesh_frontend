import { Activity, Droplets, Flame, Thermometer, Wind } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SensorReadings } from "@/lib/types";
import { evaluateMetric, loadThresholds } from "@/lib/thresholds";

const METRICS = [
  { key: "temperature", label: "Temperature", unit: "°C", icon: Thermometer },
  { key: "humidity", label: "Humidity", unit: "%", icon: Droplets },
  { key: "methane", label: "Methane", unit: "ppm", icon: Flame },
  { key: "carbonMonoxide", label: "Carbon Monoxide", unit: "ppm", icon: Wind },
  { key: "oxygen", label: "Oxygen", unit: "%", icon: Activity },
] as const;

export function ReadingCards({ readings }: { readings: SensorReadings }) {
  const thresholds = loadThresholds();
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {METRICS.map(({ key, label, unit, icon: Icon }) => {
        const value = readings[key];
        const status = evaluateMetric(key, value, thresholds);
        return (
          <Card key={key} className="p-4">
            <div className="flex items-center justify-between">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  status === "safe" && "bg-safe",
                  status === "warning" && "bg-warning",
                  status === "critical" && "bg-critical",
                )}
              />
            </div>
            <p className="mt-3 text-xl font-bold">
              {value}
              <span className="ml-1 text-sm font-medium text-muted-foreground">{unit}</span>
            </p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </Card>
        );
      })}
    </div>
  );
}
