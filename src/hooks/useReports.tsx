
import { useQuery } from "@tanstack/react-query";
import { Report } from "@/types/report";
import { translations } from "@/translations/es";
import { api } from "@/utils/api";

export const useReports = () => {
  return useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      try {
        return await api.get("/reports") as Report[];
      } catch (error) {
        console.error("Error fetching reports:", error);
        throw new Error(translations.common.error);
      }
    },
  });
};
