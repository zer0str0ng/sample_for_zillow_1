import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { HeaderEnum, UnitUserInterface, UserRolesEnum } from './../../../../shared';
import { Headers } from '@nestjs/common';
import { JwtAuthGuard, ValidateHeaderGuard, ValidateHeaders, ValidateRoles, ValidateUserGuard } from './../../../../auth';
import { UnitAssignationService } from './../../../../services';
import { UserUnitAssignationUpdateDTO, ValidateByUserDTO } from './../../../../dtos';

@UseGuards(JwtAuthGuard, ValidateHeaderGuard, ValidateUserGuard)
@ValidateRoles(UserRolesEnum.UNIT_OPERATOR)
@Controller('user/unit/assignation')
export class UserUnitAssignationController {
  constructor(private readonly assignationService: UnitAssignationService) {}

  @Get()
  @ValidateHeaders(ValidateByUserDTO)
  getByUser(@Headers() headers: ValidateByUserDTO): Promise<UnitUserInterface[]> {
    const userId = headers[HeaderEnum.USER_ID];
    return this.assignationService.findAssignation({ userId, all: false });
  }

  @Put()
  @ValidateHeaders(ValidateByUserDTO)
  updateAssignation(@Headers() headers: ValidateByUserDTO, @Body() payload: UserUnitAssignationUpdateDTO): Promise<any> {
    const userId = headers[HeaderEnum.USER_ID];
    return this.assignationService.update({ assignation: payload as UnitUserInterface, userId, onlyPending: true });
  }
}
