import { AdminRoles, HeaderEnum, UserRolesEnum } from './../../shared';
import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { Headers, Query } from '@nestjs/common';
import { JwtAuthGuard, ValidateHeaderGuard, ValidateHeaders, ValidateRoles, ValidateUserGuard } from './../../auth';
import { UserProfileService } from './../../services';
import { ValidateByUserDTO, UserProfileDTO, UserProfileSourceDTO } from './../../dtos';

@UseGuards(JwtAuthGuard, ValidateHeaderGuard, ValidateUserGuard)
@ValidateRoles(...AdminRoles, UserRolesEnum.UNIT_OPERATOR, UserRolesEnum.TECHNICIAN, UserRolesEnum.DEBT)
@ValidateHeaders(ValidateByUserDTO)
@Controller('user/profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get()
  getUserProfile(@Headers() headers: ValidateByUserDTO, @Query() params: UserProfileSourceDTO): Promise<Partial<UserProfileDTO>> {
    const source = params.source;
    const userId = headers[HeaderEnum.USER_ID];
    return this.userProfileService.getUserProfile(userId, source);
  }

  @Put()
  updateUserProfile(@Headers() headers: ValidateByUserDTO, @Body() payload: UserProfileDTO, @Query() params: UserProfileSourceDTO): Promise<Partial<UserProfileDTO>> {
    const source = params.source;
    const userId = headers[HeaderEnum.USER_ID];
    return this.userProfileService.updateUserProfile(
      {
        ...payload,
        // This is to ensure provided user id corresponds to header (which was already validated with ValidateUserGuard)
        id: userId,
      },
      source
    );
  }
}
