import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export const useAdminDashboard = () =>
  useQuery({ queryKey: ["admin-dashboard"], queryFn: () => api.getAdminDashboard(), refetchInterval: 3000 });

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

export const useActiveAlerts = (sectorId?: string, page = 1, limit = 10) =>
  useQuery({ queryKey: ["alerts-active", sectorId ?? "all", page, limit], queryFn: () => api.getActiveAlerts(sectorId, page, limit), refetchInterval: 3000 });

export const useResolvedAlerts = (sectorId?: string, page = 1, limit = 5) =>
  useQuery({ queryKey: ["alerts-resolved", sectorId ?? "all", page, limit], queryFn: () => api.getResolvedAlerts(sectorId, page, limit), refetchInterval: 3000 });

export const useAlertsSummary = (sectorId?: string) =>
  useQuery({ queryKey: ["alerts-summary", sectorId ?? "all"], queryFn: () => api.getAlertsSummary(sectorId), refetchInterval: 3000 });

export const useSupervisorHome = (sectorId: string) =>
  useQuery({
    queryKey: ["supervisor-home", sectorId],
    queryFn: () => api.getSupervisorHome(sectorId),
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
      qc.invalidateQueries({ queryKey: ["admin-dashboard"] });
      qc.invalidateQueries({ queryKey: ["supervisor-home"] });
    },
  });
}
