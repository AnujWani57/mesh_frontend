import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard-shell";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bell, CheckCircle2, ListChecks } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAlerts, useAcknowledgeAlert } from "@/hooks/use-api";
import { useAuth } from "@/lib/auth/auth-context";

export const Route = createFileRoute("/supervisor/alerts")({
  head: () => ({ meta: [{ title: "Alerts — MineMesh Supervisor" }] }),
  component: AlertsPage,
});

function AlertsPage() {
  const { user } = useAuth();
  const { data: alerts, isLoading } = useAlerts(user?.sectorId);
  const acknowledge = useAcknowledgeAlert();

  if (isLoading || !alerts) return <p className="text-muted-foreground">Loading alerts…</p>;

  const active = alerts.filter((a) => a.state === "active");
  const resolved = alerts.filter((a) => a.state === "resolved");

  const handleAck = (id: string) => {
    acknowledge.mutate(
      { id, by: user?.name ?? "Supervisor" },
      { onSuccess: () => toast.success(`Alert ${id} acknowledged`) },
    );
  };

  return (
    <div>
      <PageHeader title="Alerts" description="Threshold breaches and SOS events in your sector." />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Active Alerts" value={active.length} icon={Bell} accent={active.length ? "critical" : "safe"} />
        <StatCard label="Resolved" value={resolved.length} icon={CheckCircle2} accent="safe" />
        <StatCard label="Total Today" value={alerts.length} icon={ListChecks} />
      </div>

      <Card className="mt-6 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alert ID</TableHead>
                <TableHead>Device</TableHead>
                <TableHead className="hidden sm:table-cell">Node</TableHead>
                <TableHead className="hidden md:table-cell">Time</TableHead>
                <TableHead>Hazard</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {active.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                    No active alerts.
                  </TableCell>
                </TableRow>
              )}
              {active.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.id}</TableCell>
                  <TableCell>{a.deviceId}</TableCell>
                  <TableCell className="hidden sm:table-cell">{a.nodeId}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(a.time).toLocaleTimeString()}
                  </TableCell>
                  <TableCell>{a.hazard}</TableCell>
                  <TableCell>
                    <StatusBadge status={a.severity} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" onClick={() => handleAck(a.id)} disabled={acknowledge.isPending}>
                      Acknowledge
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {resolved.length > 0 && (
        <>
          <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Resolved Alerts
          </h2>
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alert ID</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Hazard</TableHead>
                    <TableHead className="hidden sm:table-cell">Acknowledged By</TableHead>
                    <TableHead>Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resolved.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.id}</TableCell>
                      <TableCell>{a.deviceId}</TableCell>
                      <TableCell>{a.hazard}</TableCell>
                      <TableCell className="hidden sm:table-cell">{a.acknowledgedBy ?? "—"}</TableCell>
                      <TableCell>
                        <StatusBadge status={a.severity} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
