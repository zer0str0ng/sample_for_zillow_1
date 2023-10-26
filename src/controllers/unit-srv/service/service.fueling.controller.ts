import { Body, Controller, Get, Post, UseGuards, Headers, Put, Delete, BadRequestException, Query } from '@nestjs/common';
import { JwtAuthGuard, ValidateHeaderGuard, ValidateHeaders, ValidateRoles, ValidateUserGuard } from './../../../auth';
import { OptionalDateRangeParamsDTO, UnitFuelingDTO, ValidateByResourceDTO, ValidateByUserDTO } from './../../../dtos';
import { AdminRoles, HeaderEnum, UnitFuelingInterface, UserRolesEnum } from './../../../shared';
import { FuelingService } from './../../../services';
import { DeleteResult } from 'typeorm';

@UseGuards(JwtAuthGuard, ValidateHeaderGuard)
@ValidateRoles(...AdminRoles, UserRolesEnum.DEBT)
@Controller('service/fueling')
export class ServiceFuelingController {
  constructor(private readonly fuelingService: FuelingService) {}

  @Get()
  getFuelingServices(@Query() params: OptionalDateRangeParamsDTO): Promise<UnitFuelingInterface[]> {
    return this.fuelingService.findAll({ ...params });
  }

  @Get('byUser')
  @ValidateRoles(...AdminRoles, UserRolesEnum.UNIT_OPERATOR)
  @UseGuards(JwtAuthGuard, ValidateHeaderGuard, ValidateUserGuard)
  getUserFuelingServices(@Headers() headers: ValidateByUserDTO, @Query() params: OptionalDateRangeParamsDTO): Promise<UnitFuelingInterface[]> {
    return this.fuelingService.findAll({ ...params, operatorId: headers[HeaderEnum.USER_ID] });
  }

  @Get('id')
  @ValidateHeaders(ValidateByResourceDTO)
  getFuelingService(@Headers() headers: ValidateByResourceDTO): Promise<UnitFuelingInterface> {
    const serviceId = headers[HeaderEnum.RESOURCE_ID];
    return this.fuelingService.findOne(serviceId);
  }

  @Post()
  @ValidateRoles(...AdminRoles, UserRolesEnum.UNIT_OPERATOR)
  @UseGuards(JwtAuthGuard, ValidateHeaderGuard, ValidateUserGuard)
  createFuelingService(@Headers() headers: ValidateByUserDTO, @Body() payload: UnitFuelingDTO): Promise<UnitFuelingInterface> {
    if (headers[HeaderEnum.USER_ID] !== payload.user.id) throw new BadRequestException("Validated User ID doesn't corresponds with service creation User ID");

    return this.fuelingService.create(payload);
  }

  @Put()
  updateFuelingService(@Body() payload: UnitFuelingDTO): Promise<UnitFuelingInterface> {
    return this.fuelingService.update(payload);
  }

  @Delete()
  deleteFuelingService(@Headers() headers: ValidateByResourceDTO): Promise<boolean> {
    return this.fuelingService.remove(headers[HeaderEnum.RESOURCE_ID]);
  }
}
