import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from './common/prisma.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { NotFoundExceptionFilter } from './common/notfound-exception.filter';
import { PrismaClientExceptionFilter } from './common/prisma-client-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  app.useStaticAssets(join(__dirname, '..', 'public'));

  setupSwagger(app);

  app.useGlobalFilters(
    new NotFoundExceptionFilter(),
    new PrismaClientExceptionFilter(),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(cookieParser());
  app.enableCors();
  const port = parseInt(process.env.PORT) || 3000;
  await app.listen(port, () => {
    console.log('Hello world listening on port', port);
  });
}
bootstrap();

//웹 페이지를 새로고침을 해도 Token 값 유지
const swaggerCustomOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
};

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Moa-Moa API')
    .setDescription('description')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'accessToken',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, swaggerCustomOptions);
}
