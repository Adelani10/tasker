export interface Task {
  id: string;
  text: string;
  completed: boolean;
  isToday: boolean;
  notes?: string;
  dueDate?: Date;
  tags?: TaskTag[];
  imageUri?: string;
}


export interface WelcomeScreenProps {
  onNavigateToTasks: () => void;
}

export interface TaskListScreenProps {
  onNavigateToDetails: (taskId: string) => void;
  onNavigateToSettings: () => void;
  onNavigateToCreateTask: () => void;
}

export interface TaskListItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
}

export type TaskTag = 'Personal' | 'Work' | 'Groceries' | 'Health' | 'Study' | 'Other';

export interface CreateTaskScreenProps {
  onSaveTask: (task: Omit<Task, 'id' | 'completed' | 'isToday'>) => void;
}