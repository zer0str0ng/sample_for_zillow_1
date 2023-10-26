import 'reflect-metadata';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { HeaderEnum, JwtTokenPayload } from './../shared';
import { ILogger } from './../logger';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ValidateUserGuard implements CanActivate {
  constructor(private jwtService: JwtService, private logger: ILogger) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { headers, method, body, originalUrl } = context.switchToHttp().getRequest();

    const headerUserId = headers[HeaderEnum.USER_ID];

    const tokenPayload = this.jwtService.decode(headers?.authorization?.split('Bearer ')[1]) as JwtTokenPayload;

    const isSameUser = tokenPayload.sub === headerUserId;
    if (!isSameUser)
      this.logger.warn(
        `User token doesn't correspond with provided userId, forbidden resource ${JSON.stringify({
          originalUrl,
          method,
          headers,
          body,
        })}`
      );
    return isSameUser;
  }
}
