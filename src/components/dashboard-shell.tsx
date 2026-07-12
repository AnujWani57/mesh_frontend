import { useEffect, useState, type ComponentType } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut, Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/auth-context";
import { useTheme } from "@/lib/theme/theme-context";
import type { Role } from "@/lib/types";

export interface NavItem {
  label: string;
  to: string;
  icon: ComponentType<{ className?: string }>;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function DashboardShell({
  role,
  nav,
  children,
}: {
  role: Role;
  nav: NavItem[];
  children: React.ReactNode;
}) {
  const { user, isReady, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (isReady && (!user || user.role !== role)) {
      navigate({ to: "/auth/login" });
    }
  }, [isReady, user, role, navigate]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (!isReady || !user || user.role !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading…
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate({ to: "/auth/login" });
  };

  const SidebarBody = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 border-b px-5">
        <img src="/logo.png" alt="MineMesh Logo" className="h-9 w-9 rounded-lg object-contain" />
        <div className="leading-tight">
          <p className="font-bold">MineMesh</p>
          <p className="text-xs capitalize text-muted-foreground">{role} panel</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {nav.map((item) => {
          const isRoot = !item.to.slice(1).includes("/");
          const active = isRoot
            ? pathname === item.to
            : pathname === item.to || pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-3">
        <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="hidden w-64 shrink-0 border-r bg-sidebar lg:block">{SidebarBody}</aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 bg-sidebar p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          {SidebarBody}
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {user.mineName ?? user.sectorName ?? "MineMesh"}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full p-0.5 pr-2 hover:bg-accent">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/15 text-xs text-primary">
                    {initials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium sm:inline">{user.name}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs font-normal text-muted-foreground">{user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={role === "admin" ? "/admin/account" : "/supervisor/account"}>Account</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={role === "admin" ? "/admin/settings" : "/supervisor/settings"}>
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}
