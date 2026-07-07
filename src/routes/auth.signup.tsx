import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { HardHat, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth/auth-context";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({ meta: [{ title: "Sign up — MineMesh" }] }),
  component: SignupPage,
});

function Field({
  id,
  label,
  ...props
}: { id: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
    </div>
  );
}

function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState("Male");
  const [sector, setSector] = useState("sector-1");

  const submit = async (e: React.FormEvent<HTMLFormElement>, role: "admin" | "supervisor") => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("password") !== fd.get("confirmPassword")) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const session =
        role === "admin"
          ? await api.signupAdmin({
              name: String(fd.get("name")),
              employeeId: String(fd.get("employeeId")),
              gender,
              phone: String(fd.get("phone")),
              email: String(fd.get("email")),
              password: String(fd.get("password")),
              mineName: String(fd.get("mineName")),
              companyName: String(fd.get("companyName")),
            })
          : await api.signupSupervisor({
              name: String(fd.get("name")),
              employeeId: String(fd.get("employeeId")),
              sectorId: sector,
              gender,
              phone: String(fd.get("phone")),
              email: String(fd.get("email")),
              password: String(fd.get("password")),
            });
      login(session);
      toast.success("Account created");
      navigate({ to: role === "admin" ? "/admin" : "/supervisor" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const genderSelect = (
    <div className="space-y-2">
      <Label>Gender</Label>
      <Select value={gender} onValueChange={setGender}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Male">Male</SelectItem>
          <SelectItem value="Female">Female</SelectItem>
          <SelectItem value="Other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <HardHat className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Create your MineMesh account</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="supervisor">Supervisor</TabsTrigger>
            </TabsList>

            <TabsContent value="admin">
              <form onSubmit={(e) => submit(e, "admin")} className="grid gap-4 sm:grid-cols-2">
                <Field id="a-name" name="name" label="Full name" required />
                <Field id="a-emp" name="employeeId" label="Employee ID" required />
                {genderSelect}
                <Field id="a-phone" name="phone" label="Phone number" required />
                <Field id="a-email" name="email" label="Email" type="email" required />
                <Field id="a-mine" name="mineName" label="Mine name" required />
                <Field id="a-company" name="companyName" label="Company name" required />
                <div className="hidden sm:block" />
                <Field id="a-pass" name="password" label="Password" type="password" required />
                <Field
                  id="a-cpass"
                  name="confirmPassword"
                  label="Confirm password"
                  type="password"
                  required
                />
                <Button type="submit" className="mt-2 sm:col-span-2" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create admin account
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="supervisor">
              <form onSubmit={(e) => submit(e, "supervisor")} className="grid gap-4 sm:grid-cols-2">
                <Field id="s-name" name="name" label="Full name" required />
                <Field id="s-emp" name="employeeId" label="Employee ID" required />
                <div className="space-y-2">
                  <Label>Sector assigned</Label>
                  <Select value={sector} onValueChange={setSector}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sector-1">Sector 1</SelectItem>
                      <SelectItem value="sector-2">Sector 2</SelectItem>
                      <SelectItem value="sector-3">Sector 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {genderSelect}
                <Field id="s-phone" name="phone" label="Phone number" required />
                <Field id="s-email" name="email" label="Email" type="email" required />
                <Field id="s-pass" name="password" label="Password" type="password" required />
                <Field
                  id="s-cpass"
                  name="confirmPassword"
                  label="Confirm password"
                  type="password"
                  required
                />
                <Button type="submit" className="mt-2 sm:col-span-2" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create supervisor account
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
