export interface Task {
  $collectionId: string;
  $createdAt: string;
  $databaseId: string;
  $id: string;
  $permissions: string[];
  $sequence: number;
  $updatedAt: string;
  completed: boolean;
  dueDate: string;
  imageUri: string | null;
  note: string;
  title: string;
  userId: string;
  tags?: TaskTag[];
  tagId: string[];
}

export interface CreateTaskData {
  title: string;
  note?: string;
  dueDate?: string;
  completed: boolean;
  imageUri?: string | null;
  userId: string;
  tagId?: string[];
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
  task: any;
  onToggle: (taskId: string, isCompleted: boolean) => void;
}

export type TaskTag = {
  $collectionId: string;
  $createdAt: string;
  $databaseId: string;
  $id: string;
  $permissions: string[];
  $sequence: number;
  $updatedAt: string;
  description: string;
  tagName: string;
};

export interface EmptyStateProps {
  message?: string;
  imageSource?: any;
}
