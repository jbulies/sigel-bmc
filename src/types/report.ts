export type ReportStatus = 'Pendiente' | 'En Progreso' | 'Resuelto';
export type ReportDepartment = 'Logística' | 'Informática';

export interface Report {
  id: number;
  title: string;
  description: string;
  status: ReportStatus;
  priority: 'Baja' | 'Media' | 'Alta';
  department: ReportDepartment;
  created_by: number;
  created_by_name?: string;
  assigned_to?: number;
  assigned_to_name?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateReportDTO {
  title: string;
  description: string;
  priority: Report['priority'];
  department: ReportDepartment;
}