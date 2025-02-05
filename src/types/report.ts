export type ReportStatus = 'Pendiente' | 'En Progreso' | 'Resuelto';

export interface Report {
  id: number;
  title: string;
  description: string;
  status: ReportStatus;
  priority: 'Baja' | 'Media' | 'Alta';
  created_by: number;
  assigned_to?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateReportDTO {
  title: string;
  description: string;
  priority: Report['priority'];
}