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
  tagId?: TaskTag[];
}

export interface CreateTaskData {
  title: string;
  note?: string;
  dueDate?: string;
  completed: boolean;
  imageUri?: string | null;
  userId: string;
  taskTagIds?: string[];
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
  onToggle: (task: Task) => void;
  onDetail: (taskId: string) => void;
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

