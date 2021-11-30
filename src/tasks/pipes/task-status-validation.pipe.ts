import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.Open,
    TaskStatus.Ongoing,
    TaskStatus.Done,
  ];

  transform(value: any) {
    value = value.toLowerCase();

    if (!this.allowedStatuses.includes(value)) {
      throw new BadRequestException('The status provided is invalid');
    }

    return value;
  }
}
