# MineMesh — API Documentation & Database Schema

This document describes every API endpoint and the response shape the frontend
expects, plus a suggested database schema. Backend developers should implement
endpoints that return **exactly** these shapes.

## Configuration

The frontend switches between dummy data and the real backend with env vars:

```env
VITE_USE_DUMMY_API=true            # true = local dummy data, false = real backend
VITE_API_BASE_URL=https://api.example.com   # base URL used when the flag is false
```

- When `VITE_USE_DUMMY_API=false`, all requests go to `${VITE_API_BASE_URL}${path}`.
- All request/response bodies are JSON (`Content-Type: application/json`).
- Auth: on login/signup the backend returns a `token`. The frontend stores it and
  should send it as `Authorization: Bearer <token>` (wire this in
  `src/lib/api/index.ts` → `realRequest` when your auth is ready).

## Shared Types

```ts
Role = "admin" | "supervisor"
HealthStatus = "safe" | "warning" | "critical"
DeviceStatus = "online" | "offline"

SensorReadings {
  temperature: number   // °C
  humidity: number      // %
  methane: number       // ppm (CH4)
  carbonMonoxide: number// ppm (CO)
  oxygen: number        // % (O2)
}

Coordinates { x: number; y: number; z: number }
```

---

## Endpoints

### Auth

#### POST /auth/login
Request:
```json
{ "email": "admin@minemesh.io", "password": "admin123", "role": "admin" }
```
Response `200`:
```json
{
  "token": "jwt-token",
  "user": {
    "id": "u-admin-1", "role": "admin", "name": "Arjun Mehta",
    "employeeId": "EMP-A001", "gender": "Male", "phone": "+91 98200 11223",
    "email": "admin@minemesh.io", "mineName": "Jharia Coalfield",
    "companyName": "BharatMinerals Ltd.", "lastLogin": "2026-07-07T10:00:00Z"
  }
}
```
Errors: `401` invalid credentials, `403` role mismatch.

#### POST /auth/signup/admin
Request:
```json
{
  "name": "string", "employeeId": "string", "gender": "string",
  "phone": "string", "email": "string", "password": "string",
  "mineName": "string", "companyName": "string"
}
```
Response `201`: same `{ token, user }` shape as login (user.role = "admin").

#### POST /auth/signup/supervisor
Request:
```json
{
  "name": "string", "employeeId": "string", "sectorId": "sector-1",
  "gender": "string", "phone": "string", "email": "string", "password": "string"
}
```
Response `201`: `{ token, user }` with `user.role = "supervisor"`, `sectorId`, `sectorName`.

---

### Admin

#### GET /admin/dashboard
Response `200`:
```json
{
  "totalSectors": 3, "totalNodes": 6, "totalDevices": 12,
  "activeDevices": 10, "inactiveDevices": 2, "activeAlerts": 3,
  "workersInside": 10,
  "averageReadings": { "temperature": 31, "humidity": 61, "methane": 1180, "carbonMonoxide": 17, "oxygen": 20.3 },
  "trends": [ { "time": "09:00", "temperature": 31, "humidity": 61, "methane": 1180, "carbonMonoxide": 17, "oxygen": 20.3 } ],
  "health": { "safe": 0, "warning": 2, "critical": 1 },
  "recentAlerts": [ /* Alert[] (max 5) */ ]
}
```

#### GET /sectors
Response `200`: `Sector[]`
```json
[
  {
    "id": "sector-1", "name": "Sector 1",
    "supervisor": { "id": "u-sup-1", "name": "Rahul Sharma", "phone": "…", "email": "…", "employeeId": "EMP-S101" },
    "activeNodes": 2, "inactiveNodes": 0,
    "averageReadings": { "temperature": 29, "humidity": 58, "methane": 810, "carbonMonoxide": 10, "oxygen": 20.7 },
    "status": "warning"
  }
]
```

#### GET /sectors/:id
Response `200`: single `Sector`.

#### GET /supervisors
Response `200`: `Supervisor[]`
```json
[
  {
    "id": "u-sup-1", "name": "Rahul Sharma", "employeeId": "EMP-S101",
    "gender": "Male", "phone": "…", "email": "…", "sectorId": "sector-1",
    "sectorName": "Sector 1", "experienceYears": 8, "status": "online", "nodeCount": 2
  }
]
```

---

### Nodes & Devices

#### GET /nodes?sectorId=sector-1
`sectorId` optional (omit for all nodes). Response `200`: `Node[]`
```json
[
  {
    "id": "node-1-1", "name": "Node 1", "sectorId": "sector-1",
    "status": "online", "connectedDevices": 2, "signalStrength": "Excellent",
    "battery": 92, "lastUpdated": "2026-07-07T10:00:00Z",
    "devices": [
      {
        "id": "WD-101", "workerName": "Ramesh Yadav", "workerId": "W-1001",
        "nodeId": "node-1-1", "sectorId": "sector-1",
        "coordinates": { "x": 12, "y": 8, "z": 3 },
        "readings": { "temperature": 28, "humidity": 55, "methane": 420, "carbonMonoxide": 8, "oxygen": 20.9 },
        "heartRate": 78, "battery": 88, "signalStrength": -62,
        "lastUpdated": "2026-07-07T10:00:00Z", "status": "online", "health": "safe"
      }
    ]
  }
]
```

#### GET /nodes/:id
Response `200`: single `Node` (with `devices`).

---

### Alerts

#### GET /alerts?sectorId=sector-1
`sectorId` optional. Response `200`: `Alert[]`
```json
[
  {
    "id": "AL-102", "deviceId": "WD-203", "workerName": "Rahul Meena",
    "nodeId": "node-2-1", "sectorId": "sector-2", "hazard": "Methane High",
    "severity": "critical", "time": "2026-07-07T09:45:00Z", "state": "active",
    "acknowledgedBy": null,
    "readings": { "temperature": 39, "humidity": 74, "methane": 5200, "carbonMonoxide": 55, "oxygen": 17.8 },
    "coordinates": { "x": 20, "y": 15, "z": 4 }
  }
]
```
`hazard` ∈ `SOS Button Pressed | Methane High | Carbon Monoxide High | Low Oxygen | High Temperature | High Humidity`
`state` ∈ `active | resolved`

#### GET /alerts/active
Query Parameters: `sectorId` (optional), `page` (default: 1), `limit` (default: 10), `hazard` (optional filter, e.g., "SOS Button Pressed").
Response `200`: `PaginatedResponse<Alert>`

#### GET /alerts/resolved
Query Parameters: `sectorId` (optional), `page` (default: 1), `limit` (default: 5), `hazard` (optional filter).
Response `200`: `PaginatedResponse<Alert>`

#### GET /alerts/summary
Query Parameters: `sectorId` (optional).
Response `200`: `{ activeCount: number, resolvedCount: number, totalToday: number }`

#### POST /alerts/:id/acknowledge
Request: `{ "by": "Rahul Sharma" }`
Response `200`: the updated `Alert` with `state: "resolved"` and `acknowledgedBy` set.

---

### Supervisor

#### GET /supervisor/home?sectorId=sector-1
Response `200`:
```json
{
  "sectorId": "sector-1", "sectorName": "Sector 1",
  "averageReadings": { "temperature": 29, "humidity": 58, "methane": 810, "carbonMonoxide": 10, "oxygen": 20.7 },
  "status": "warning",
  "trends": [ /* TrendPoint[] */ ],
  "nodes": [ { "id": "node-1-1", "name": "Node 1", "status": "online" } ],
  "totalWorkers": 4, "devicesOnline": 4, "sosCount": 1,
  "recentAlerts": [ /* Alert[] (max 5) */ ]
}
```

#### (Recommended) Real-time SOS / alerts
The dummy build simulates SOS via a button. In production, push SOS/critical
events over **WebSocket** or **Server-Sent Events**, e.g. `GET /supervisor/stream?sectorId=…`,
emitting a `SosEvent`:
```json
{
  "id": "SOS-1", "workerName": "Rahul Meena", "deviceId": "WD-203",
  "sectorId": "sector-2", "sectorName": "Sector 2", "nodeId": "Node 1",
  "coordinates": { "x": 20, "y": 15, "z": 4 },
  "reason": "SOS Button Pressed", "time": "2026-07-07T09:45:00Z"
}
```

---

## Suggested Database Schema

```
mines
  id (pk), name, company_name, created_at

users
  id (pk), role ENUM('admin','supervisor'), name, employee_id (unique),
  gender, phone, email (unique), password_hash,
  mine_id (fk -> mines.id),
  sector_id (fk -> sectors.id, nullable),   -- supervisors only
  experience_years (nullable), joining_date, last_login, avatar_url

sectors
  id (pk), mine_id (fk -> mines.id), name,
  supervisor_id (fk -> users.id),
  status ENUM('safe','warning','critical')  -- can be derived from readings

nodes
  id (pk), sector_id (fk -> sectors.id), name,
  status ENUM('online','offline'), signal_strength TEXT,
  battery INT, last_updated TIMESTAMP

wearable_devices
  id (pk), node_id (fk -> nodes.id), sector_id (fk -> sectors.id),
  worker_name, worker_id, battery INT, signal_strength INT (RSSI),
  status ENUM('online','offline'), last_updated TIMESTAMP

readings                     -- time-series of device measurements
  id (pk), device_id (fk -> wearable_devices.id),
  temperature, humidity, methane, carbon_monoxide, oxygen, heart_rate,
  x, y, z, recorded_at TIMESTAMP

alerts
  id (pk), device_id (fk), node_id (fk), sector_id (fk),
  worker_name, hazard TEXT, severity ENUM('safe','warning','critical'),
  state ENUM('active','resolved'), acknowledged_by TEXT,
  temperature, humidity, methane, carbon_monoxide, oxygen,
  x, y, z, created_at TIMESTAMP

thresholds                   -- per-mine or per-sector overrides (optional)
  id (pk), scope_id, temperature_warning, temperature_critical,
  humidity_warning, humidity_critical, methane_warning, methane_critical,
  co_warning, co_critical, oxygen_warning_low, oxygen_critical_low,
  oxygen_warning_high, oxygen_critical_high
```

## Default Threshold Values

| Parameter        | Safe            | Warning                       | Critical            |
|------------------|-----------------|-------------------------------|---------------------|
| Temperature      | 20–35 °C        | 36–45 °C                      | > 45 °C             |
| Humidity         | 30–70 %         | 71–85 %                       | > 85 %              |
| Methane (CH₄)    | < 1000 ppm      | 1000–5000 ppm                 | > 5000 ppm          |
| Carbon Monoxide  | < 25 ppm        | 25–50 ppm                     | > 50 ppm            |
| Oxygen (O₂)      | 19.5–23.5 %     | 18–19.5 % or 23.5–25 %        | < 18 % or > 25 %    |

These are demo values; use mining-safety regulations for production.

## Frontend integration points

| Frontend call            | Endpoint                          | File |
|--------------------------|-----------------------------------|------|
| `api.login`              | `POST /auth/login`                | `src/lib/api/index.ts` |
| `api.signupAdmin`        | `POST /auth/signup/admin`         | `src/lib/api/index.ts` |
| `api.signupSupervisor`   | `POST /auth/signup/supervisor`    | `src/lib/api/index.ts` |
| `api.getAdminDashboard`  | `GET /admin/dashboard`            | `src/lib/api/index.ts` |
| `api.getSectors`         | `GET /sectors`                    | `src/lib/api/index.ts` |
| `api.getSector`          | `GET /sectors/:id`                | `src/lib/api/index.ts` |
| `api.getSupervisors`     | `GET /supervisors`                | `src/lib/api/index.ts` |
| `api.getNodes`           | `GET /nodes?sectorId=`            | `src/lib/api/index.ts` |
| `api.getNode`            | `GET /nodes/:id`                  | `src/lib/api/index.ts` |
| `api.getAlerts`          | `GET /alerts?sectorId=`           | `src/lib/api/index.ts` |
| `api.acknowledgeAlert`   | `POST /alerts/:id/acknowledge`    | `src/lib/api/index.ts` |
| `api.getSupervisorHome`  | `GET /supervisor/home?sectorId=`  | `src/lib/api/index.ts` |

To switch to your backend: set `VITE_USE_DUMMY_API=false`, set `VITE_API_BASE_URL`,
and ensure your endpoints return the shapes above. No frontend code changes needed.
