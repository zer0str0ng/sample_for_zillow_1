import { ApiKeyStrategy, AuthMiddleware, JwtStrategy, RolesGuard } from './../auth';
import { APP_GUARD } from '@nestjs/core';
import { AzureStorageModule } from '@nestjs/azure-storage';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ILogger } from './../logger';
import { JwtModule } from '@nestjs/jwt';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import Controllers from './../controllers';
import Entities from './../entities';
import Services, { UserProfileService, UserService } from './../services';

@Module({
  imports: [
    TypeOrmModule.forFeature([...Entities]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    ScheduleModule.forRoot(),
    AzureStorageModule.withConfigAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          sasKey: configService.get<string>('AZURE_STORAGE_SAS_KEY'),
          accountName: configService.get<string>('AZURE_STORAGE_ACCOUNT'),
          containerName: configService.get<string>('AZURE_STORAGE_CONTAINER'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    ...Services,
    ILogger,
    JwtStrategy,
    ApiKeyStrategy,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: UserProfileService,
      useFactory: (userService: UserService) => {
        return new UserProfileService(userService);
      },
      inject: [UserService],
    },
  ],
  controllers: [...Controllers],
})
export class MiscModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(...Controllers);
  }
}
