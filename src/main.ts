import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.use(
    session({ secret: 'nahndev', resave: false, saveUninitialized: false }),
  );

  const apiDocument = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Nahndev')
      .setDescription('API')
      .setVersion('1.0')
      .build(),
  );
  SwaggerModule.setup('api-doc', app, apiDocument);
  await app.listen(8000);
}
bootstrap();
