import { TaskStatus } from '../interfaces/task.interface';

export class GetTasksFilterDto {
  status: TaskStatus;
  search: string;
}
