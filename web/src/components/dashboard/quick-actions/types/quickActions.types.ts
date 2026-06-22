/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export interface QuickAction {
  id: string;
  icon: React.ElementType;
  label: string;
  gradient: string;
  glow: string;
  accent: string;
  taskCount?: number;
  isPreset?: boolean;
}

export interface Task {
  id: string | number;
  label: string;
  done: boolean;
  time: string;
}
