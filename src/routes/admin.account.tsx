import { createFileRoute } from "@tanstack/react-router";
import { AccountView } from "@/components/account-view";

export const Route = createFileRoute("/admin/account")({
  head: () => ({ meta: [{ title: "Account — MineMesh Admin" }] }),
  component: AccountView,
});
