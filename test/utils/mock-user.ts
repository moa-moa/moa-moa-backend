import { Prisma } from '@prisma/client';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
export const validMockUser = (
  fields?: Partial<Prisma.UserCreateInput>,
): CreateUserDto => ({
  id: '1234',
  email: 'test1@moa.com',
  provider: 'google',
  name: 'test1name',
  ...fields,
});

export const invalidMockUser = (
  fields?: Partial<Prisma.UserCreateInput>,
): CreateUserDto => ({
  id: '',
  email: '',
  name: '',
  provider: '',
  ...fields,
});

export const validMockUpdateUser = (): UpdateUserDto => ({
  name: 'test update name',
});
