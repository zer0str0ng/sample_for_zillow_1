import { AdminRoles, HeaderEnum, UnitInterface, UserRolesEnum } from './../../../shared';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Headers } from '@nestjs/common';
import { JwtAuthGuard, ValidateHeaderGuard, ValidateRoles } from './../../../auth';
import { UnitDocsService } from './../../../services';
import { ValidateByResourceDTO, UnitAssetsDTO } from './../../../dtos';

@UseGuards(JwtAuthGuard, ValidateHeaderGuard)
@Controller('unit/docs')
export class UnitDocsController {
  constructor(private readonly unitDocsService: UnitDocsService) {}

  @Get('id')
  @ValidateRoles(...AdminRoles, UserRolesEnum.UNIT_OPERATOR)
  getUnitDocs(@Headers() headers: ValidateByResourceDTO): Promise<UnitInterface[]> {
    const unitId = headers[HeaderEnum.RESOURCE_ID];
    return this.unitDocsService.find(unitId);
  }

  @Post()
  @ValidateRoles(...AdminRoles)
  updateUnitDocs(@Body() payload: UnitAssetsDTO): Promise<UnitInterface> {
    return this.unitDocsService.update(payload);
  }
}
