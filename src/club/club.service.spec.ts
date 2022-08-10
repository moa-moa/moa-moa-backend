import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PrismaModule } from '../common/prisma.module';
import { ClubService } from './club.service';

describe('ClubService', () => {
  let service: ClubService;

  const prismaClient = new PrismaClient();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule.forTest(prismaClient)],
      providers: [ClubService],
    }).compile();

    service = module.get<ClubService>(ClubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
