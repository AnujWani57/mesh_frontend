import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Bell, HardHat, Radio, ShieldCheck, Waypoints } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  component: Landing,
});

const FEATURES = [
  { icon: Waypoints, title: "Sector → Node → Wearable", desc: "Full mine hierarchy from sectors down to each worker's wearable device." },
  { icon: Activity, title: "Live Gas Monitoring", desc: "Temperature, humidity, methane, CO and oxygen tracked in real time." },
  { icon: Bell, title: "Full-screen SOS Alerts", desc: "Instant emergency popups that stay until a supervisor acknowledges." },
  { icon: ShieldCheck, title: "Threshold Safety", desc: "Configurable safe / warning / critical thresholds per gas." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <HardHat className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold">MineMesh</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link to="/auth/login">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/auth/signup">Sign up</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
          <Radio className="h-3.5 w-3.5" /> Real-time mine safety monitoring
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
          Keep every worker safe, from surface to shaft.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
          MineMesh unifies sectors, nodes and wearable sensors into a single dashboard with live gas
          readings, health status and emergency SOS handling.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" asChild>
            <Link to="/auth/login">Open Dashboard</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/auth/signup">Create Account</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <Card key={f.title} className="p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        MineMesh — Mine Monitoring System · Demo build
      </footer>
    </div>
  );
}
