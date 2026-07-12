import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export const useAdminStats = () =>
  useQuery({ queryKey: ["admin-stats"], queryFn: () => api.getAdminStats(), refetchInterval: 3000 });

export const useAdminEnvironment = () =>
  useQuery({ queryKey: ["admin-environment"], queryFn: () => api.getAdminEnvironment(), refetchInterval: 3000 });

export const useSectors = () =>
  useQuery({ queryKey: ["sectors"], queryFn: () => api.getSectors() });

export const useSector = (id: string) =>
  useQuery({ queryKey: ["sector", id], queryFn: () => api.getSector(id), enabled: !!id });

export const useSupervisors = () =>
  useQuery({ queryKey: ["supervisors"], queryFn: () => api.getSupervisors() });

export const useNodes = (sectorId?: string) =>
  useQuery({ queryKey: ["nodes", sectorId ?? "all"], queryFn: () => api.getNodes(sectorId), refetchInterval: 3000 });

export const useNode = (id: string) =>
  useQuery({ queryKey: ["node", id], queryFn: () => api.getNode(id), enabled: !!id, refetchInterval: 3000 });

export const useAlerts = (sectorId?: string) =>
  useQuery({ queryKey: ["alerts", sectorId ?? "all"], queryFn: () => api.getAlerts(sectorId), refetchInterval: 3000 });

export const useActiveAlerts = (sectorId?: string, page = 1, limit = 10, hazard?: string) =>
  useQuery({
    queryKey: ["alerts-active", sectorId ?? "all", page, limit, hazard ?? "any"],
    queryFn: () => api.getActiveAlerts(sectorId, page, limit, hazard),
    refetchInterval: 3000,
  });

export const useResolvedAlerts = (sectorId?: string, page = 1, limit = 5, hazard?: string) =>
  useQuery({
    queryKey: ["alerts-resolved", sectorId ?? "all", page, limit, hazard ?? "any"],
    queryFn: () => api.getResolvedAlerts(sectorId, page, limit, hazard),
    refetchInterval: 3000,
  });

export const useAlertsSummary = (sectorId?: string) =>
  useQuery({ queryKey: ["alerts-summary", sectorId ?? "all"], queryFn: () => api.getAlertsSummary(sectorId), refetchInterval: 3000 });

export const useAlertById = (alertId: string | null) =>
  useQuery({
    queryKey: ["alert-detail", alertId],
    queryFn: () => api.getAlertById(alertId!),
    enabled: !!alertId,
  });

export const useSupervisorStats = (sectorId: string) =>
  useQuery({
    queryKey: ["supervisor-stats", sectorId],
    queryFn: () => api.getSupervisorStats(sectorId),
    enabled: !!sectorId,
    refetchInterval: 3000,
  });

export const useSupervisorEnvironment = (sectorId: string) =>
  useQuery({
    queryKey: ["supervisor-environment", sectorId],
    queryFn: () => api.getSupervisorEnvironment(sectorId),
    enabled: !!sectorId,
    refetchInterval: 3000,
  });

export const useSupervisorNodes = (sectorId: string) =>
  useQuery({
    queryKey: ["supervisor-nodes", sectorId],
    queryFn: () => api.getSupervisorNodes(sectorId),
    enabled: !!sectorId,
    refetchInterval: 3000,
  });

export function useAcknowledgeAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, by }: { id: string; by: string }) => api.acknowledgeAlert(id, by),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["alerts-active"] });
      qc.invalidateQueries({ queryKey: ["alerts-resolved"] });
      qc.invalidateQueries({ queryKey: ["alerts-summary"] });
      qc.invalidateQueries({ queryKey: ["alerts"] }); // keep for any lingering usage
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      qc.invalidateQueries({ queryKey: ["supervisor-stats"] });
    },
  });
}
