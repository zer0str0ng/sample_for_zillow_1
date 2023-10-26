import { AdminRoles, HeaderEnum, UserInterface, UserRolesEnum } from './../../shared';
import { Body, Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { Headers } from '@nestjs/common';
import { JwtAuthGuard, ValidateHeaderGuard, ValidateHeaders, ValidateRoles, ValidateUserGuard } from './../../auth';
import { UserService } from './../../services';
import { ValidateByUserDTO, UserDTO, UserPasswordUpdateDTO } from './../../dtos';

@UseGuards(JwtAuthGuard, ValidateHeaderGuard)
@ValidateRoles(...AdminRoles)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ValidateRoles(...AdminRoles, UserRolesEnum.DEBT)
  getUsers(): Promise<Partial<UserDTO>[]> {
    return this.userService.findAll();
  }

  @Get('id')
  @ValidateHeaders(ValidateByUserDTO)
  getUser(@Headers() headers: ValidateByUserDTO): Promise<Partial<UserDTO>> {
    const userId = headers[HeaderEnum.USER_ID];
    return this.userService.findOne(userId);
  }

  @Post()
  @ValidateRoles(UserRolesEnum.ROOT, UserRolesEnum.ADMIN)
  createUser(@Body() payload: UserDTO): Promise<any> {
    return this.userService.create(payload);
  }

  @Put()
  @ValidateRoles(...AdminRoles, UserRolesEnum.UNIT_OPERATOR, UserRolesEnum.TECHNICIAN, UserRolesEnum.DEBT)
  updateUser(@Body() payload: UserDTO): Promise<Partial<UserDTO>> {
    return this.userService.update(payload as UserInterface);
  }

  @Put('password')
  @UseGuards(JwtAuthGuard, ValidateHeaderGuard, ValidateUserGuard)
  @ValidateRoles(...AdminRoles, UserRolesEnum.UNIT_OPERATOR, UserRolesEnum.TECHNICIAN, UserRolesEnum.DEBT)
  updatePassword(@Headers() headers: ValidateByUserDTO, @Body() payload: UserPasswordUpdateDTO): Promise<Partial<UserDTO>> {
    const userId = headers[HeaderEnum.USER_ID];
    return this.userService.update({ id: userId, auth: { password: payload.auth.password } } as UserInterface);
  }

  @Delete()
  @ValidateHeaders(ValidateByUserDTO)
  deleteUser(@Headers() headers: ValidateByUserDTO): Promise<boolean> {
    const userId = headers[HeaderEnum.USER_ID];
    return this.userService.remove(userId);
  }
}
