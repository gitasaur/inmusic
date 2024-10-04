import { Module } from '@nestjs/common';
import { ProfilesModule } from './profiles/profiles.module';
import { ProductRegistrationsModule } from './product-registrations/product-registrations.module';
import { ProductModule } from './product/product.module';
import { ProductBundleModule } from './product-bundle/product-bundle.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/logging-interceptor';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ProfilesModule,
    ProductRegistrationsModule,
    ProductModule,
    ProductBundleModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
