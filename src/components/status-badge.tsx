import { cn } from "@/lib/utils";
import type { HealthStatus, DeviceStatus } from "@/lib/types";

const HEALTH_LABEL: Record<HealthStatus, string> = {
  safe: "Safe",
  warning: "Warning",
  critical: "Critical",
};

export function StatusBadge({
  status,
  className,
}: {
  status: HealthStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        status === "safe" && "status-safe",
        status === "warning" && "status-warning",
        status === "critical" && "status-critical",
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "safe" && "bg-safe",
          status === "warning" && "bg-warning",
          status === "critical" && "bg-critical",
        )}
      />
      {HEALTH_LABEL[status]}
    </span>
  );
}

export function DeviceStatusBadge({ status }: { status: DeviceStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        status === "online" ? "status-safe" : "bg-muted text-muted-foreground",
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "online" ? "bg-safe" : "bg-muted-foreground",
        )}
      />
      {status === "online" ? "Active" : "Offline"}
    </span>
  );
}
