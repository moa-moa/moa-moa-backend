import { Prisma } from '@prisma/client';
import { UpdateAvatarDto } from 'src/image/dto/update-avatar.dto';
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

export const validMockUpdateAvatar = (): UpdateAvatarDto => ({
  avatar: 'test update imageURL',
});
