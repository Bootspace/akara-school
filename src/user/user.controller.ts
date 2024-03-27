import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto';
import { GetUser } from './decorator';
import { JwtGuard } from './guard';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/signup')
  Signup(@Body() dto: UserDto) {
    return this.userService.signUp(dto);
  }

  @Get('/')
  Findall() {
    return this.userService.findAll();
  }

  @Post('/login')
  Login(@Body() dto: UserDto) {
    return this.userService.login(dto);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  Getme(@GetUser() user: User) {
    return user;
  }
}
