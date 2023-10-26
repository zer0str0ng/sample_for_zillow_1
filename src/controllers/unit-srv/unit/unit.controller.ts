import { AdminRoles, HeaderEnum, UnitInterface } from './../../../shared';
import { Body, Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { Headers } from '@nestjs/common';
import { JwtAuthGuard, ValidateHeaderGuard, ValidateHeaders, ValidateRoles } from './../../../auth';
import { UnitService } from './../../../services';
import { ValidateByResourceDTO, UnitDTO } from './../../../dtos';

@UseGuards(JwtAuthGuard, ValidateHeaderGuard)
@ValidateRoles(...AdminRoles)
@Controller('unit')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Get()
  getUsers(): Promise<Partial<UnitInterface>[]> {
    return this.unitService.findAll();
  }

  @Get('id')
  @ValidateHeaders(ValidateByResourceDTO)
  getUnit(@Headers() headers: ValidateByResourceDTO): Promise<Partial<UnitInterface>> {
    const unitId = headers[HeaderEnum.RESOURCE_ID];
    return this.unitService.findOne(unitId);
  }

  @Post()
  createUnit(@Body() payload: UnitDTO): Promise<Partial<UnitInterface>> {
    return this.unitService.create(payload);
  }

  @Put()
  updateUnit(@Body() payload: UnitDTO): Promise<Partial<UnitInterface>> {
    return this.unitService.update(payload);
  }

  @Delete()
  @ValidateHeaders(ValidateByResourceDTO)
  deleteService(@Headers() headers: ValidateByResourceDTO): Promise<boolean> {
    const unitId = headers[HeaderEnum.RESOURCE_ID];
    return this.unitService.remove(unitId);
  }
}
