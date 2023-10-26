import { Body, Controller, Get, Post, UseGuards, Headers, Put, Delete, Query } from '@nestjs/common';
import { ClientSearchParamsDTO, EventDefinitionDTO, ValidateByResourceDTO } from './../../dtos';
import { EventDefinitionService } from './../../services';
import { HeaderEnum, AdminRoles, EventDefinitionInterface } from './../../shared';
import { JwtAuthGuard, ValidateHeaderGuard, ValidateHeaders, ValidateRoles } from './../../auth';

@UseGuards(JwtAuthGuard, ValidateHeaderGuard)
@ValidateRoles(...AdminRoles)
@Controller('event/definition')
export class EventDefinitionController {
  constructor(private readonly eventDefService: EventDefinitionService) {}

  @Get()
  getEventDefinitions(@Query() params: ClientSearchParamsDTO): Promise<EventDefinitionInterface[]> {
    return this.eventDefService.findAll(params);
  }

  @Get('id')
  @ValidateHeaders(ValidateByResourceDTO)
  getEventDefinition(@Headers() headers: ValidateByResourceDTO): Promise<EventDefinitionInterface> {
    const clientId = headers[HeaderEnum.RESOURCE_ID];
    return this.eventDefService.findOne(clientId);
  }

  @Post()
  createEventDefinition(@Body() payload: EventDefinitionDTO): Promise<EventDefinitionInterface> {
    return this.eventDefService.create(payload);
  }

  @Put()
  updateEventDefinition(@Body() payload: EventDefinitionDTO): Promise<EventDefinitionInterface> {
    return this.eventDefService.update(payload);
  }

  @Delete()
  @ValidateHeaders(ValidateByResourceDTO)
  deleteEventDefinition(@Headers() headers: ValidateByResourceDTO): Promise<boolean> {
    const clientId = headers[HeaderEnum.RESOURCE_ID];
    return this.eventDefService.remove(clientId);
  }
}
