import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockUser = { id: 1, username: 'test user' };

// Since we are doing unit testing(testing an isolated unit of code), we do not want to use the real TaskRepository to avoid interacting with a DB
const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
});

describe('TasksService', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = moduleRef.get<TasksService>(TasksService);
    taskRepository = moduleRef.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('gets all tasks from the repository', async () => {
      // getTasks returns a promise
      taskRepository.getTasks.mockResolvedValue('some value');

      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      const filters: GetTasksFilterDto = {
        status: TaskStatus.Ongoing,
        search: 'some search query',
      };
      const result = await tasksService.getTasks(filters, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('some value');
    });
  });

  describe('getTaskById', () => {
    it('calls taskRepository.findOne(), retrieve, and return a task', async () => {
      const mockTask = {
        title: 'test task',
        description: 'test description',
      };
      taskRepository.findOne.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: mockUser.id },
      });
    });

    it('throws an error as task is not found', async () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createTask', () => {
    it('calls taskRepository.createTask() and return the newly created task', async () => {
      const mockTask = {
        title: 'test task',
        description: 'test description',
      };
      taskRepository.createTask.mockResolvedValue(mockTask);

      expect(taskRepository.createTask).not.toHaveBeenCalled();

      const createTaskDto: CreateTaskDto = mockTask;
      const result = await tasksService.createTask(createTaskDto, mockUser);

      expect(taskRepository.createTask).toHaveBeenCalledWith(
        createTaskDto,
        mockUser,
      );
      expect(result).toEqual(mockTask);
    });
  });

  describe('deleteTask', () => {
    it('calls taskRepository.delete() to delete a task', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 1 });

      expect(taskRepository.delete).not.toHaveBeenCalled();

      await tasksService.deleteTask(1, mockUser);

      expect(taskRepository.delete).toHaveBeenCalledWith({
        id: 1,
        userId: mockUser.id,
      });
    });

    it('throws an error as task is not found', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 });
      expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateTaskStatus', () => {
    it('updates a task status', async () => {
      const save = jest.fn().mockResolvedValue(true);

      // Must return a task object where the status(property) can be changed and then it can be saved(save method)
      tasksService.getTaskById = jest
        .fn()
        .mockResolvedValue({ status: TaskStatus.Open, save });

      expect(tasksService.getTaskById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();

      const result = await tasksService.updateTaskStatus(
        1,
        TaskStatus.Done,
        mockUser,
      );

      expect(tasksService.getTaskById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.Done);
    });
  });
});
