import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/dashboard-shell";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAlerts } from "@/hooks/use-api";
import { useAuth } from "@/lib/auth/auth-context";
import { exportAlertsCsv, exportAlertsPdf } from "@/lib/report";

export const Route = createFileRoute("/supervisor/reports")({
  head: () => ({ meta: [{ title: "Reports — MineMesh Supervisor" }] }),
  component: ReportsPage,
});

const DAILY = [
  { day: "Mon", alerts: 4 },
  { day: "Tue", alerts: 7 },
  { day: "Wed", alerts: 3 },
  { day: "Thu", alerts: 9 },
  { day: "Fri", alerts: 5 },
  { day: "Sat", alerts: 2 },
  { day: "Sun", alerts: 6 },
];

function ReportsPage() {
  const { user } = useAuth();
  const { data: alerts, isLoading } = useAlerts(user?.sectorId);

  if (isLoading || !alerts) return <p className="text-muted-foreground">Loading report…</p>;

  const meta = { sector: user?.sectorName ?? "—", author: user?.name ?? "Supervisor" };

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Alert history and downloadable reports."
        action={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => exportAlertsCsv(alerts)}>
              <Download className="h-4 w-4" /> CSV
            </Button>
            <Button className="gap-2" onClick={() => exportAlertsPdf(alerts, meta)}>
              <FileText className="h-4 w-4" /> PDF
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Today's Alerts" value={alerts.length} icon={FileText} />
        <StatCard label="This Week" value={36} icon={FileText} />
        <StatCard label="This Month" value={128} icon={FileText} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Daily Alert Count</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DAILY} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.5rem",
                    color: "var(--popover-foreground)",
                  }}
                />
                <Bar dataKey="alerts" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alert ID</TableHead>
                <TableHead>Worker</TableHead>
                <TableHead className="hidden sm:table-cell">Device</TableHead>
                <TableHead className="hidden md:table-cell">Node</TableHead>
                <TableHead>Hazard</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead className="hidden lg:table-cell">Ack By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.id}</TableCell>
                  <TableCell>{a.workerName}</TableCell>
                  <TableCell className="hidden sm:table-cell">{a.deviceId}</TableCell>
                  <TableCell className="hidden md:table-cell">{a.nodeId}</TableCell>
                  <TableCell>{a.hazard}</TableCell>
                  <TableCell>
                    <StatusBadge status={a.severity} />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{a.acknowledgedBy ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
