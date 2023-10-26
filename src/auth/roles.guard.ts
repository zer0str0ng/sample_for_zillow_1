import { ILogger } from './../logger';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenPayload, UserRolesEnum } from './../shared';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const ValidateRoles = (...roles: UserRolesEnum[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService, private logger: ILogger) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRolesEnum[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredRoles) {
      return true;
    }
    const { headers, method, body, originalUrl } = context.switchToHttp().getRequest();

    const tokenPayload = this.jwtService.decode(headers?.authorization?.split('Bearer ')[1]) as JwtTokenPayload;

    const isUnderRole = requiredRoles.some((role) => tokenPayload?.roles?.includes(role));

    if (!isUnderRole)
      this.logger.warn(
        `User tried to access role's forbidden resource ${JSON.stringify({
          originalUrl,
          method,
          headers,
          body,
        })}`
      );

    return isUnderRole;
  }
}
