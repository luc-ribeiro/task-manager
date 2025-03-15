/**
 * Task attributes interface
 */
export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: 'pendente' | 'em andamento' | 'concluída';
  created_at: Date;
  updated_at: Date;
}

/**
 * Task creation attributes interface (ID is optional because it is auto-generated)
 */
export interface TaskCreationAttributes {
  title: string;
  description?: string | null;
  status?: 'pendente' | 'em andamento' | 'concluída';
}

/**
 * Task update attributes interface (all fields are optional)
 */
export interface TaskUpdateAttributes {
  title?: string;
  description?: string | null;
  status?: 'pendente' | 'em andamento' | 'concluída';
} 