import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Bell, FileText, Info, Home, Settings, User, Waypoints } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/dashboard-shell";
import { SosProvider } from "@/components/sos-overlay";

const SUPERVISOR_NAV: NavItem[] = [
  { label: "Home", to: "/supervisor", icon: Home },
  { label: "Nodes", to: "/supervisor/nodes", icon: Waypoints },
  { label: "Alerts", to: "/supervisor/alerts", icon: Bell },
  { label: "Reports", to: "/supervisor/reports", icon: FileText },
  { label: "Account", to: "/supervisor/account", icon: User },
  { label: "Settings", to: "/supervisor/settings", icon: Settings },
  { label: "About", to: "/supervisor/about", icon: Info },
];

export const Route = createFileRoute("/supervisor")({
  component: SupervisorLayout,
});

function SupervisorLayout() {
  return (
    <SosProvider>
      <DashboardShell role="supervisor" nav={SUPERVISOR_NAV}>
        <Outlet />
      </DashboardShell>
    </SosProvider>
  );
}
