import { createFileRoute, Link } from "@tanstack/react-router";
import { BatteryMedium, ChevronRight, Radio, Signal } from "lucide-react";
import { PageHeader } from "@/components/dashboard-shell";
import { DeviceStatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNodes } from "@/hooks/use-api";
import { useAuth } from "@/lib/auth/auth-context";

export const Route = createFileRoute("/supervisor/nodes/")({
  head: () => ({ meta: [{ title: "Nodes — MineMesh Supervisor" }] }),
  component: NodesPage,
});

function NodesPage() {
  const { user } = useAuth();
  const { data: nodes, isLoading } = useNodes(user?.sectorId);

  if (isLoading || !nodes) return <p className="text-muted-foreground">Loading nodes…</p>;

  return (
    <div>
      <PageHeader title="Nodes" description="Gateway nodes in your sector." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {nodes.map((n) => (
          <Link key={n.id} to="/supervisor/nodes/$nodeId" params={{ nodeId: n.id }}>
            <Card className="h-full transition-colors hover:border-primary">
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg">{n.name}</CardTitle>
                <DeviceStatusBadge status={n.status} />
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Radio className="h-4 w-4" /> {n.connectedDevices} connected devices
                </p>
                <p className="flex items-center gap-2">
                  <Signal className="h-4 w-4" /> Signal: {n.signalStrength}
                </p>
                <p className="flex items-center gap-2">
                  <BatteryMedium className="h-4 w-4" /> Battery: {n.battery}%
                </p>
                <div className="flex items-center justify-end gap-1 pt-1 font-medium text-primary">
                  View devices <ChevronRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
