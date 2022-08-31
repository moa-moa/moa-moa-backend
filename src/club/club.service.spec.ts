import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { ImageModule } from '../image/image.module';
import { CategoryModule } from '../category/category.module';
import { PrismaModule } from '../common/prisma.module';
import { ClubService } from './club.service';
import { UserModule } from '../user/user.module';

describe('ClubService', () => {
  let service: ClubService;

  const prismaClient = new PrismaClient();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule.forTest(prismaClient),
        CategoryModule,
        ImageModule,
        UserModule,
      ],
      providers: [ClubService],
    }).compile();

    service = module.get<ClubService>(ClubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
