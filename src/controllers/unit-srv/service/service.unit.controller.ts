import { AdminRoles, HeaderEnum, ServiceUnitInterface, UserRolesEnum } from './../../../shared';
import { Body, Controller, Get, Post, UseGuards, Headers, Put, BadRequestException, Query, Delete } from '@nestjs/common';
import { JwtAuthGuard, ValidateHeaderGuard, ValidateHeaders, ValidateRoles, ValidateUserGuard } from './../../../auth';
import { OptionalDateRangeParamsDTO, ServiceUnitDTO, UnitFuelingDTO, ValidateByResourceDTO, ValidateByUserDTO } from './../../../dtos';
import { ServiceUnitService } from './../../../services';
import { DeleteResult } from 'typeorm';

@UseGuards(JwtAuthGuard, ValidateHeaderGuard)
@ValidateRoles(...AdminRoles, UserRolesEnum.DEBT)
@Controller('service/unit')
export class ServiceUnitController {
  constructor(private readonly unitService: ServiceUnitService) {}

  @Get()
  getServices(@Query() params: OptionalDateRangeParamsDTO): Promise<ServiceUnitInterface[]> {
    return this.unitService.findAll({ ...params });
  }

  @Get('byUser')
  @ValidateRoles(...AdminRoles, UserRolesEnum.UNIT_OPERATOR)
  @UseGuards(JwtAuthGuard, ValidateHeaderGuard, ValidateUserGuard)
  getUserServices(@Headers() headers: ValidateByUserDTO, @Query() params: OptionalDateRangeParamsDTO): Promise<ServiceUnitInterface[]> {
    return this.unitService.findAll({ ...params, operatorId: headers[HeaderEnum.USER_ID] });
  }

  @Get('id')
  @ValidateHeaders(ValidateByResourceDTO)
  getService(@Headers() headers: ValidateByResourceDTO): Promise<ServiceUnitInterface> {
    const serviceId = headers[HeaderEnum.RESOURCE_ID];
    return this.unitService.findOne(serviceId);
  }

  @Post()
  @ValidateRoles(...AdminRoles, UserRolesEnum.UNIT_OPERATOR)
  @UseGuards(JwtAuthGuard, ValidateHeaderGuard, ValidateUserGuard)
  createService(@Body() payload: ServiceUnitDTO, @Headers() headers: ValidateByUserDTO): Promise<ServiceUnitInterface> {
    if (headers[HeaderEnum.USER_ID] !== payload.user.id) throw new BadRequestException("Validated User ID doesn't corresponds with service creation User ID");
    return this.unitService.create(payload);
  }

  @Put()
  updateService(@Body() payload: ServiceUnitDTO): Promise<ServiceUnitInterface> {
    return this.unitService.update(payload);
  }

  @Delete()
  deleteFuelingService(@Headers() headers: ValidateByResourceDTO): Promise<boolean> {
    return this.unitService.remove(headers[HeaderEnum.RESOURCE_ID]);
  }
}
