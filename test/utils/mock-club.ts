import { CreateClubDto } from 'src/club/dto/create-club.dto';

export const validMockCreateClub = (
  categoryId: number,
  userId: string,
  imageIds?: string[],
): CreateClubDto => ({
  categoryId,
  title: '가제',
  description: '내용입니다',
  owner: userId,
  max: 10,
  imageIds,
});

export const validMockUpdateClub = (
  categoryId: number,
  userId: string,
  imageIds?: string[],
): CreateClubDto => ({
  categoryId,
  title: '업데이트한 클럽',
  description: '내용업뎃!',
  owner: userId,
});
