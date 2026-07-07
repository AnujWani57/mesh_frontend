import { useState } from "react";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import { PageHeader } from "@/components/dashboard-shell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth/auth-context";

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export function AccountView() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(user);

  if (!user) return null;

  const rows: { label: string; value?: string }[] = [
    { label: "Name", value: user.name },
    { label: "Employee ID", value: user.employeeId },
    { label: "Gender", value: user.gender },
    { label: "Phone", value: user.phone },
    { label: "Email", value: user.email },
    ...(user.role === "admin"
      ? [
          { label: "Mine Name", value: user.mineName },
          { label: "Company", value: user.companyName },
        ]
      : [
          { label: "Assigned Sector", value: user.sectorName },
          {
            label: "Joining Date",
            value: user.joiningDate ? new Date(user.joiningDate).toLocaleDateString() : "—",
          },
        ]),
    { label: "Role", value: user.role },
    {
      label: "Last Login",
      value: user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "—",
    },
  ];

  return (
    <div>
      <PageHeader title="Account" description="Your profile and login details." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center pt-6 text-center">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary/15 text-2xl text-primary">
                  {initials(user.name)}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 rounded-full bg-primary p-1.5 text-primary-foreground">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-4 text-lg font-semibold">{user.name}</p>
            <p className="text-sm capitalize text-muted-foreground">{user.role}</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Details</CardTitle>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label>Current password</Label>
                      <Input type="password" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>New password</Label>
                      <Input type="password" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Confirm new password</Label>
                      <Input type="password" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => toast.success("Password updated")}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog
                open={editing}
                onOpenChange={(o) => {
                  setEditing(o);
                  if (o) setDraft(user);
                }}
              >
                <DialogTrigger asChild>
                  <Button size="sm">Edit Profile</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(["name", "phone", "email"] as const).map((field) => (
                      <div key={field} className="space-y-1.5">
                        <Label className="capitalize">{field}</Label>
                        <Input
                          value={(draft?.[field] as string) ?? ""}
                          onChange={(e) =>
                            setDraft((d) => (d ? { ...d, [field]: e.target.value } : d))
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => {
                        if (draft) updateUser(draft);
                        setEditing(false);
                        toast.success("Profile updated");
                      }}
                    >
                      Save changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              {rows.map((r) => (
                <div key={r.label}>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                    {r.label}
                  </dt>
                  <dd className="font-medium capitalize">{r.value ?? "—"}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
