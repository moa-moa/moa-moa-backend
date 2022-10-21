import { CreateClubDto } from "src/club/dto/create-club.dto";

export const validMockCreateClub = (categoryId: number, imageIds?: string[]): CreateClubDto => ({
    categoryId,
    title: "가제",
    description: "내용입니다",
    owner: '0',
    max: 10,
    imageIds,
})

export const validMockUpdateClub = (categoryId: number, imageIds?: string[]): CreateClubDto => ({
    categoryId,
    title: "업데이트한 클럽",
    description: "내용업뎃!",
    owner: '0',
})