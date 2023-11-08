import { Expose } from 'class-transformer';
import { Task } from '../../tasks/task.entity';

// What to return as a response from a user entity
export class UserDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  tasks: Task[];
}
