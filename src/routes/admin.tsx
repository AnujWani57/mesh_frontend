import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Info, LayoutDashboard, Settings, Grid3x3, User } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/dashboard-shell";

const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Sectors", to: "/admin/sectors", icon: Grid3x3 },
  { label: "Account", to: "/admin/account", icon: User },
  { label: "Settings", to: "/admin/settings", icon: Settings },
  { label: "About", to: "/admin/about", icon: Info },
];

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <DashboardShell role="admin" nav={ADMIN_NAV}>
      <Outlet />
    </DashboardShell>
  );
}
