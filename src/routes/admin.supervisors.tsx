import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard-shell";
import { DeviceStatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSupervisors } from "@/hooks/use-api";
import type { Supervisor } from "@/lib/types";

export const Route = createFileRoute("/admin/supervisors")({
  head: () => ({ meta: [{ title: "Supervisors — MineMesh Admin" }] }),
  component: SupervisorsPage,
});

function SupervisorsPage() {
  const { data: supervisors, isLoading } = useSupervisors();
  const [selected, setSelected] = useState<Supervisor | null>(null);

  if (isLoading || !supervisors) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div>
      <PageHeader title="Supervisors" description="All sector supervisors across the mine." />
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supervisors.map((s) => (
                <TableRow
                  key={s.id}
                  className="cursor-pointer"
                  onClick={() => setSelected(s)}
                >
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.sectorName}</TableCell>
                  <TableCell className="hidden md:table-cell">{s.phone}</TableCell>
                  <TableCell className="hidden md:table-cell">{s.email}</TableCell>
                  <TableCell>
                    <DeviceStatusBadge status={s.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <Detail label="Employee ID" value={selected.employeeId} />
              <Detail label="Gender" value={selected.gender} />
              <Detail label="Phone" value={selected.phone} />
              <Detail label="Email" value={selected.email} />
              <Detail label="Assigned Sector" value={selected.sectorName} />
              <Detail label="Experience" value={`${selected.experienceYears} years`} />
              <Detail label="Nodes" value={String(selected.nodeCount)} />
              <Detail label="Status" value={selected.status === "online" ? "Active" : "Offline"} />
            </dl>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
