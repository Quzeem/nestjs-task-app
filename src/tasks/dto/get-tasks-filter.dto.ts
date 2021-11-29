import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { TaskStatus } from '../interfaces/task.interface';

export class GetTasksFilterDto {
  @IsOptional()
  @IsIn([TaskStatus.Open, TaskStatus.Ongoing, TaskStatus.Done])
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
