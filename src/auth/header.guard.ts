import 'reflect-metadata';
import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { ClassType, transformAndValidate } from 'class-transformer-validator';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { SetMetadata } from '@nestjs/common';

export function ValidateHeaders(...types: ClassType<object>[]) {
  return SetMetadata('headerTypes', types);
}

@Injectable()
export class ValidateHeaderGuard implements CanActivate {
  constructor(@Inject('Reflector') private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const types = this.reflector.get<ClassType<object>[]>('headerTypes', context.getHandler());
    if (!types) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const headers = request.headers;
    return Promise.all(types.map((t) => transformAndValidate(t, headers))).then(() => true);
  }
}
