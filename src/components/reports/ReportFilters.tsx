import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReportStatus, ReportDepartment } from "@/types/report";

interface ReportFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  department: string;
  setDepartment: (value: string) => void;
}

export function ReportFilters({
  search,
  setSearch,
  status,
  setStatus,
  department,
  setDepartment,
}: ReportFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Buscar por título..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="w-full md:w-48">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Pendiente">Pendiente</SelectItem>
            <SelectItem value="En Progreso">En Progreso</SelectItem>
            <SelectItem value="Resuelto">Resuelto</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full md:w-48">
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger>
            <SelectValue placeholder="Departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Logística">Logística</SelectItem>
            <SelectItem value="Informática">Informática</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}