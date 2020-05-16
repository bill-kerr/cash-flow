import { User, UserRepository, CreateUserDto } from '../models/user.model';

class UserService {
  static createUser(createUserDto: CreateUserDto): Promise<User> {
    return UserRepository.create(createUserDto);
  }
}

export { UserService };