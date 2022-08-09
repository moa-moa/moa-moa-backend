export class CreateClubDto {
  categoryId: number;
  title: string;
  description: string;
  owner: string;
  max?: number;
}
