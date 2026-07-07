import { createFileRoute } from "@tanstack/react-router";
import { AboutView } from "@/components/about-view";

export const Route = createFileRoute("/supervisor/about")({
  head: () => ({ meta: [{ title: "About — MineMesh Supervisor" }] }),
  component: AboutView,
});
