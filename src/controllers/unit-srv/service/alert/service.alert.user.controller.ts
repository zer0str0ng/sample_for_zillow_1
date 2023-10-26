import { AlertService } from './../../../../services';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { HeaderEnum, ServiceAlertInterface, UserRolesEnum } from './../../../../shared';
import { Headers } from '@nestjs/common';
import { JwtAuthGuard, ValidateHeaderGuard, ValidateRoles, ValidateUserGuard } from './../../../../auth';
import { ValidateByUserDTO } from './../../../../dtos';

@UseGuards(JwtAuthGuard, ValidateHeaderGuard, ValidateUserGuard)
@ValidateRoles(UserRolesEnum.UNIT_OPERATOR)
@Controller('service/alert/user')
export class ServiceAlertUserController {
  constructor(private readonly alertService: AlertService) {}

  @Get()
  getAlertsByUser(@Headers() headers: ValidateByUserDTO): Promise<ServiceAlertInterface[]> {
    const userId = headers[HeaderEnum.USER_ID];
    return this.alertService.find({ onlyOpen: true, userId, relations: AlertService.ALL_SERVICE_RELATIONS });
  }
}
