import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActiveAlerts, useResolvedAlerts } from "@/hooks/use-api";
import { Bell, ShieldCheck } from "lucide-react";
import { StatusBadge } from "./status-badge";
import { Button } from "./ui/button";

export function SosLogDialog({
  sectorId,
  children,
}: {
  sectorId?: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>SOS Emergency Logs</DialogTitle>
        </DialogHeader>
        <SosLogTabs sectorId={sectorId} />
      </DialogContent>
    </Dialog>
  );
}

function SosLogTabs({ sectorId }: { sectorId?: string }) {
  // We fetch up to 20 SOS alerts
  const { data: activeAlerts, isLoading: activeLoading } = useActiveAlerts(sectorId, 1, 5, "SOS Button Pressed");
  const { data: resolvedAlerts, isLoading: resolvedLoading } = useResolvedAlerts(sectorId, 1, 5, "SOS Button Pressed");

  return (
    <Tabs defaultValue="active" className="mt-4 w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="active">Active SOS</TabsTrigger>
        <TabsTrigger value="acknowledged">Acknowledged</TabsTrigger>
      </TabsList>
      <TabsContent value="active" className="mt-4 min-h-[300px]">
        {activeLoading ? (
          <p className="text-sm text-muted-foreground">Loading active SOS...</p>
        ) : activeAlerts?.data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active SOS alerts.</p>
        ) : (
          <div className="space-y-3">
            {activeAlerts?.data.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 rounded-lg border border-critical/30 bg-critical/10 p-3">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-critical" />
                  <div>
                    <p className="text-sm font-medium">
                      {a.hazard} · {a.workerName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Device: {a.deviceId} · Sector: {a.sectorId}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={a.severity} />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(a.time).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </TabsContent>
      <TabsContent value="acknowledged" className="mt-4 min-h-[300px]">
        {resolvedLoading ? (
          <p className="text-sm text-muted-foreground">Loading acknowledged SOS...</p>
        ) : resolvedAlerts?.data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No acknowledged SOS alerts.</p>
        ) : (
          <div className="space-y-3">
            {resolvedAlerts?.data.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-safe" />
                  <div>
                    <p className="text-sm font-medium">
                      {a.workerName} (Acknowledged by {a.acknowledgedBy})
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Device: {a.deviceId} · Resolved
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(a.time).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
