
import { useState } from "react";
import { Report } from "@/types/report";
import { isWithinInterval, parseISO } from "date-fns";

export const useReportFilters = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [department, setDepartment] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const filterReports = (reports: Report[] | undefined) => {
    return reports?.filter((report) => {
      const matchesSearch = 
        search === "" || 
        report.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "all" || report.status === status;
      const matchesDepartment = 
        department === "all" || 
        report.department === department;
      
      let matchesDate = true;
      if (dateFrom && dateTo) {
        const reportDate = parseISO(report.created_at);
        matchesDate = isWithinInterval(reportDate, { 
          start: dateFrom, 
          end: dateTo 
        });
      }

      return matchesSearch && matchesStatus && matchesDepartment && matchesDate;
    });
  };

  return {
    filters: {
      search,
      setSearch,
      status,
      setStatus,
      department,
      setDepartment,
      dateFrom,
      setDateFrom,
      dateTo,
      setDateTo,
    },
    filterReports,
  };
};
