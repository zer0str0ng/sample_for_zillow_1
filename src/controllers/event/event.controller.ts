import { Body, Controller, Get, Post, UseGuards, Headers, Put, Delete, Query } from '@nestjs/common';
import { ClientSearchParamsDTO, EventDTO, ValidateByResourceDTO } from '../../dtos';
import { EventService } from '../../services';
import { HeaderEnum, AdminRoles, EventInterface } from '../../shared';
import { JwtAuthGuard, ValidateHeaderGuard, ValidateHeaders, ValidateRoles } from '../../auth';

@UseGuards(JwtAuthGuard, ValidateHeaderGuard)
@ValidateRoles(...AdminRoles)
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  getEventDefinitions(@Query() params: ClientSearchParamsDTO): Promise<EventInterface[]> {
    return this.eventService.findAll(params);
  }

  @Get('id')
  @ValidateHeaders(ValidateByResourceDTO)
  getEventDefinition(@Headers() headers: ValidateByResourceDTO): Promise<EventInterface> {
    const clientId = headers[HeaderEnum.RESOURCE_ID];
    return this.eventService.findOne(clientId);
  }

  @Post()
  createEvent(@Body() payload: EventDTO): Promise<EventInterface> {
    return this.eventService.create(payload);
  }

  @Put()
  updateEvent(@Body() payload: EventDTO): Promise<EventInterface> {
    return this.eventService.update(payload);
  }

  @Delete()
  @ValidateHeaders(ValidateByResourceDTO)
  deleteEvent(@Headers() headers: ValidateByResourceDTO): Promise<boolean> {
    const clientId = headers[HeaderEnum.RESOURCE_ID];
    return this.eventService.remove(clientId);
  }
}
