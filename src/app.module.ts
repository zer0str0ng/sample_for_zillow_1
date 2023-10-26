import { AppConfig, AppConfigSchema } from './app.config';
import { ConfigModule } from '@nestjs/config';
import { MiscModule, TypeORMModule } from './modules';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [AppConfig],
      validationSchema: AppConfigSchema,
    }),
    TypeORMModule,
    MiscModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
