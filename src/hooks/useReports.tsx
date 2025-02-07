
import { useQuery } from "@tanstack/react-query";
import { Report } from "@/types/report";
import { translations } from "@/translations/es";

export const useReports = () => {
  return useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const response = await fetch("/api/reports", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error(translations.common.error);
      return response.json() as Promise<Report[]>;
    },
  });
};
