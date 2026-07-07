import { createFileRoute } from "@tanstack/react-router";
import { SettingsView } from "@/components/settings-view";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — MineMesh Admin" }] }),
  component: () => <SettingsView role="admin" />,
});
