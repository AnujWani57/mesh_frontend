import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export const useAdminDashboard = () =>
  useQuery({ queryKey: ["admin-dashboard"], queryFn: () => api.getAdminDashboard() });

export const useSectors = () =>
  useQuery({ queryKey: ["sectors"], queryFn: () => api.getSectors() });

export const useSector = (id: string) =>
  useQuery({ queryKey: ["sector", id], queryFn: () => api.getSector(id), enabled: !!id });

export const useSupervisors = () =>
  useQuery({ queryKey: ["supervisors"], queryFn: () => api.getSupervisors() });

export const useNodes = (sectorId?: string) =>
  useQuery({ queryKey: ["nodes", sectorId ?? "all"], queryFn: () => api.getNodes(sectorId) });

export const useNode = (id: string) =>
  useQuery({ queryKey: ["node", id], queryFn: () => api.getNode(id), enabled: !!id });

export const useAlerts = (sectorId?: string) =>
  useQuery({ queryKey: ["alerts", sectorId ?? "all"], queryFn: () => api.getAlerts(sectorId) });

export const useSupervisorHome = (sectorId: string) =>
  useQuery({
    queryKey: ["supervisor-home", sectorId],
    queryFn: () => api.getSupervisorHome(sectorId),
    enabled: !!sectorId,
  });

export function useAcknowledgeAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, by }: { id: string; by: string }) => api.acknowledgeAlert(id, by),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["alerts"] });
      qc.invalidateQueries({ queryKey: ["admin-dashboard"] });
      qc.invalidateQueries({ queryKey: ["supervisor-home"] });
    },
  });
}
