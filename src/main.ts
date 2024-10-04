import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ReflectionService } from '@grpc/reflection';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { GrpcExceptionFilter } from './common/grpc-exception.filter';
import { NotFoundRedirectFilter } from './common/not-found-redirect.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: [
        'in_music_api',
      ],
      protoPath: [
        join(__dirname, '../../proto', 'in_music_api.proto'),
      ],
      loader: {
        includeDirs: [
          join(__dirname, '../../proto'),
        ],
      },
      onLoadPackageDefinition: (pkg, server) => {
        new ReflectionService(pkg).addToServer(server);
      },
      url: '0.0.0.0:50051',
    },
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('inMusic API')
    .setDescription('API for managing customer profiles, products, registrations and bundles')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(new GrpcExceptionFilter());
  app.useGlobalFilters(new NotFoundRedirectFilter());

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
