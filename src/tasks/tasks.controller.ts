import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { FastifyMulterFile } from '@nest-lab/fastify-multer';
import { TasksService } from './tasks.service';
import { Task, Prisma } from '@prisma/client';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    const taskInput = {
      ...createTaskDto,
      status: 'PENDING', // Or any default status
      user: { connect: { id: createTaskDto.userId } }, // Assuming userId is provided in CreateTaskDto
    };
    return this.tasksService.createTask(taskInput as Prisma.TaskCreateInput);
  }

  @Get()
  async getAllTasks(): Promise<Task[]> {
    return this.tasksService.getAllTasks();
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string): Promise<Task> {
    return this.tasksService.deleteTask(id);
  }

  @Put(':id/complete')
  async completeTask(@Param('id') id: string): Promise<Task> {
    return this.tasksService.completeTask(id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importTasks(
    @UploadedFile() file: FastifyMulterFile,
  ): Promise<{ count: number }> {
    const count = await this.tasksService.importTasksFromCSV(file.buffer);
    return { count };
  }
}
