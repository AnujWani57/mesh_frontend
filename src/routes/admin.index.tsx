import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  Bell,
  Grid3x3,
  HardHat,
  Radio,
  Users,
  Waypoints,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard-shell";
import { StatCard } from "@/components/stat-card";
import { ReadingCards } from "@/components/reading-cards";
import { GasTrendChart } from "@/components/gas-trend-chart";
import { HealthPie } from "@/components/health-pie";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminDashboard } from "@/hooks/use-api";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Dashboard — MineMesh Admin" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data, isLoading } = useAdminDashboard();

  if (isLoading || !data) {
    return <p className="text-muted-foreground">Loading overview…</p>;
  }

  return (
    <div>
      <PageHeader title="Mine Overview" description="Complete real-time status of the mine." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Sectors" value={data.totalSectors} icon={Grid3x3} />
        <StatCard label="Nodes" value={data.totalNodes} icon={Waypoints} />
        <StatCard label="Devices" value={data.totalDevices} icon={Radio} />
        <StatCard label="Active Devices" value={data.activeDevices} icon={Activity} accent="safe" />
        <StatCard
          label="Inactive"
          value={data.inactiveDevices}
          icon={Radio}
          accent={data.inactiveDevices > 0 ? "warning" : "safe"}
        />
        <StatCard
          label="Active Alerts"
          value={data.activeAlerts}
          icon={Bell}
          accent={data.activeAlerts > 0 ? "critical" : "safe"}
        />
        <StatCard label="Workers Inside" value={data.workersInside} icon={HardHat} />
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Average Sensor Readings
      </h2>
      <ReadingCards readings={data.averageReadings} />

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <GasTrendChart data={data.trends} />
        </div>
        <HealthPie health={data.health} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {data.recentAlerts.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between gap-3 rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {a.hazard} · {a.workerName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {a.deviceId} · {a.nodeId} · {new Date(a.time).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <StatusBadge status={a.severity} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
