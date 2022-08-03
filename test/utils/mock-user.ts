import { Prisma } from '@prisma/client';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
export const validMockUser = (
  fields?: Partial<Prisma.UserCreateInput>,
): Prisma.UserCreateInput => ({
  email: 'test1@moa.com',
  name: 'test1name',
  ...fields,
});

export const invalidMockUser = (
  fields?: Partial<Prisma.UserCreateInput>,
): Prisma.UserCreateInput => ({
  email: '',
  name: '',
  ...fields,
});

export const validMockUpdateUser = (): UpdateUserDto => ({
  name: 'test update name',
});
