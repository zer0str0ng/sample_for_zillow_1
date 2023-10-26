import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { HeaderEnum, JwtTokenPayload } from './../shared';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class UserRolesInterceptor implements NestInterceptor {
  constructor(private jwtService: JwtService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<Response> {
    const request = context.switchToHttp().getRequest();
    const { headers } = request;
    const tokenPayload = this.jwtService.decode(headers?.authorization?.split('Bearer ')[1]) as JwtTokenPayload;

    request.headers[HeaderEnum.USER_ROLES] = tokenPayload.roles;

    return next.handle();
  }
}
