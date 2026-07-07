import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, User } from "lucide-react";
import { PageHeader } from "@/components/dashboard-shell";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSectors } from "@/hooks/use-api";
import type { SensorReadings } from "@/lib/types";

export const Route = createFileRoute("/admin/sectors")({
  head: () => ({ meta: [{ title: "Sectors — MineMesh Admin" }] }),
  component: SectorsPage,
});

const READING_ROWS: { key: keyof SensorReadings; label: string; unit: string }[] = [
  { key: "temperature", label: "Temperature", unit: "°C" },
  { key: "humidity", label: "Humidity", unit: "%" },
  { key: "methane", label: "Methane", unit: "ppm" },
  { key: "carbonMonoxide", label: "CO", unit: "ppm" },
  { key: "oxygen", label: "Oxygen", unit: "%" },
];

function SectorsPage() {
  const { data: sectors, isLoading } = useSectors();

  if (isLoading || !sectors) return <p className="text-muted-foreground">Loading sectors…</p>;

  return (
    <div>
      <PageHeader title="Sectors" description="Overview of every sector in the mine." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sectors.map((s) => (
          <Link key={s.id} to="/admin/sectors/$sectorId" params={{ sectorId: s.id }}>
            <Card className="h-full transition-colors hover:border-primary">
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg">{s.name}</CardTitle>
                <StatusBadge status={s.status} />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Supervisor:</span>
                  <span className="font-medium">{s.supervisor.name}</span>
                </div>
                <div className="flex gap-3 text-sm">
                  <span className="rounded-md status-safe px-2 py-1 font-medium">
                    {s.activeNodes} Active
                  </span>
                  <span className="rounded-md bg-muted px-2 py-1 font-medium text-muted-foreground">
                    {s.inactiveNodes} Offline
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                  {READING_ROWS.map((r) => (
                    <div key={r.key} className="flex justify-between">
                      <span className="text-muted-foreground">{r.label}</span>
                      <span className="font-medium">
                        {s.averageReadings[r.key]} {r.unit}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-end gap-1 text-sm font-medium text-primary">
                  View details <ChevronRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
