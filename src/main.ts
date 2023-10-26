import { AppModule } from './app.module';
import { HttpExceptionFilter, MAX_FILE_UPLOAD_SIZE_MB } from './utils';
import { ILogger } from './logger';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ILogger(),
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(json({ limit: MAX_FILE_UPLOAD_SIZE_MB + 'mb' }));
  app.use(
    urlencoded({
      extended: true,
      limit: MAX_FILE_UPLOAD_SIZE_MB + 'mb',
    })
  );

  app.enableCors();
  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('Pub-Sub-Core API')
    .setDescription('Gigabyte API description, this is only for High Level reference, low level details are available in http example files for developers')
    .setVersion('1.0')
    .addTag('gigabyte-core')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
