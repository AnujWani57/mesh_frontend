// Central TypeScript types for the MineMesh dashboard.
// These mirror the API response shapes documented in API_DOCUMENTATION.md.

export type Role = "admin" | "supervisor";

export type HealthStatus = "safe" | "warning" | "critical";

export type DeviceStatus = "online" | "offline";

export interface SensorReadings {
  temperature: number; // °C
  humidity: number; // %
  methane: number; // ppm (CH4)
  carbonMonoxide: number; // ppm (CO)
  oxygen: number; // % (O2)
}

export interface User {
  id: string;
  role: Role;
  name: string;
  employeeId: string;
  gender: string;
  phone: string;
  email: string;
  // admin-specific
  mineName?: string;
  companyName?: string;
  // supervisor-specific
  sectorId?: string;
  sectorName?: string;
  experienceYears?: number;
  joiningDate?: string;
  lastLogin?: string;
  avatarUrl?: string;
}

export interface AuthSession {
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
  role: Role;
}

export interface AdminSignupPayload {
  name: string;
  employeeId: string;
  gender: string;
  phone: string;
  email: string;
  password: string;
  mineName: string;
  companyName: string;
}

export interface SupervisorSignupPayload {
  name: string;
  employeeId: string;
  sectorId: string;
  gender: string;
  phone: string;
  email: string;
  password: string;
}

export interface Supervisor {
  id: string;
  name: string;
  employeeId: string;
  gender: string;
  phone: string;
  email: string;
  sectorId: string;
  sectorName: string;
  experienceYears: number;
  status: DeviceStatus;
  nodeCount: number;
  avatarUrl?: string;
}

export interface Sector {
  id: string;
  name: string;
  supervisor: Pick<Supervisor, "id" | "name" | "phone" | "email" | "employeeId">;
  activeNodes: number;
  inactiveNodes: number;
  averageReadings: SensorReadings;
  status: HealthStatus;
}

export interface WearableDevice {
  id: string; // wearable device ID e.g. WD-203
  workerName: string;
  workerId: string;
  nodeId: string;
  sectorId: string;
  coordinates: { x: number; y: number; z: number };
  readings: SensorReadings;
  heartRate?: number;
  battery: number; // %
  signalStrength: number; // RSSI dBm
  lastUpdated: string; // ISO
  status: DeviceStatus;
  health: HealthStatus;
}

export interface Node {
  id: string;
  name: string;
  sectorId: string;
  status: DeviceStatus;
  connectedDevices: number;
  signalStrength: string; // Excellent / Good / Weak
  battery: number; // %
  lastUpdated: string;
  devices: WearableDevice[];
}

export type HazardType =
  | "SOS Button Pressed"
  | "Methane High"
  | "Carbon Monoxide High"
  | "Low Oxygen"
  | "High Temperature"
  | "High Humidity";

export type AlertSeverity = HealthStatus;

export type AlertState = "active" | "resolved";

export interface Alert {
  id: string; // AL102
  deviceId: string; // wearable device ID
  workerName: string;
  nodeId: string;
  sectorId: string;
  hazard: HazardType;
  severity: AlertSeverity;
  time: string; // ISO
  state: AlertState;
  acknowledgedBy?: string;
  readings: SensorReadings;
  coordinates: { x: number; y: number; z: number };
}

export interface SosEvent {
  id: string;
  workerName: string;
  deviceId: string;
  sectorId: string;
  sectorName: string;
  nodeId: string;
  coordinates: { x: number; y: number; z: number };
  reason: HazardType;
  time: string;
}

export interface TrendPoint {
  time: string; // label
  temperature: number;
  humidity: number;
  methane: number;
  carbonMonoxide: number;
  oxygen: number;
}

export interface AdminDashboardStats {
  totalSectors: number;
  totalNodes: number;
  totalDevices: number;
  activeDevices: number;
  inactiveDevices: number;
  activeAlerts: number;
  workersInside: number;
  averageReadings: SensorReadings;
  trends: TrendPoint[];
  health: { safe: number; warning: number; critical: number };
  recentAlerts: Alert[];
}

export interface SupervisorHomeStats {
  sectorId: string;
  sectorName: string;
  averageReadings: SensorReadings;
  status: HealthStatus;
  trends: TrendPoint[];
  nodes: { id: string; name: string; status: DeviceStatus }[];
  totalWorkers: number;
  devicesOnline: number;
  sosCount: number;
  recentAlerts: Alert[];
}

export interface Thresholds {
  temperature: { warning: number; critical: number };
  humidity: { warning: number; critical: number };
  methane: { warning: number; critical: number };
  carbonMonoxide: { warning: number; critical: number };
  oxygen: { warningLow: number; criticalLow: number; warningHigh: number; criticalHigh: number };
}
