import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BatteryMedium, Heart, MapPin, Signal } from "lucide-react";
import { PageHeader } from "@/components/dashboard-shell";
import { StatusBadge, DeviceStatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNode } from "@/hooks/use-api";
import type { SensorReadings, WearableDevice } from "@/lib/types";

export const Route = createFileRoute("/supervisor/nodes/$nodeId")({
  head: () => ({ meta: [{ title: "Node detail — MineMesh Supervisor" }] }),
  component: NodeDetail,
});

const READINGS: { key: keyof SensorReadings; label: string; unit: string }[] = [
  { key: "temperature", label: "Temperature", unit: "°C" },
  { key: "humidity", label: "Humidity", unit: "%" },
  { key: "methane", label: "Methane", unit: "ppm" },
  { key: "carbonMonoxide", label: "CO", unit: "ppm" },
  { key: "oxygen", label: "Oxygen", unit: "%" },
];

function NodeDetail() {
  const { nodeId } = Route.useParams();
  const { data: node, isLoading } = useNode(nodeId);

  if (isLoading || !node) return <p className="text-muted-foreground">Loading node…</p>;

  return (
    <div>
      <Button variant="ghost" size="sm" className="mb-3 gap-2" asChild>
        <Link to="/supervisor/nodes">
          <ArrowLeft className="h-4 w-4" /> Back to nodes
        </Link>
      </Button>
      <PageHeader
        title={node.name}
        description={`${node.connectedDevices} connected devices · Signal ${node.signalStrength}`}
        action={<DeviceStatusBadge status={node.status} />}
      />
      <p className="mb-4 text-sm text-muted-foreground">
        Node ID: {node.id} · Battery {node.battery}% · Last updated{" "}
        {new Date(node.lastUpdated).toLocaleTimeString()}
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        {node.devices.map((d) => (
          <DeviceCard key={d.id} device={d} />
        ))}
      </div>
    </div>
  );
}

function DeviceCard({ device }: { device: WearableDevice }) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-base">{device.workerName}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {device.id} · Worker {device.workerId}
          </p>
        </div>
        <StatusBadge status={device.health} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
          {READINGS.map((r) => (
            <div key={r.key}>
              <p className="text-xs text-muted-foreground">{r.label}</p>
              <p className="font-semibold">
                {device.readings[r.key]} {r.unit}
              </p>
            </div>
          ))}
          <div>
            <p className="text-xs text-muted-foreground">Heart Rate</p>
            <p className="font-semibold">{device.heartRate ?? "—"} bpm</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t pt-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4" /> X={device.coordinates.x} Y={device.coordinates.y} Z=
            {device.coordinates.z}
          </span>
          <span className="flex items-center gap-2">
            <BatteryMedium className="h-4 w-4" /> {device.battery}%
          </span>
          <span className="flex items-center gap-2">
            <Signal className="h-4 w-4" /> {device.signalStrength} dBm
          </span>
          <span className="flex items-center gap-2">
            <Heart className="h-4 w-4" /> {new Date(device.lastUpdated).toLocaleTimeString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <DeviceStatusBadge status={device.status} />
        </div>
      </CardContent>
    </Card>
  );
}
