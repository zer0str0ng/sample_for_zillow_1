import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import { UserAuthInterface } from './../../shared';
import { UserAuthService } from './../../services';
import { UserLoginDTO } from './../../dtos';
import { ValidateHeaderGuard, ValidateHeaders } from './../../auth';

@Controller('user/auth')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @Get('login')
  @UseGuards(ValidateHeaderGuard)
  @ValidateHeaders(UserLoginDTO)
  async loginUser(@Headers() headers: UserLoginDTO): Promise<UserAuthInterface> {
    return await this.userAuthService.authenticate(headers);
  }
}
