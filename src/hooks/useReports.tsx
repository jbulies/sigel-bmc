
import { useQuery } from "@tanstack/react-query";
import { Report } from "@/types/report";
import { translations } from "@/translations/es";

const API_BASE_URL = 'http://localhost:8080';

export const useReports = () => {
  return useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/reports`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || translations.common.error);
      }
      return response.json() as Promise<Report[]>;
    },
  });
};

