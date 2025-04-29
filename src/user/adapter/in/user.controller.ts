import { Controller, Get, Post, Body, Param, Inject } from '@nestjs/common';
import { UserUseCase } from 'src/user/application/port/in/user.usecase';

@Controller('user')
export class UserController {
  constructor(
    @Inject('UserService') private readonly userService: UserUseCase,
  ) { }

  @Post()
  create(@Body() request: any): Promise<void> {
    return this.userService.create(request.name);
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.userService.findById(id);
  }
}
