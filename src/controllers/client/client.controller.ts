import { Body, Controller, Get, Post, UseGuards, Headers, Put, Delete, Query } from '@nestjs/common';
import { ClientDTO, ClientSearchParamsDTO, ValidateByResourceDTO } from './../../dtos';
import { ClientService } from './../../services';
import { HeaderEnum, ClientInterface, UserRolesEnum, AdminRoles } from './../../shared';
import { JwtAuthGuard, ValidateHeaderGuard, ValidateHeaders, ValidateRoles } from './../../auth';

@UseGuards(JwtAuthGuard, ValidateHeaderGuard)
@ValidateRoles(...AdminRoles, UserRolesEnum.DEBT, UserRolesEnum.TECHNICIAN)
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  getClients(@Query() params: ClientSearchParamsDTO): Promise<ClientInterface[]> {
    return this.clientService.findAll(params);
  }

  @Get('id')
  @ValidateHeaders(ValidateByResourceDTO)
  getClient(@Headers() headers: ValidateByResourceDTO): Promise<ClientInterface> {
    const clientId = headers[HeaderEnum.RESOURCE_ID];
    return this.clientService.findOne(clientId);
  }

  @Post()
  createClient(@Body() payload: ClientDTO): Promise<ClientInterface> {
    return this.clientService.create(payload);
  }

  @Put()
  updateClient(@Body() payload: ClientDTO): Promise<ClientInterface> {
    return this.clientService.update(payload);
  }

  @Delete()
  @ValidateHeaders(ValidateByResourceDTO)
  deleteService(@Headers() headers: ValidateByResourceDTO): Promise<boolean> {
    const clientId = headers[HeaderEnum.RESOURCE_ID];
    return this.clientService.remove(clientId);
  }
}
