import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task, Prisma, TaskStatus } from '@prisma/client';
import { parse } from 'csv-parse/sync';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async createTask(data: Prisma.TaskCreateInput): Promise<Task> {
    return this.prisma.task.create({ data });
  }

  async getAllTasks(): Promise<Task[]> {
    return this.prisma.task.findMany();
  }

  async updateTask(id: string, data: Prisma.TaskUpdateInput): Promise<Task> {
    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  async deleteTask(id: string): Promise<Task> {
    return this.prisma.task.delete({
      where: { id },
    });
  }

  async completeTask(id: string): Promise<Task> {
    return this.prisma.task.update({
      where: { id },
      data: { status: 'DONE' },
    });
  }

  async importTasksFromCSV(fileBuffer: Buffer): Promise<number> {
    const records = await this.parseCSV(fileBuffer);
    const tasks = records.map((record) => ({
      title: record.title,
      description: record.description,
      status: 'TODO',
      userId: record.userId, // Certifique-se de que o CSV inclui o userId ou ajuste conforme necessário
    }));

    const result = await this.prisma.task.createMany({
      data: tasks.map((task) => ({
        ...task,
        status: task.status as TaskStatus,
      })),
      skipDuplicates: true,
    });

    return result.count;
  }

  private async parseCSV(fileBuffer: Buffer): Promise<any[]> {
    const records = parse(fileBuffer, {
      columns: true,
      skip_empty_lines: true,
    });
    return records;
  }
}
