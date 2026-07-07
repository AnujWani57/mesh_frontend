import { createFileRoute } from "@tanstack/react-router";
import { AccountView } from "@/components/account-view";

export const Route = createFileRoute("/supervisor/account")({
  head: () => ({ meta: [{ title: "Account — MineMesh Supervisor" }] }),
  component: AccountView,
});
