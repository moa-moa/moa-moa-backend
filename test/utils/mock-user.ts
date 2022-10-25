import { CreateUserDto } from 'src/user/dto/create-user.dto';
export const validMockUser = (): CreateUserDto => ({
  id: '1234',
  email: 'test1@moa.com',
  provider: 'google',
  name: 'test1name',
  hashedRt: '123',
});

export const validMockUser2 = (): CreateUserDto => ({
  id: '4321',
  email: 'test2@moa.com',
  provider: 'google',
  name: 'test2name',
  hashedRt: '321',
});

export const invalidMockUser = (): CreateUserDto => ({
  id: '',
  email: '',
  name: '',
  provider: '',
  hashedRt: '',
});
