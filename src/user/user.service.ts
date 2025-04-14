import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RefreshToken } from 'src/auth/entities/refresh-token.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshToken: Repository<RefreshToken>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const user = await this.usersRepository.findOneBy({ email: email });
    if (user) throw new BadRequestException('user already exist');
    const createUser = this.usersRepository.create(createUserDto);

    const saveUser = await this.usersRepository.save(createUser);

    return {
      message: 'user created',
      user: saveUser,
    };
  }

  async findAll() {
    const users = await this.usersRepository.find({
      relations: ['refreshTokens'],
    });
    if (!users) {
      throw new NotFoundException('no users founded');
    }
    return {
      length: users.length,
      users,
    };
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`no user for ${id} id`);
    }
    return {
      user,
    };
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`no user for ${id} id`);

    this.usersRepository.merge(user, updateUserDto);
    await this.usersRepository.save(user);
    return {
      message: 'user updated sucessfully',
      user,
    };
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`no user for ${id} id`);

    await this.usersRepository.remove(user);
    return {
      message: 'user deleted sucessfully',
    };
  }
}
