import { User, CreateUserRequest, UpdateUserRequest } from '../../../shared/models/user.interface';

// Domain interfaces for User module
export interface UserRepository {
  findAll(params?: any): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  create(user: CreateUserRequest): Promise<User>;
  update(id: string, user: UpdateUserRequest): Promise<User>;
  delete(id: string): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
}

export interface UserUseCases {
  getAllUsers(params?: any): Promise<User[]>;
  getUserById(id: string): Promise<User>;
  createUser(userData: CreateUserRequest): Promise<User>;
  updateUser(id: string, userData: UpdateUserRequest): Promise<User>;
  deleteUser(id: string): Promise<void>;
  getUserByEmail(email: string): Promise<User>;
}
