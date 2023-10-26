import { AdminRoles, HeaderEnum, ServiceInterface, UserRolesEnum } from './../../../shared';
import { Body, Controller, Get, Post, UseGuards, Headers, Put, Delete } from '@nestjs/common';
import { JwtAuthGuard, ValidateHeaderGuard, ValidateHeaders, ValidateRoles } from './../../../auth';
import { ServiceDTO, ValidateByResourceDTO } from './../../../dtos';
import { ServiceService } from './../../../services';

@UseGuards(JwtAuthGuard, ValidateHeaderGuard)
@ValidateRoles(...AdminRoles)
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get()
  @ValidateRoles(...AdminRoles, UserRolesEnum.UNIT_OPERATOR)
  getServices(): Promise<ServiceInterface[]> {
    return this.serviceService.findAll();
  }

  @Get('id')
  @ValidateHeaders(ValidateByResourceDTO)
  getService(@Headers() headers: ValidateByResourceDTO): Promise<ServiceInterface> {
    const serviceId = headers[HeaderEnum.RESOURCE_ID];
    return this.serviceService.findOne(serviceId);
  }

  @Post()
  createService(@Body() payload: ServiceDTO): Promise<ServiceInterface> {
    return this.serviceService.create(payload);
  }

  @Put()
  updateService(@Body() payload: ServiceDTO): Promise<ServiceInterface> {
    return this.serviceService.update(payload);
  }

  @Delete()
  @ValidateHeaders(ValidateByResourceDTO)
  deleteService(@Headers() headers: ValidateByResourceDTO): Promise<boolean> {
    const serviceId = headers[HeaderEnum.RESOURCE_ID];
    return this.serviceService.remove(serviceId);
  }
}
