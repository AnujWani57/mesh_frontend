import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
import { useActiveAlerts, useResolvedAlerts, useAlertsSummary, useAcknowledgeAlert } from "@/hooks/use-api";
import { useAuth } from "@/lib/auth/auth-context";

export const Route = createFileRoute("/supervisor/alerts")({
  head: () => ({ meta: [{ title: "Alerts — MineMesh Supervisor" }] }),
  component: AlertsPage,
});

function AlertsPage() {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState(1);
  const [resolvedPage, setResolvedPage] = useState(1);

  const { data: activeData, isLoading: isActiveLoading } = useActiveAlerts(user?.sectorId, activePage, 10);
  const { data: resolvedData, isLoading: isResolvedLoading } = useResolvedAlerts(user?.sectorId, resolvedPage, 5);
  const { data: summary, isLoading: isSummaryLoading } = useAlertsSummary(user?.sectorId);
  const acknowledge = useAcknowledgeAlert();

  if (isActiveLoading || isResolvedLoading || isSummaryLoading || !activeData || !resolvedData || !summary) {
    return <p className="text-muted-foreground">Loading alerts…</p>;
  }

  const active = activeData.data;
  const resolved = resolvedData.data;

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
        <StatCard label="Active Alerts" value={summary.activeCount} icon={Bell} accent={summary.activeCount ? "critical" : "safe"} />
        <StatCard label="Resolved" value={summary.resolvedCount} icon={CheckCircle2} accent="safe" />
        <StatCard label="Total Today" value={summary.totalToday} icon={ListChecks} />
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
        {activeData.meta.totalPages > 1 && (
          <div className="flex items-center justify-end space-x-2 p-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActivePage((p) => Math.max(1, p - 1))}
              disabled={activePage === 1}
            >
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">
              Page {activeData.meta.page} of {activeData.meta.totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActivePage((p) => p + 1)}
              disabled={activePage >= activeData.meta.totalPages}
            >
              Next
            </Button>
          </div>
        )}
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
            {resolvedData.meta.totalPages > 1 && (
              <div className="flex items-center justify-end space-x-2 p-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setResolvedPage((p) => Math.max(1, p - 1))}
                  disabled={resolvedPage === 1}
                >
                  Previous
                </Button>
                <div className="text-sm text-muted-foreground">
                  Page {resolvedData.meta.page} of {resolvedData.meta.totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setResolvedPage((p) => p + 1)}
                  disabled={resolvedPage >= resolvedData.meta.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
