import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth/auth-context";
import type { Role } from "@/lib/types";

export const Route = createFileRoute("/auth/login")({
  head: () => ({ meta: [{ title: "Login — MineMesh" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const session = await api.login({ email, password, role });
      login(session);
      toast.success(`Welcome back, ${session.user.name}`);
      navigate({ to: role === "admin" ? "/admin" : "/supervisor" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto">
            <img src="/logo.png" alt="MineMesh Logo" className="h-14 w-14 rounded-xl object-contain mx-auto" />
          </div>
          <div>
            <CardTitle className="text-2xl">Sign in to MineMesh</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Select your role to continue</p>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={role} onValueChange={(v) => setRole(v as Role)} className="mb-5">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="supervisor">Supervisor</TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@minemesh.io"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox defaultChecked /> Remember me
              </label>
              <button type="button" className="text-sm text-primary hover:underline">
                Forgot password?
              </button>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign in as {role}
            </Button>
          </form>


          <p className="mt-6 text-center text-sm text-muted-foreground">
            No account?{" "}
            <Link to="/auth/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
