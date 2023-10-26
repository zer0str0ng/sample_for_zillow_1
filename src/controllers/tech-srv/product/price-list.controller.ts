import { Body, Controller, Get, Post, UseGuards, Headers, Put, Delete } from '@nestjs/common';
import { PriceListDTO, ValidateByResourceDTO } from './../../../dtos';
import { PriceListService } from './../../../services';
import { HeaderEnum, UserRolesEnum, PriceListInterface, AdminRoles } from './../../../shared';
import { JwtAuthGuard, ValidateHeaderGuard, ValidateHeaders, ValidateRoles } from './../../../auth';

@UseGuards(JwtAuthGuard, ValidateHeaderGuard)
@ValidateRoles(...AdminRoles, UserRolesEnum.DEBT)
@Controller('tech-srv/price-list')
export class PriceListController {
  constructor(private readonly priceListService: PriceListService) {}

  @Get()
  @ValidateRoles(...AdminRoles, UserRolesEnum.DEBT, UserRolesEnum.TECHNICIAN)
  getPriceLists(): Promise<PriceListInterface[]> {
    return this.priceListService.findAll();
  }

  @Get('id')
  @ValidateHeaders(ValidateByResourceDTO)
  getPriceList(@Headers() headers: ValidateByResourceDTO): Promise<PriceListInterface> {
    const priceListId = headers[HeaderEnum.RESOURCE_ID];
    return this.priceListService.findOne(priceListId);
  }

  @Post()
  createPriceList(@Body() payload: PriceListDTO): Promise<PriceListInterface> {
    return this.priceListService.create(payload);
  }

  @Put()
  updatePriceList(@Body() payload: PriceListDTO): Promise<PriceListInterface> {
    return this.priceListService.update(payload);
  }

  @Delete()
  @ValidateHeaders(ValidateByResourceDTO)
  deleteService(@Headers() headers: ValidateByResourceDTO): Promise<boolean> {
    const priceListId = headers[HeaderEnum.RESOURCE_ID];
    return this.priceListService.remove(priceListId);
  }
}
