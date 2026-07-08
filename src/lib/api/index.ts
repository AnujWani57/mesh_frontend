import { config, SESSION_STORAGE_KEY } from "../config";
import type {
  AdminStats,
  AdminEnvironment,
  AdminSignupPayload,
  Alert,
  AlertsSummary,
  AuthSession,
  LoginPayload,
  Node,
  NodeSummary,
  PaginatedResponse,
  Sector,
  Supervisor,
  SupervisorStats,
  SupervisorEnvironment,
  SupervisorSignupPayload,
  User,
} from "../types";
import {
  ALERTS,
  MOCK_CREDENTIALS,
  MOCK_USERS,
  NODES,
  SECTORS,
  SUPERVISORS,
  makeTrends,
} from "../data/dummy";

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), config.dummyLatency));
}

// Mutable in-memory copies so the dummy backend can be updated at runtime.
let alerts: Alert[] = ALERTS.map((a) => ({ ...a }));

async function realRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const headers = new Headers(options?.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  
  try {
    const rawSession = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (rawSession) {
      const session = JSON.parse(rawSession) as AuthSession;
      if (session?.token) {
        headers.set("Authorization", `Bearer ${session.token}`);
      }
    }
  } catch (e) {
    // Ignore parse errors
  }

  const res = await fetch(`${config.apiBaseUrl}${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return (await res.json()) as T;
}

// ---------------------------------------------------------------------------
// Dummy implementations
// ---------------------------------------------------------------------------
const dummyApi = {
  async login(payload: LoginPayload): Promise<AuthSession> {
    const cred = MOCK_CREDENTIALS[payload.email.toLowerCase()];
    if (!cred || cred.password !== payload.password) {
      return delay(Promise.reject(new Error("Invalid email or password")));
    }
    const user = MOCK_USERS[cred.userId];
    if (user.role !== payload.role) {
      return delay(Promise.reject(new Error(`This account is not a ${payload.role} account`)));
    }
    return delay({ token: `dummy-token-${user.id}`, user: { ...user, lastLogin: new Date().toISOString() } });
  },

  async signupAdmin(payload: AdminSignupPayload): Promise<AuthSession> {
    const user: User = {
      id: `u-admin-${Date.now()}`,
      role: "admin",
      ...payload,
      lastLogin: new Date().toISOString(),
    };
    return delay({ token: `dummy-token-${user.id}`, user });
  },

  async signupSupervisor(payload: SupervisorSignupPayload): Promise<AuthSession> {
    const sector = SECTORS.find((s) => s.id === payload.sectorId);
    const user: User = {
      id: `u-sup-${Date.now()}`,
      role: "supervisor",
      name: payload.name,
      employeeId: payload.employeeId,
      gender: payload.gender,
      phone: payload.phone,
      email: payload.email,
      sectorId: payload.sectorId,
      sectorName: sector?.name ?? payload.sectorId,
      joiningDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    return delay({ token: `dummy-token-${user.id}`, user });
  },

  async getAdminStats(): Promise<AdminStats> {
    const totalDevices = NODES.reduce((n, node) => n + node.devices.length, 0);
    const activeDevices = NODES.reduce(
      (n, node) => n + node.devices.filter((d) => d.status === "online").length,
      0,
    );
    return delay({
      totalSectors: SECTORS.length,
      totalNodes: NODES.length,
      totalDevices,
      activeDevices,
      inactiveDevices: totalDevices - activeDevices,
      activeAlerts: alerts.filter((a) => a.state === "active").length,
      workersInside: activeDevices,
    });
  },

  async getAdminEnvironment(): Promise<AdminEnvironment> {
    return delay({
      averageReadings: { temperature: 31, humidity: 61, methane: 1180, carbonMonoxide: 17, oxygen: 20.3 },
      trends: makeTrends({ temperature: 31, humidity: 61, methane: 1180, carbonMonoxide: 17, oxygen: 20.3 }),
      health: {
        safe: SECTORS.filter((s) => s.status === "safe").length,
        warning: SECTORS.filter((s) => s.status === "warning").length,
        critical: SECTORS.filter((s) => s.status === "critical").length,
      },
    });
  },

  async getSectors(): Promise<Sector[]> {
    return delay(SECTORS.map((s) => ({ ...s })));
  },

  async getSector(id: string): Promise<Sector | undefined> {
    return delay(SECTORS.find((s) => s.id === id));
  },

  async getSupervisors(): Promise<Supervisor[]> {
    return delay(SUPERVISORS.map((s) => ({ ...s })));
  },

  async getNodes(sectorId?: string): Promise<Node[]> {
    const list = sectorId ? NODES.filter((n) => n.sectorId === sectorId) : NODES;
    return delay(list.map((n) => ({ ...n })));
  },

  async getNode(id: string): Promise<Node | undefined> {
    return delay(NODES.find((n) => n.id === id));
  },

  async getAlerts(sectorId?: string): Promise<Alert[]> {
    const list = sectorId ? alerts.filter((a) => a.sectorId === sectorId) : alerts;
    return delay(list.map((a) => ({ ...a })));
  },

  async getActiveAlerts(sectorId?: string, page = 1, limit = 10, hazard?: string): Promise<PaginatedResponse<Alert>> {
    let list = sectorId ? alerts.filter((a) => a.sectorId === sectorId) : alerts;
    if (hazard) list = list.filter((a) => a.hazard === hazard);
    const active = list.filter((a) => a.state === "active");
    const start = (page - 1) * limit;
    const data = active.slice(start, start + limit);
    return delay({
      data: data.map((a) => ({ ...a })),
      meta: {
        page,
        limit,
        totalCount: active.length,
        totalPages: Math.ceil(active.length / limit),
      },
    });
  },

  async getResolvedAlerts(sectorId?: string, page = 1, limit = 5, hazard?: string): Promise<PaginatedResponse<Alert>> {
    let list = sectorId ? alerts.filter((a) => a.sectorId === sectorId) : alerts;
    if (hazard) list = list.filter((a) => a.hazard === hazard);
    const resolved = list.filter((a) => a.state === "resolved");
    const start = (page - 1) * limit;
    const data = resolved.slice(start, start + limit);
    return delay({
      data: data.map((a) => ({ ...a })),
      meta: {
        page,
        limit,
        totalCount: resolved.length,
        totalPages: Math.ceil(resolved.length / limit),
      },
    });
  },

  async getAlertsSummary(sectorId?: string): Promise<AlertsSummary> {
    const list = sectorId ? alerts.filter((a) => a.sectorId === sectorId) : alerts;
    const activeCount = list.filter((a) => a.state === "active").length;
    const resolvedCount = list.filter((a) => a.state === "resolved").length;
    return delay({
      activeCount,
      resolvedCount,
      totalToday: list.length,
    });
  },

  async acknowledgeAlert(id: string, by: string): Promise<Alert> {
    alerts = alerts.map((a) =>
      a.id === id ? { ...a, state: "resolved", acknowledgedBy: by } : a,
    );
    const updated = alerts.find((a) => a.id === id)!;
    return delay({ ...updated });
  },

  async getSupervisorStats(sectorId: string): Promise<SupervisorStats> {
    const sector = SECTORS.find((s) => s.id === sectorId)!;
    const nodes = NODES.filter((n) => n.sectorId === sectorId);
    const devices = nodes.flatMap((n) => n.devices);
    return delay({
      sectorId,
      sectorName: sector?.name ?? sectorId,
      status: sector?.status ?? "safe",
      totalWorkers: devices.length,
      devicesOnline: devices.filter((d) => d.status === "online").length,
      sosCount: alerts.filter((a) => a.sectorId === sectorId && a.hazard === "SOS Button Pressed").length,
    });
  },

  async getSupervisorEnvironment(sectorId: string): Promise<SupervisorEnvironment> {
    const sector = SECTORS.find((s) => s.id === sectorId)!;
    const baseReadings = sector?.averageReadings ?? {
      temperature: 30,
      humidity: 60,
      methane: 800,
      carbonMonoxide: 15,
      oxygen: 20.5,
    };
    return delay({
      averageReadings: baseReadings,
      trends: makeTrends(baseReadings),
    });
  },

  async getSupervisorNodes(sectorId: string): Promise<NodeSummary[]> {
    const nodes = NODES.filter((n) => n.sectorId === sectorId);
    return delay(nodes.map((n) => ({ id: n.id, name: n.name, status: n.status })));
  },
};

// ---------------------------------------------------------------------------
// Real implementations (wired to VITE_API_BASE_URL). See API_DOCUMENTATION.md.
// ---------------------------------------------------------------------------
const realApi = {
  login: dummyApi.login,
  signupAdmin: dummyApi.signupAdmin,
  signupSupervisor: dummyApi.signupSupervisor,
  getAdminStats: () => realRequest<AdminStats>("/admin/stats"),
  getAdminEnvironment: () => realRequest<AdminEnvironment>("/admin/environment"),
  getSectors: () => realRequest<Sector[]>("/sectors"),
  getSector: (id: string) => realRequest<Sector>(`/sectors/${id}`),
  getSupervisors: () => realRequest<Supervisor[]>("/supervisors"),
  getNodes: (sectorId?: string) =>
    realRequest<Node[]>(`/nodes${sectorId ? `?sectorId=${sectorId}` : ""}`),
  getNode: (id: string) => realRequest<Node>(`/nodes/${id}`),
  getAlerts: (sectorId?: string) =>
    realRequest<Alert[]>(`/alerts${sectorId ? `?sectorId=${sectorId}` : ""}`),
  getActiveAlerts: (sectorId?: string, page = 1, limit = 10, hazard?: string) =>
    realRequest<PaginatedResponse<Alert>>(`/alerts/active?page=${page}&limit=${limit}${sectorId ? `&sectorId=${sectorId}` : ""}${hazard ? `&hazard=${encodeURIComponent(hazard)}` : ""}`),
  getResolvedAlerts: (sectorId?: string, page = 1, limit = 5, hazard?: string) =>
    realRequest<PaginatedResponse<Alert>>(`/alerts/resolved?page=${page}&limit=${limit}${sectorId ? `&sectorId=${sectorId}` : ""}${hazard ? `&hazard=${encodeURIComponent(hazard)}` : ""}`),
  getAlertsSummary: (sectorId?: string) =>
    realRequest<AlertsSummary>(`/alerts/summary${sectorId ? `?sectorId=${sectorId}` : ""}`),
  acknowledgeAlert: (id: string, by: string) =>
    realRequest<Alert>(`/alerts/${id}/acknowledge`, { method: "POST", body: JSON.stringify({ by }) }),
  getSupervisorStats: (sectorId: string) => realRequest<SupervisorStats>(`/supervisor/sector/${sectorId}/stats`),
  getSupervisorEnvironment: (sectorId: string) => realRequest<SupervisorEnvironment>(`/supervisor/sector/${sectorId}/environment`),
  getSupervisorNodes: (sectorId: string) => realRequest<NodeSummary[]>(`/supervisor/sector/${sectorId}/nodes`),
};

export const api = config.useDummyApi ? dummyApi : realApi;
