import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // signToken(payload: JwtPayload) {
  //   return this.jwtService.signAsync(payload);
  // }

  async signUp(dto: UserDto) {
    const { email, password } = dto;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User();
    user.email = email;
    user.password = hashedPassword;
    return user.save();
  }

  async login(dto: UserDto): Promise<string> {
    const { email, password } = dto;
    const user: User = await this.userRepository.findOne({ where: { email } });

    if (!user) throw new NotFoundException('Incorrect credentials');

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) throw new NotFoundException('Incorrect credentials');

    const payload = { sub: user.id, email: user.email };

    const access_token = await this.jwtService.signAsync(payload);

    return access_token;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // async updateStudentProfile()
}
