import { Body, Controller, Get, Post, UseGuards, Headers, Put, Query, UseInterceptors, BadRequestException, Delete } from '@nestjs/common';
import { TechServiceDTO, TechServiceSearchParamsDTO, ValidateByResourceDTO, ValidateByRolesDTO } from './../../dtos';
import { TechSrvService } from './../../services';
import { HeaderEnum, UserRolesEnum, TechServiceInterface, TechServiceStatusEnum, AdminRoles } from './../../shared';
import { JwtAuthGuard, UserRolesInterceptor, ValidateHeaderGuard, ValidateHeaders, ValidateRoles, ValidateUserGuard } from './../../auth';

@UseGuards(JwtAuthGuard, ValidateHeaderGuard)
@ValidateRoles(...AdminRoles, UserRolesEnum.DEBT, UserRolesEnum.TECHNICIAN)
@Controller('tech-srv')
export class TechSrvController {
  constructor(private readonly techSrvService: TechSrvService) {}

  @Get()
  getTechServices(@Query() params: TechServiceSearchParamsDTO): Promise<TechServiceInterface[]> {
    return this.techSrvService.findAll({ ...params });
  }

  @Get('by-technician')
  @UseGuards(JwtAuthGuard, ValidateHeaderGuard, ValidateUserGuard)
  getTechnicianTechServices(@Headers() headers: ValidateByResourceDTO, @Query() params: TechServiceSearchParamsDTO): Promise<TechServiceInterface[]> {
    const technicianId: string = headers[HeaderEnum.USER_ID];
    return this.techSrvService.findAll({ ...params, technicianId });
  }

  @Get('id')
  @ValidateHeaders(ValidateByResourceDTO)
  getTechSrv(@Headers() headers: ValidateByResourceDTO): Promise<TechServiceInterface> {
    const priceListId = headers[HeaderEnum.RESOURCE_ID];
    return this.techSrvService.findOne(priceListId);
  }

  @Post()
  @UseInterceptors(UserRolesInterceptor)
  createTechSrv(@Body() payload: TechServiceDTO, @Headers() headers: ValidateByRolesDTO): Promise<TechServiceInterface> {
    if (payload.status !== TechServiceStatusEnum.CREATED) throw new BadRequestException('Invalid status for creation of tech service');
    return this.techSrvService.create(payload, headers[HeaderEnum.USER_ROLES]);
  }

  @Put()
  @UseInterceptors(UserRolesInterceptor)
  updateTechSrv(@Body() payload: TechServiceDTO, @Headers() headers: ValidateByRolesDTO): Promise<TechServiceInterface> {
    return this.techSrvService.update(payload, headers[HeaderEnum.USER_ROLES]);
  }

  @Delete()
  @ValidateHeaders(ValidateByResourceDTO)
  deleteService(@Headers() headers: ValidateByResourceDTO): Promise<boolean> {
    const techSrvId = headers[HeaderEnum.RESOURCE_ID];
    return this.techSrvService.remove(techSrvId);
  }
}
