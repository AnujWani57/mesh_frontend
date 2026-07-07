import { PageHeader } from "@/components/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SENSORS = ["Temperature", "Humidity", "Methane (CH₄)", "Carbon Monoxide (CO)", "Oxygen (O₂)"];
const TECH = ["ESP32", "AWS IoT Core", "MQTT", "AWS Lambda", "Amazon S3", "React", "Tailwind CSS"];

export function AboutView() {
  return (
    <div>
      <PageHeader title="About MineMesh" description="Product overview and technology." />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">MineMesh</span> is a real-time mine
              monitoring system that keeps track of environmental conditions and worker safety across
              an entire mine. Wearable devices worn by workers stream sensor data to gateway nodes,
              which relay it to the cloud where it is aggregated, evaluated against safety thresholds
              and surfaced on this dashboard.
            </p>
            <p>
              The system follows a clear hierarchy — <b>Mine → Sector → Node → Wearable Device</b> —
              enabling both mine-wide oversight for admins and focused sector monitoring for
              supervisors, with instant full-screen SOS handling for emergencies.
            </p>
            <div>
              <p className="font-semibold text-foreground">Working principle</p>
              <p className="mt-1">
                Each wearable measures gas concentrations and vitals, transmits them to its node over
                a mesh link, and the node forwards batched readings to the cloud via MQTT. Threshold
                breaches or SOS presses raise alerts that supervisors acknowledge in real time.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row label="Product" value="MineMesh" />
              <Row label="Version" value="1.0.0" />
              <Row label="Team" value="MineMesh Developers" />
              <Row label="Contact" value="support@minemesh.io" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Supported Sensors</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {SENSORS.map((s) => (
                <Badge key={s} variant="secondary">
                  {s}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">Technology Stack</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {TECH.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
