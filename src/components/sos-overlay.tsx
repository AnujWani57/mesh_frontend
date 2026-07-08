import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AlertTriangle, MapPin, Radio, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SosEvent } from "@/lib/types";
import { useSosStream } from "@/hooks/use-sos-stream";

interface SosContextValue {
  triggerSos: (event: SosEvent) => void;
}

const SosContext = createContext<SosContextValue | null>(null);

export function SosProvider({ children }: { children: ReactNode }) {
  const [event, setEvent] = useState<SosEvent | null>(null);

  const triggerSos = useCallback((e: SosEvent) => setEvent(e), []);
  const value = useMemo(() => ({ triggerSos }), [triggerSos]);

  // Connect to backend SSE
  useSosStream(triggerSos);

  useEffect(() => {
    if (event) {
      const timer = setTimeout(() => {
        setEvent(null);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [event]);

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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
    >
      <div className="animate-in zoom-in-95 fade-in w-full max-w-md rounded-2xl border border-white/20 bg-critical p-6 text-critical-foreground shadow-2xl sm:p-8">
        <div className="flex items-center gap-4">
          <div className="animate-pulse rounded-full bg-white/20 p-3">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight sm:text-2xl">EMERGENCY SOS</h2>
            <p className="text-sm font-semibold opacity-90">{event.reason}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-2 rounded-xl bg-black/20 p-4 text-sm">
          <Detail icon={User} label="Worker" value={event.workerName} />
          <Detail icon={Radio} label="Wearable ID" value={event.deviceId} />
          <Detail icon={Radio} label="Sector" value={event.sectorName} />
          <Detail
            icon={MapPin}
            label="Location"
            value={`X=${event.coordinates.x}  Y=${event.coordinates.y}  Z=${event.coordinates.z}`}
          />
        </div>

        <Button
          onClick={onAcknowledge}
          className="mt-6 w-full bg-white py-6 text-base font-bold text-critical hover:bg-white/90"
        >
          ACKNOWLEDGE
        </Button>
        <p className="mt-3 text-center text-xs opacity-80">
          Auto-dismisses in 15s if ignored.
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
