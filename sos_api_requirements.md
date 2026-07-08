# SOS API Requirements

This document outlines the specific API requirements needed to power the SOS popups and the SOS Logs Dialog on the frontend.

## 1. Overview of SOS Events
An SOS event in the system is technically just an `Alert` with a specific `hazard` type, namely `"SOS Button Pressed"`. 

The frontend expects SOS events to have the same shape as any other alert, but filtered down to just this hazard type.

### Alert Response Shape
Whenever the frontend receives or fetches an SOS, it expects this JSON shape:
```json
{
  "id": "SOS-101",
  "deviceId": "WD-203",
  "workerName": "Rahul Meena",
  "nodeId": "node-2-1",
  "sectorId": "sector-2",
  "hazard": "SOS Button Pressed",
  "severity": "critical",
  "time": "2026-07-07T09:45:00Z",
  "state": "active",
  "acknowledgedBy": null,
  "readings": { 
    "temperature": 31, 
    "humidity": 61, 
    "methane": 1180, 
    "carbonMonoxide": 17, 
    "oxygen": 20.3 
  },
  "coordinates": { "x": 20, "y": 15, "z": 4 }
}
```

---

## 2. API Endpoints Required

To support the new SOS Dialog (which has tabs for "Active" and "Acknowledged" SOS logs), the existing paginated alerts endpoints must support an optional `hazard` query parameter.

### 2.1 Fetch Active SOS Logs
**Endpoint:** `GET /alerts/active`
**Description:** Fetches a paginated list of currently active (unacknowledged) alerts. We will pass `hazard=SOS Button Pressed` to filter for SOS only.

**Query Parameters:**
- `sectorId` (optional string): Filter by sector.
- `page` (number): The page number (default 1).
- `limit` (number): Items per page (e.g., 20).
- `hazard` (string): **MUST SUPPORT THIS** to filter by hazard type.

**Example Request from Frontend:**
`GET /alerts/active?sectorId=sector-1&page=1&limit=20&hazard=SOS%20Button%20Pressed`

**Expected Response `200 OK`:**
```json
{
  "data": [
    // Array of active Alert objects
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "totalCount": 1,
    "totalPages": 1
  }
}
```

### 2.2 Fetch Acknowledged (Resolved) SOS Logs
**Endpoint:** `GET /alerts/resolved`
**Description:** Fetches a paginated list of acknowledged/resolved alerts. We will pass `hazard=SOS Button Pressed` to filter for SOS only.

**Query Parameters:**
- `sectorId` (optional string)
- `page` (number)
- `limit` (number)
- `hazard` (string)

**Example Request from Frontend:**
`GET /alerts/resolved?sectorId=sector-1&page=1&limit=20&hazard=SOS%20Button%20Pressed`

**Expected Response `200 OK`:**
```json
{
  "data": [
    // Array of resolved Alert objects where `acknowledgedBy` is filled
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "totalCount": 5,
    "totalPages": 1
  }
}
```

---

## 3. Real-Time SOS Delivery (WebSocket/SSE)
For the 15-second toast popup to appear immediately when a worker presses the button, the backend must actively push the event to the frontend (rather than the frontend polling for it).

**Recommended Implementation:**
Use WebSockets or Server-Sent Events (SSE). When an SOS is triggered, emit an event (e.g., `"sos_triggered"`) with the exact `Alert` JSON payload shown in Section 1. The frontend will listen for this event and trigger the `triggerSos()` function to show the popup.
