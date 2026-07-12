import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAlertById } from "@/hooks/use-api";
import type { AlertThresholds, SensorReadings } from "@/lib/types";
import {
  AlertTriangle,
  User,
  MapPin,
  Clock,
  Cpu,
  Network,
  Thermometer,
  Droplets,
  Wind,
  Flame,
  Activity,
  CheckCircle2,
  Layers,
} from "lucide-react";

interface AlertDetailDialogProps {
  alertId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── small helpers ──────────────────────────────────────────────────────────

type ReadingLevel = "critical" | "warning" | "safe";

function tempLevel(v: number, t: AlertThresholds): ReadingLevel {
  if (v >= t.temperatureCritical) return "critical";
  if (v >= t.temperatureWarning) return "warning";
  return "safe";
}
function humidityLevel(v: number, t: AlertThresholds): ReadingLevel {
  if (v >= t.humidityCritical) return "critical";
  if (v >= t.humidityWarning) return "warning";
  return "safe";
}
function methaneLevel(v: number, t: AlertThresholds): ReadingLevel {
  if (v >= t.methaneCritical) return "critical";
  if (v >= t.methaneWarning) return "warning";
  return "safe";
}
function coLevel(v: number, t: AlertThresholds): ReadingLevel {
  if (v >= t.coCritical) return "critical";
  if (v >= t.coWarning) return "warning";
  return "safe";
}
function oxygenLevel(v: number, t: AlertThresholds): ReadingLevel {
  if (v <= t.oxygenCriticalLow || v >= t.oxygenCriticalHigh) return "critical";
  if (v <= t.oxygenWarningLow || v >= t.oxygenWarningHigh) return "warning";
  return "safe";
}

const levelStyles: Record<ReadingLevel, { bar: string; text: string; bg: string; border: string; badge: string }> = {
  critical: {
    bar: "bg-red-500",
    text: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    badge: "bg-red-500/15 text-red-400 border-red-500/30",
  },
  warning: {
    bar: "bg-amber-400",
    text: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/30",
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  safe: {
    bar: "bg-emerald-500",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
};

// ─── ReadingCard ─────────────────────────────────────────────────────────────

function ReadingCard({
  icon: Icon,
  label,
  value,
  unit,
  level,
  barPct,
  thresholdLabel,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  unit: string;
  level: ReadingLevel;
  barPct: number; // 0-100
  thresholdLabel: string;
}) {
  const s = levelStyles[level];
  return (
    <div
      className={`rounded-xl border p-3 flex flex-col gap-2 ${s.bg} ${s.border}`}
    >
      {/* top row: icon + label + badge */}
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <Icon className={`h-3.5 w-3.5 ${s.text}`} />
          {label}
        </div>
        <span
          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${s.badge}`}
        >
          {level}
        </span>
      </div>

      {/* value */}
      <div className={`text-2xl font-bold tabular-nums leading-none ${s.text}`}>
        {value.toLocaleString(undefined, { maximumFractionDigits: 1 })}
        <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>
      </div>

      {/* bar */}
      <div className="h-1.5 w-full rounded-full bg-muted/40 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${s.bar}`}
          style={{ width: `${Math.min(barPct, 100)}%` }}
        />
      </div>

      {/* threshold hint */}
      <p className="text-[10px] text-muted-foreground">{thresholdLabel}</p>
    </div>
  );
}

// ─── SeverityBadge / StateBadge ─────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: string }) {
  const cls =
    severity === "critical"
      ? "bg-red-500/15 text-red-400 border-red-500/30"
      : severity === "warning"
        ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
        : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${cls}`}
    >
      {severity}
    </span>
  );
}

function StateBadge({ state }: { state: string }) {
  const cls =
    state === "active"
      ? "bg-red-500/15 text-red-400 border-red-500/30"
      : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${cls}`}
    >
      {state === "active" ? (
        <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
      ) : (
        <CheckCircle2 className="h-3 w-3" />
      )}
      {state}
    </span>
  );
}

// ─── InfoItem ────────────────────────────────────────────────────────────────

function InfoItem({
  icon: Icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <span className={`text-sm font-medium ${mono ? "font-mono" : ""}`}>
        {value ?? "—"}
      </span>
    </div>
  );
}

// ─── helpers to compute bar % ────────────────────────────────────────────────

function pct(value: number, min: number, max: number) {
  return Math.max(0, ((value - min) / (max - min)) * 100);
}

// ─── Main component ──────────────────────────────────────────────────────────

export function AlertDetailDialog({
  alertId,
  open,
  onOpenChange,
}: AlertDetailDialogProps) {
  const { data: alert, isLoading, isError } = useAlertById(open ? alertId : null);

  const isSos = alert?.hazard === "SOS Button Pressed";
  const r: SensorReadings | undefined = alert?.readings;
  const t: AlertThresholds | undefined = alert?.thresholds;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`w-full max-h-[92vh] overflow-y-auto p-0 transition-all ${isSos ? "max-w-lg" : "max-w-4xl"}`}>
        {/* ── Header ── */}
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-border/50">
          <DialogTitle className="flex items-center gap-2 text-base">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 border border-amber-500/30">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
            </span>
            Alert Details
            {alert && (
              <span className="ml-auto text-xs font-mono text-muted-foreground">
                {alert.id}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* ── Loading ── */}
        {isLoading && (
          <div className="grid grid-cols-2 gap-4 p-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        )}

        {/* ── Error ── */}
        {isError && (
          <p className="py-10 text-center text-sm text-destructive px-6">
            Failed to load alert details.
          </p>
        )}

        {/* ── Content ── */}
        {alert && (
          <div className="p-6 space-y-6">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <SeverityBadge severity={alert.severity} />
              <StateBadge state={alert.state} />
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-mono font-medium bg-muted/40 border-border text-foreground">
                {alert.hazard}
              </span>
            </div>

            {/* ── Main grid: 2-col for sensor alerts, 1-col for SOS ── */}
            <div className={`grid gap-6 ${isSos ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"}`}>

              {/* LEFT: Identity */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Identity
                </p>
                <div className="rounded-xl border border-border/60 bg-muted/20 p-4 grid grid-cols-2 gap-x-6 gap-y-4">
                  <InfoItem icon={User} label="Worker" value={alert.workerName} />
                  <InfoItem icon={Cpu} label="Device" value={alert.deviceId} mono />
                  <InfoItem icon={Network} label="Node" value={alert.nodeId} mono />
                  <InfoItem icon={Layers} label="Sector" value={alert.sectorId} mono />
                  <InfoItem
                    icon={Clock}
                    label="Time"
                    value={new Date(alert.time).toLocaleString()}
                  />
                  {alert.state === "resolved" && (
                    <InfoItem
                      icon={CheckCircle2}
                      label="Acknowledged By"
                      value={alert.acknowledgedBy ?? "—"}
                    />
                  )}
                </div>

                {/* Coordinates */}
                {alert.coordinates && (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="h-3 w-3" /> Coordinates
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {(["x", "y", "z"] as const).map((axis) => (
                        <div
                          key={axis}
                          className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-center"
                        >
                          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                            {axis}
                          </p>
                          <p className="text-lg font-mono font-semibold mt-1">
                            {alert.coordinates![axis].toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* RIGHT: Sensor Readings — hidden for SOS alerts */}
              {r && alert.hazard !== "SOS Button Pressed" && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Sensor Readings
                    {!t && (
                      <span className="ml-2 normal-case font-normal text-muted-foreground/60">
                        (no thresholds)
                      </span>
                    )}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    {/* Temperature */}
                    {(() => {
                      const level = t ? tempLevel(r.temperature, t) : "safe";
                      const barP = t
                        ? pct(r.temperature, 0, t.temperatureCritical * 1.3)
                        : 50;
                      const hint = t
                        ? `Warn ≥ ${t.temperatureWarning}°C · Critical ≥ ${t.temperatureCritical}°C`
                        : "";
                      return (
                        <ReadingCard
                          icon={Thermometer}
                          label="Temperature"
                          value={r.temperature}
                          unit="°C"
                          level={level}
                          barPct={barP}
                          thresholdLabel={hint}
                        />
                      );
                    })()}

                    {/* Humidity */}
                    {(() => {
                      const level = t ? humidityLevel(r.humidity, t) : "safe";
                      const barP = t
                        ? pct(r.humidity, 0, t.humidityCritical * 1.2)
                        : 50;
                      const hint = t
                        ? `Warn ≥ ${t.humidityWarning}% · Critical ≥ ${t.humidityCritical}%`
                        : "";
                      return (
                        <ReadingCard
                          icon={Droplets}
                          label="Humidity"
                          value={r.humidity}
                          unit="%"
                          level={level}
                          barPct={barP}
                          thresholdLabel={hint}
                        />
                      );
                    })()}

                    {/* Methane */}
                    {(() => {
                      const level = t ? methaneLevel(r.methane, t) : "safe";
                      const barP = t
                        ? pct(r.methane, 0, t.methaneCritical * 1.3)
                        : 50;
                      const hint = t
                        ? `Warn ≥ ${t.methaneWarning} ppm · Critical ≥ ${t.methaneCritical} ppm`
                        : "";
                      return (
                        <ReadingCard
                          icon={Flame}
                          label="Methane (CH₄)"
                          value={r.methane}
                          unit="ppm"
                          level={level}
                          barPct={barP}
                          thresholdLabel={hint}
                        />
                      );
                    })()}

                    {/* Carbon Monoxide */}
                    {(() => {
                      const level = t ? coLevel(r.carbonMonoxide, t) : "safe";
                      const barP = t
                        ? pct(r.carbonMonoxide, 0, t.coCritical * 1.4)
                        : 50;
                      const hint = t
                        ? `Warn ≥ ${t.coWarning} ppm · Critical ≥ ${t.coCritical} ppm`
                        : "";
                      return (
                        <ReadingCard
                          icon={Wind}
                          label="Carbon Monoxide (CO)"
                          value={r.carbonMonoxide}
                          unit="ppm"
                          level={level}
                          barPct={barP}
                          thresholdLabel={hint}
                        />
                      );
                    })()}

                    {/* Oxygen — spans full width */}
                    {(() => {
                      const level = t ? oxygenLevel(r.oxygen, t) : "safe";
                      // healthy range ~18-25%; bar represents deviation from 20.9%
                      const barP = t
                        ? pct(r.oxygen, t.oxygenCriticalLow - 1, t.oxygenCriticalHigh + 1)
                        : 50;
                      const hint = t
                        ? `Safe ${t.oxygenWarningLow}–${t.oxygenWarningHigh}% · Warn ${t.oxygenCriticalLow}–${t.oxygenCriticalHigh}%`
                        : "";
                      return (
                        <div className="sm:col-span-2">
                          <ReadingCard
                            icon={Activity}
                            label="Oxygen (O₂)"
                            value={r.oxygen}
                            unit="%"
                            level={level}
                            barPct={barP}
                            thresholdLabel={hint}
                          />
                        </div>
                      );
                    })()}

                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
