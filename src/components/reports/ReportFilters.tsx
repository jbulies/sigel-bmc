import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ReportFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  department: string;
  setDepartment: (value: string) => void;
  dateFrom: Date | undefined;
  setDateFrom: (date: Date | undefined) => void;
  dateTo: Date | undefined;
  setDateTo: (date: Date | undefined) => void;
}

export function ReportFilters({
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
}: ReportFiltersProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="w-full">
        <Input
          placeholder="Buscar por título..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFrom ? format(dateFrom, 'PP', { locale: es }) : 'Fecha desde'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateFrom}
              onSelect={setDateFrom}
              initialFocus
              locale={es}
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateTo ? format(dateTo, 'PP', { locale: es }) : 'Fecha hasta'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateTo}
              onSelect={setDateTo}
              initialFocus
              locale={es}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}