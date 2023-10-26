import { AdminRoles, HeaderEnum, ServiceAlertInterface } from '../../../../shared';
import { AlertService } from '../../../../services';
import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import { GetAllDTO, ServiceAlertQueryDTO, ServiceAlertUpdateDTO, ValidateByUserDTO } from '../../../../dtos';
import { Headers } from '@nestjs/common';
import { JwtAuthGuard, ValidateHeaderGuard, ValidateRoles, ValidateUserGuard } from '../../../../auth';
import { UpdateResult } from 'typeorm';

@UseGuards(JwtAuthGuard, ValidateHeaderGuard)
@ValidateRoles(...AdminRoles)
@Controller('service/alert/admin')
export class ServiceAlertAdminController {
  constructor(private readonly alertService: AlertService) {}

  @Get()
  getAlerts(@Query() query: GetAllDTO): Promise<ServiceAlertInterface[]> {
    const { all } = query;
    return this.alertService.find({ onlyOpen: !all, relations: AlertService.ALL_SERVICE_RELATIONS });
  }

  @Put('dismiss')
  @UseGuards(JwtAuthGuard, ValidateHeaderGuard, ValidateUserGuard)
  dismissAlert(@Body() body: ServiceAlertUpdateDTO, @Headers() headers: ValidateByUserDTO): Promise<UpdateResult> {
    const userId = headers[HeaderEnum.USER_ID];
    return this.alertService.dismissAlert(userId, body);
  }

  @Get('trigger/processing')
  triggerAlertProcessing(@Body() body: ServiceAlertQueryDTO): Promise<void> {
    return this.alertService.processAlerts({
      userId: body?.userId,
      serviceId: body?.serviceId,
    });
  }
}
