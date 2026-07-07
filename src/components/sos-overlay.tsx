import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AlertTriangle, MapPin, Radio, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SosEvent } from "@/lib/types";

interface SosContextValue {
  triggerSos: (event: SosEvent) => void;
}

const SosContext = createContext<SosContextValue | null>(null);

export function SosProvider({ children }: { children: ReactNode }) {
  const [event, setEvent] = useState<SosEvent | null>(null);

  const triggerSos = useCallback((e: SosEvent) => setEvent(e), []);
  const value = useMemo(() => ({ triggerSos }), [triggerSos]);

  return (
    <SosContext.Provider value={value}>
      {children}
      {event && <SosOverlay event={event} onAcknowledge={() => setEvent(null)} />}
    </SosContext.Provider>
  );
}

export function useSos() {
  const ctx = useContext(SosContext);
  if (!ctx) throw new Error("useSos must be used within SosProvider");
  return ctx;
}

function SosOverlay({ event, onAcknowledge }: { event: SosEvent; onAcknowledge: () => void }) {
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-critical/95 p-4 backdrop-blur-sm"
    >
      <div className="animate-in zoom-in-95 w-full max-w-lg rounded-2xl border border-white/20 bg-critical p-6 text-critical-foreground shadow-2xl sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="animate-pulse rounded-full bg-white/20 p-4">
            <AlertTriangle className="h-12 w-12" />
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">EMERGENCY SOS</h2>
          <p className="mt-1 text-lg font-semibold opacity-90">{event.reason}</p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 rounded-xl bg-black/20 p-4 text-sm sm:grid-cols-2">
          <Detail icon={User} label="Worker" value={event.workerName} />
          <Detail icon={Radio} label="Wearable ID" value={event.deviceId} />
          <Detail icon={Radio} label="Sector" value={event.sectorName} />
          <Detail icon={Radio} label="Node" value={event.nodeId} />
          <Detail
            icon={MapPin}
            label="Location"
            value={`X=${event.coordinates.x}  Y=${event.coordinates.y}  Z=${event.coordinates.z}`}
          />
          <Detail
            icon={AlertTriangle}
            label="Time"
            value={new Date(event.time).toLocaleTimeString()}
          />
        </div>

        <Button
          onClick={onAcknowledge}
          className="mt-6 w-full bg-white py-6 text-base font-bold text-critical hover:bg-white/90"
        >
          ACKNOWLEDGE
        </Button>
        <p className="mt-3 text-center text-xs opacity-80">
          This alert stays on screen until acknowledged.
        </p>
      </div>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 opacity-80" />
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide opacity-70">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}
