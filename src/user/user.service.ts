import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashService } from 'src/auth/hashService.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConflictException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly hashService: HashService, private readonly prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    const { email, password, ...userData
    } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('A user with this email already exists.');
    }

    const hashedPassword = await this.hashService.hashPassword(password);

    return this.prisma.user.create({
      data: {
        ...userData, password: hashedPassword, email: email
      }
    })
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(userid: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: userid },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userid.id} not found`);
    }
    return user;

  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
