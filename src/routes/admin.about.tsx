import { createFileRoute } from "@tanstack/react-router";
import { AboutView } from "@/components/about-view";

export const Route = createFileRoute("/admin/about")({
  head: () => ({ meta: [{ title: "About — MineMesh Admin" }] }),
  component: AboutView,
});
