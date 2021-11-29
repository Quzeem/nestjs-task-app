export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

export enum TaskStatus {
  Open = 'open',
  Ongoing = 'ongoing',
  Done = 'done',
}
