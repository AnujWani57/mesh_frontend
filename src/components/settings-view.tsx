import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/lib/theme/theme-context";
import { DEFAULT_THRESHOLDS, SETTINGS_STORAGE_KEY } from "@/lib/config";
import { loadThresholds, saveThresholds } from "@/lib/thresholds";
import type { Role, Thresholds } from "@/lib/types";

interface GeneralSettings {
  language: string;
  refresh: string;
  emailNotif: boolean;
  smsNotif: boolean;
  soundNotif: boolean;
}

const DEFAULT_SETTINGS: GeneralSettings = {
  language: "English",
  refresh: "10",
  emailNotif: true,
  smsNotif: false,
  soundNotif: true,
};

export function SettingsView({ role }: { role: Role }) {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<GeneralSettings>(DEFAULT_SETTINGS);
  const [thresholds, setThresholds] = useState<Thresholds>(DEFAULT_THRESHOLDS);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (raw) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setThresholds(loadThresholds());
  }, []);

  const persist = (next: GeneralSettings) => {
    setSettings(next);
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
  };

  const saveThreshold = () => {
    saveThresholds(thresholds);
    toast.success("Threshold values saved");
  };

  const updateThreshold = (path: string, value: number) => {
    setThresholds((t) => {
      const next = structuredClone(t) as Record<string, Record<string, number>>;
      const [group, key] = path.split(".");
      next[group][key] = value;
      return next as unknown as Thresholds;
    });
  };

  return (
    <div>
      <PageHeader title="Settings" description="Preferences, notifications and thresholds." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <Label>Theme</Label>
              <Select value={theme} onValueChange={(v) => setTheme(v as "light" | "dark")}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label>Language</Label>
              <Select
                value={settings.language}
                onValueChange={(v) => persist({ ...settings, language: v })}
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label>Dashboard refresh</Label>
              <Select
                value={settings.refresh}
                onValueChange={(v) => persist({ ...settings, refresh: v })}
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 seconds</SelectItem>
                  <SelectItem value="10">10 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Toggle
              label="Email notifications"
              checked={settings.emailNotif}
              onChange={(v) => persist({ ...settings, emailNotif: v })}
            />
            <Toggle
              label="SMS notifications"
              checked={settings.smsNotif}
              onChange={(v) => persist({ ...settings, smsNotif: v })}
            />
            <Toggle
              label="Sound alerts"
              checked={settings.soundNotif}
              onChange={(v) => persist({ ...settings, soundNotif: v })}
            />
          </CardContent>
        </Card>

        {role === "supervisor" && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Gas Threshold Values</CardTitle>
              <p className="text-sm text-muted-foreground">
                Set warning and critical limits used across the dashboard.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <ThresholdField label="Temperature Warning (°C)" value={thresholds.temperature.warning} onChange={(v) => updateThreshold("temperature.warning", v)} />
                <ThresholdField label="Temperature Critical (°C)" value={thresholds.temperature.critical} onChange={(v) => updateThreshold("temperature.critical", v)} />
                <ThresholdField label="Humidity Warning (%)" value={thresholds.humidity.warning} onChange={(v) => updateThreshold("humidity.warning", v)} />
                <ThresholdField label="Humidity Critical (%)" value={thresholds.humidity.critical} onChange={(v) => updateThreshold("humidity.critical", v)} />
                <ThresholdField label="Methane Warning (ppm)" value={thresholds.methane.warning} onChange={(v) => updateThreshold("methane.warning", v)} />
                <ThresholdField label="Methane Critical (ppm)" value={thresholds.methane.critical} onChange={(v) => updateThreshold("methane.critical", v)} />
                <ThresholdField label="CO Warning (ppm)" value={thresholds.carbonMonoxide.warning} onChange={(v) => updateThreshold("carbonMonoxide.warning", v)} />
                <ThresholdField label="CO Critical (ppm)" value={thresholds.carbonMonoxide.critical} onChange={(v) => updateThreshold("carbonMonoxide.critical", v)} />
                <ThresholdField label="Oxygen Warning Low (%)" value={thresholds.oxygen.warningLow} onChange={(v) => updateThreshold("oxygen.warningLow", v)} />
                <ThresholdField label="Oxygen Critical Low (%)" value={thresholds.oxygen.criticalLow} onChange={(v) => updateThreshold("oxygen.criticalLow", v)} />
                <ThresholdField label="Oxygen Warning High (%)" value={thresholds.oxygen.warningHigh} onChange={(v) => updateThreshold("oxygen.warningHigh", v)} />
                <ThresholdField label="Oxygen Critical High (%)" value={thresholds.oxygen.criticalHigh} onChange={(v) => updateThreshold("oxygen.criticalHigh", v)} />
              </div>
              <Button className="mt-5" onClick={saveThreshold}>
                Save thresholds
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <Label>{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function ThresholdField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
