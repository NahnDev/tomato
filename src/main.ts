import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exception/HttpExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
    }),
  );
  // app.useGlobalFilters(new MongoExceptionsFilter(app.get(HttpAdapterHost)));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(
    session({ secret: 'nahndev', resave: false, saveUninitialized: false }),
  );

  const apiDocument = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Nahndev')
      .setDescription('API')
      .addBearerAuth()
      .setVersion('1.0')
      .build(),
  );
  SwaggerModule.setup('api-doc', app, apiDocument);
  await app.listen(8000);
}
bootstrap();
