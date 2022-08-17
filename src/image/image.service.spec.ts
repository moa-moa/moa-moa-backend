import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PrismaModule } from '../common/prisma.module';
import { ImageService } from './image.service';

describe('ImageService', () => {
  let service: ImageService;

  const prismaClient = new PrismaClient();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule.forTest(prismaClient)],
      providers: [ImageService],
    }).compile();

    service = module.get<ImageService>(ImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
