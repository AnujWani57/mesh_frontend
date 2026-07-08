import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { config } from "@/lib/config";
import type { SosEvent, HazardType } from "@/lib/types";

// Fallback logic for when dummy API is enabled
export function useSosStream(onEvent: (event: SosEvent) => void) {
  const queryClient = useQueryClient();

  useEffect(() => {
    // If dummy API is on, we don't try to connect to the backend SSE
    if (config.useDummyApi) return;

    let source: EventSource | null = null;
    let reconnectTimer: number | NodeJS.Timeout;

    function connect() {
      source = new EventSource(`${config.apiBaseUrl}/alerts/stream`);

      source.onmessage = (event) => {
        try {
          const alert = JSON.parse(event.data);

          // Map backend payload to our SosEvent shape
          const sosEvent: SosEvent = {
            id: alert.id || `SOS-${Date.now()}`,
            workerName: alert.workerName || "Unknown Worker",
            deviceId: alert.deviceId || "Unknown Device",
            sectorId: alert.sectorId || "Unknown Sector",
            sectorName: alert.sectorId || "Unknown Sector", // Backend doesn't provide sectorName
            nodeId: alert.nodeId || "Unknown Node",
            coordinates: { x: 0, y: 0, z: 0 }, // Backend doesn't provide coordinates
            reason: (alert.hazard as HazardType) || "SOS Button Pressed",
            time: alert.time || new Date().toISOString(),
          };

          // Trigger the UI toast
          onEvent(sosEvent);

          // Invalidate relevant react-query caches so the UI (like SOS count) updates instantly
          queryClient.invalidateQueries({ queryKey: ["alerts-active"] });
          queryClient.invalidateQueries({ queryKey: ["supervisor-stats"] });
          queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
        } catch (err) {
          console.error("Failed to parse SOS stream event", err);
        }
      };

      source.onerror = () => {
        source?.close();
        // Reconnect logic
        reconnectTimer = setTimeout(connect, 2000);
      };
    }

    connect();

    return () => {
      source?.close();
      clearTimeout(reconnectTimer);
    };
  }, [onEvent, queryClient]);
}
