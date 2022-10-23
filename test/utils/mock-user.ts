import { Prisma } from '@prisma/client';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
export const validMockUser = (
  fields?: Partial<Prisma.UserCreateInput>,
): CreateUserDto => ({
  id: '1234',
  email: 'test1@moa.com',
  provider: 'google',
  name: 'test1name',
  ...fields,
  hashedRt: '123',
});

export const validMockUser2 = (
  fields?: Partial<Prisma.UserCreateInput>,
): CreateUserDto => ({
  id: '4321',
  email: 'test2@moa.com',
  provider: 'google',
  name: 'test2name',
  ...fields,
  hashedRt: '321',
});

export const invalidMockUser = (
  fields?: Partial<Prisma.UserCreateInput>,
): CreateUserDto => ({
  id: '',
  email: '',
  name: '',
  provider: '',
  ...fields,
  hashedRt: '',
});
