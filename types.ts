// Interface for the core data structure
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  isToday: boolean;
}

// Props for screen components
export interface WelcomeScreenProps {
  onNavigateToTasks: () => void;
}

export interface TaskListScreenProps {
  onNavigateToDetails: (taskId: string) => void;
  onNavigateToSettings: () => void;
}

// Props for reusable components
export interface TaskListItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
}