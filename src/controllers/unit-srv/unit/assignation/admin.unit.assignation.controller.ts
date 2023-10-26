import { AdminRoles, HeaderEnum, UnitUserInterface } from './../../../../shared';
import { Body, Controller, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { GetAllDTO, ValidateByUserDTO, UnitDTO, UnitUserDTO, AdminUnitAssignationUpdateDTO, ValidateByResourceDTO } from './../../../../dtos';
import { Headers } from '@nestjs/common';
import { JwtAuthGuard, ValidateHeaderGuard, ValidateHeaders, ValidateRoles } from '../../../../auth';
import { UnitAssignationService } from '../../../../services';

@UseGuards(JwtAuthGuard, ValidateHeaderGuard)
@ValidateRoles(...AdminRoles)
@Controller('admin/unit/assignation')
export class AdminUnitAssignationController {
  constructor(private readonly assignationService: UnitAssignationService) {}

  @Get()
  getUsers(): Promise<Partial<UnitDTO>[]> {
    return this.assignationService.findAll();
  }

  @Get('by-user')
  @ValidateHeaders(ValidateByUserDTO)
  getByUser(@Headers() headers: ValidateByUserDTO, @Query() query: GetAllDTO): Promise<UnitUserInterface[]> {
    const userId = headers[HeaderEnum.USER_ID];
    return this.assignationService.findAssignation({ userId, all: query.all ?? false });
  }

  @Get('by-unit')
  @ValidateHeaders(ValidateByResourceDTO)
  getByUnit(@Headers() headers: ValidateByResourceDTO, @Query() query: GetAllDTO): Promise<UnitUserInterface[]> {
    const unitId = headers[HeaderEnum.RESOURCE_ID];
    return this.assignationService.findAssignation({ unitId, all: query.all ?? false });
  }

  @Post()
  createAssgination(@Body() payload: UnitUserDTO): Promise<UnitUserInterface> {
    return this.assignationService.create(payload);
  }

  @Put()
  @ValidateHeaders(ValidateByUserDTO)
  updateAssignation(@Headers() headers: ValidateByUserDTO, @Body() payload: AdminUnitAssignationUpdateDTO): Promise<any> {
    const userId = headers[HeaderEnum.USER_ID];
    return this.assignationService.update({ assignation: payload as UnitUserInterface, userId, onlyPending: false });
  }
}
