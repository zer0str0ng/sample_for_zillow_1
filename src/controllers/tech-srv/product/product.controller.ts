import { Body, Controller, Get, Post, UseGuards, Headers, Put, Delete, Query } from '@nestjs/common';
import { HeaderEnum, UserRolesEnum, ProductInterface, AdminRoles } from './../../../shared';
import { JwtAuthGuard, ValidateHeaderGuard, ValidateHeaders, ValidateRoles } from './../../../auth';
import { ProductDTO, ProductSearchParamsDTO, ValidateByResourceDTO } from './../../../dtos';
import { ProductService } from './../../../services';

@UseGuards(JwtAuthGuard, ValidateHeaderGuard)
@ValidateRoles(...AdminRoles, UserRolesEnum.DEBT)
@Controller('tech-srv/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ValidateRoles(...AdminRoles, UserRolesEnum.DEBT, UserRolesEnum.TECHNICIAN)
  getProductList(@Query() params: ProductSearchParamsDTO): Promise<ProductInterface[]> {
    return this.productService.findAll(params);
  }

  @Get('id')
  @ValidateHeaders(ValidateByResourceDTO)
  getProduct(@Headers() headers: ValidateByResourceDTO): Promise<ProductInterface> {
    const productId = headers[HeaderEnum.RESOURCE_ID];
    return this.productService.findOne(productId);
  }

  @Post()
  createProduct(@Body() payload: ProductDTO): Promise<ProductInterface> {
    return this.productService.create(payload);
  }

  @Put()
  updateProduct(@Body() payload: ProductDTO): Promise<ProductInterface> {
    return this.productService.update(payload);
  }

  @Delete()
  @ValidateHeaders(ValidateByResourceDTO)
  deleteProduct(@Headers() headers: ValidateByResourceDTO): Promise<boolean> {
    const productId = headers[HeaderEnum.RESOURCE_ID];
    return this.productService.remove(productId);
  }
}
