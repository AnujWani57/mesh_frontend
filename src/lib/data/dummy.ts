import type {
  Alert,
  Node,
  Sector,
  Supervisor,
  TrendPoint,
  User,
  WearableDevice,
} from "../types";

// ---------------------------------------------------------------------------
// Mock credentials (email -> password). Used by the dummy auth endpoint.
// ---------------------------------------------------------------------------
export const MOCK_CREDENTIALS: Record<string, { password: string; userId: string }> = {
  "admin@minemesh.io": { password: "admin123", userId: "u-admin-1" },
  "rahul@minemesh.io": { password: "super123", userId: "u-sup-1" },
  "aisha@minemesh.io": { password: "super123", userId: "u-sup-2" },
  "vikram@minemesh.io": { password: "super123", userId: "u-sup-3" },
};

export const MOCK_USERS: Record<string, User> = {
  "u-admin-1": {
    id: "u-admin-1",
    role: "admin",
    name: "Arjun Mehta",
    employeeId: "EMP-A001",
    gender: "Male",
    phone: "+91 98200 11223",
    email: "admin@minemesh.io",
    mineName: "Jharia Coalfield",
    companyName: "BharatMinerals Ltd.",
    lastLogin: new Date().toISOString(),
    avatarUrl: "",
  },
  "u-sup-1": {
    id: "u-sup-1",
    role: "supervisor",
    name: "Rahul Sharma",
    employeeId: "EMP-S101",
    gender: "Male",
    phone: "+91 98111 22334",
    email: "rahul@minemesh.io",
    sectorId: "sector-1",
    sectorName: "Sector 1",
    experienceYears: 8,
    joiningDate: "2019-03-12",
    lastLogin: new Date().toISOString(),
  },
  "u-sup-2": {
    id: "u-sup-2",
    role: "supervisor",
    name: "Aisha Khan",
    employeeId: "EMP-S102",
    gender: "Female",
    phone: "+91 98222 44556",
    email: "aisha@minemesh.io",
    sectorId: "sector-2",
    sectorName: "Sector 2",
    experienceYears: 6,
    joiningDate: "2020-07-01",
    lastLogin: new Date().toISOString(),
  },
  "u-sup-3": {
    id: "u-sup-3",
    role: "supervisor",
    name: "Vikram Rao",
    employeeId: "EMP-S103",
    gender: "Male",
    phone: "+91 98333 66778",
    email: "vikram@minemesh.io",
    sectorId: "sector-3",
    sectorName: "Sector 3",
    experienceYears: 10,
    joiningDate: "2017-11-20",
    lastLogin: new Date().toISOString(),
  },
};

export const SUPERVISORS: Supervisor[] = [
  {
    id: "u-sup-1",
    name: "Rahul Sharma",
    employeeId: "EMP-S101",
    gender: "Male",
    phone: "+91 98111 22334",
    email: "rahul@minemesh.io",
    sectorId: "sector-1",
    sectorName: "Sector 1",
    experienceYears: 8,
    status: "online",
    nodeCount: 2,
  },
  {
    id: "u-sup-2",
    name: "Aisha Khan",
    employeeId: "EMP-S102",
    gender: "Female",
    phone: "+91 98222 44556",
    email: "aisha@minemesh.io",
    sectorId: "sector-2",
    sectorName: "Sector 2",
    experienceYears: 6,
    status: "online",
    nodeCount: 2,
  },
  {
    id: "u-sup-3",
    name: "Vikram Rao",
    employeeId: "EMP-S103",
    gender: "Male",
    phone: "+91 98333 66778",
    email: "vikram@minemesh.io",
    sectorId: "sector-3",
    sectorName: "Sector 3",
    experienceYears: 10,
    status: "offline",
    nodeCount: 2,
  },
];

function device(
  id: string,
  workerName: string,
  workerId: string,
  nodeId: string,
  sectorId: string,
  partial: Partial<WearableDevice> = {},
): WearableDevice {
  return {
    id,
    workerName,
    workerId,
    nodeId,
    sectorId,
    coordinates: partial.coordinates ?? { x: 20, y: 15, z: 4 },
    readings: partial.readings ?? {
      temperature: 28,
      humidity: 55,
      methane: 420,
      carbonMonoxide: 8,
      oxygen: 20.9,
    },
    heartRate: partial.heartRate ?? 78,
    battery: partial.battery ?? 88,
    signalStrength: partial.signalStrength ?? -62,
    lastUpdated: new Date().toISOString(),
    status: partial.status ?? "online",
    health: partial.health ?? "safe",
  };
}

// 3 sectors x 2 nodes x 2 devices = 12 wearable devices
export const NODES: Node[] = [
  {
    id: "node-1-1",
    name: "Node 1",
    sectorId: "sector-1",
    status: "online",
    connectedDevices: 2,
    signalStrength: "Excellent",
    battery: 92,
    lastUpdated: new Date().toISOString(),
    devices: [
      device("WD-101", "Ramesh Yadav", "W-1001", "node-1-1", "sector-1", {
        coordinates: { x: 12, y: 8, z: 3 },
      }),
      device("WD-102", "Suresh Patil", "W-1002", "node-1-1", "sector-1", {
        coordinates: { x: 18, y: 11, z: 3 },
        readings: { temperature: 31, humidity: 62, methane: 1200, carbonMonoxide: 12, oxygen: 20.6 },
        health: "warning",
      }),
    ],
  },
  {
    id: "node-1-2",
    name: "Node 2",
    sectorId: "sector-1",
    status: "online",
    connectedDevices: 2,
    signalStrength: "Good",
    battery: 79,
    lastUpdated: new Date().toISOString(),
    devices: [
      device("WD-103", "Manoj Gupta", "W-1003", "node-1-2", "sector-1"),
      device("WD-104", "Deepak Verma", "W-1004", "node-1-2", "sector-1", {
        battery: 45,
      }),
    ],
  },
  {
    id: "node-2-1",
    name: "Node 1",
    sectorId: "sector-2",
    status: "online",
    connectedDevices: 2,
    signalStrength: "Excellent",
    battery: 88,
    lastUpdated: new Date().toISOString(),
    devices: [
      device("WD-201", "Karan Singh", "W-2001", "node-2-1", "sector-2"),
      device("WD-203", "Rahul Meena", "W-2003", "node-2-1", "sector-2", {
        coordinates: { x: 20, y: 15, z: 4 },
        readings: { temperature: 39, humidity: 74, methane: 5200, carbonMonoxide: 55, oxygen: 17.8 },
        health: "critical",
      }),
    ],
  },
  {
    id: "node-2-2",
    name: "Node 2",
    sectorId: "sector-2",
    status: "online",
    connectedDevices: 2,
    signalStrength: "Good",
    battery: 81,
    lastUpdated: new Date().toISOString(),
    devices: [
      device("WD-204", "Ajay Kumar", "W-2004", "node-2-2", "sector-2"),
      device("WD-205", "Nikhil Joshi", "W-2005", "node-2-2", "sector-2"),
    ],
  },
  {
    id: "node-3-1",
    name: "Node 1",
    sectorId: "sector-3",
    status: "offline",
    connectedDevices: 2,
    signalStrength: "Weak",
    battery: 34,
    lastUpdated: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    devices: [
      device("WD-301", "Sanjay Dubey", "W-3001", "node-3-1", "sector-3", { status: "offline" }),
      device("WD-302", "Alok Nair", "W-3002", "node-3-1", "sector-3", { status: "offline" }),
    ],
  },
  {
    id: "node-3-2",
    name: "Node 2",
    sectorId: "sector-3",
    status: "online",
    connectedDevices: 2,
    signalStrength: "Good",
    battery: 76,
    lastUpdated: new Date().toISOString(),
    devices: [
      device("WD-303", "Prakash Iyer", "W-3003", "node-3-2", "sector-3", {
        readings: { temperature: 33, humidity: 68, methane: 900, carbonMonoxide: 20, oxygen: 20.2 },
        health: "warning",
      }),
      device("WD-304", "Rohit Sharma", "W-3004", "node-3-2", "sector-3"),
    ],
  },
];

export const SECTORS: Sector[] = [
  {
    id: "sector-1",
    name: "Sector 1",
    supervisor: {
      id: "u-sup-1",
      name: "Rahul Sharma",
      phone: "+91 98111 22334",
      email: "rahul@minemesh.io",
      employeeId: "EMP-S101",
    },
    activeNodes: 2,
    inactiveNodes: 0,
    averageReadings: { temperature: 29, humidity: 58, methane: 810, carbonMonoxide: 10, oxygen: 20.7 },
    status: "warning",
  },
  {
    id: "sector-2",
    name: "Sector 2",
    supervisor: {
      id: "u-sup-2",
      name: "Aisha Khan",
      phone: "+91 98222 44556",
      email: "aisha@minemesh.io",
      employeeId: "EMP-S102",
    },
    activeNodes: 2,
    inactiveNodes: 0,
    averageReadings: { temperature: 34, humidity: 66, methane: 2100, carbonMonoxide: 28, oxygen: 19.6 },
    status: "critical",
  },
  {
    id: "sector-3",
    name: "Sector 3",
    supervisor: {
      id: "u-sup-3",
      name: "Vikram Rao",
      phone: "+91 98333 66778",
      email: "vikram@minemesh.io",
      employeeId: "EMP-S103",
    },
    activeNodes: 1,
    inactiveNodes: 1,
    averageReadings: { temperature: 30, humidity: 60, methane: 640, carbonMonoxide: 14, oxygen: 20.5 },
    status: "warning",
  },
];

export const ALERTS: Alert[] = [
  {
    id: "AL-102",
    deviceId: "WD-203",
    workerName: "Rahul Meena",
    nodeId: "node-2-1",
    sectorId: "sector-2",
    hazard: "Methane High",
    severity: "critical",
    time: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
    state: "active",
    readings: { temperature: 39, humidity: 74, methane: 5200, carbonMonoxide: 55, oxygen: 17.8 },
    coordinates: { x: 20, y: 15, z: 4 },
  },
  {
    id: "AL-103",
    deviceId: "WD-102",
    workerName: "Suresh Patil",
    nodeId: "node-1-1",
    sectorId: "sector-1",
    hazard: "High Temperature",
    severity: "warning",
    time: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    state: "active",
    readings: { temperature: 41, humidity: 62, methane: 1200, carbonMonoxide: 12, oxygen: 20.6 },
    coordinates: { x: 18, y: 11, z: 3 },
  },
  {
    id: "AL-104",
    deviceId: "WD-303",
    workerName: "Prakash Iyer",
    nodeId: "node-3-2",
    sectorId: "sector-3",
    hazard: "Carbon Monoxide High",
    severity: "warning",
    time: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    state: "active",
    readings: { temperature: 33, humidity: 68, methane: 900, carbonMonoxide: 30, oxygen: 20.2 },
    coordinates: { x: 22, y: 9, z: 5 },
  },
  {
    id: "AL-098",
    deviceId: "WD-205",
    workerName: "Nikhil Joshi",
    nodeId: "node-2-2",
    sectorId: "sector-2",
    hazard: "Low Oxygen",
    severity: "critical",
    time: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    state: "resolved",
    acknowledgedBy: "Aisha Khan",
    readings: { temperature: 30, humidity: 60, methane: 700, carbonMonoxide: 18, oxygen: 17.5 },
    coordinates: { x: 14, y: 12, z: 4 },
  },
  {
    id: "AL-095",
    deviceId: "WD-101",
    workerName: "Ramesh Yadav",
    nodeId: "node-1-1",
    sectorId: "sector-1",
    hazard: "SOS Button Pressed",
    severity: "critical",
    time: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    state: "resolved",
    acknowledgedBy: "Rahul Sharma",
    readings: { temperature: 28, humidity: 55, methane: 420, carbonMonoxide: 8, oxygen: 20.9 },
    coordinates: { x: 12, y: 8, z: 3 },
  },
];

export function makeTrends(base: {
  temperature: number;
  humidity: number;
  methane: number;
  carbonMonoxide: number;
  oxygen: number;
}): TrendPoint[] {
  const labels = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"];
  return labels.map((time, i) => {
    const wobble = (n: number, amp: number) =>
      Math.round((n + Math.sin(i * 1.2) * amp) * 10) / 10;
    return {
      time,
      temperature: wobble(base.temperature, 2),
      humidity: wobble(base.humidity, 4),
      methane: Math.round(base.methane + Math.sin(i) * base.methane * 0.15),
      carbonMonoxide: wobble(base.carbonMonoxide, 3),
      oxygen: wobble(base.oxygen, 0.4),
    };
  });
}
