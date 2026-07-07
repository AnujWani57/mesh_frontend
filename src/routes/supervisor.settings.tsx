import { createFileRoute } from "@tanstack/react-router";
import { SettingsView } from "@/components/settings-view";

export const Route = createFileRoute("/supervisor/settings")({
  head: () => ({ meta: [{ title: "Settings — MineMesh Supervisor" }] }),
  component: () => <SettingsView role="supervisor" />,
});
