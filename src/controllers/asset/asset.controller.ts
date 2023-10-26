import { AdminRoles, AssetInterface, HeaderEnum, UserRolesEnum } from './../../shared';
import { AssetParamsDTO, Base64FileDTO, ValidateByResourceDTO } from './../../dtos';
import { AssetService } from './../../services';
import { Body, Controller, Get, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Headers } from '@nestjs/common';
import { ILogger } from './../../logger';
import { JwtAuthGuard, ValidateHeaderGuard, ValidateHeaders, ValidateRoles } from './../../auth';
import { UploadedFileMetadata } from '@nestjs/azure-storage';
import { UploadFileValidatorPipe } from './../../utils';

@UseGuards(JwtAuthGuard, ValidateHeaderGuard)
@ValidateRoles(...AdminRoles, UserRolesEnum.UNIT_OPERATOR, UserRolesEnum.TECHNICIAN, UserRolesEnum.DEBT)
@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService, private logger: ILogger) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ValidateHeaders(ValidateByResourceDTO)
  async uploadFiles(
    @Headers() headers: ValidateByResourceDTO,
    @UploadedFile(new UploadFileValidatorPipe())
    file: UploadedFileMetadata
  ): Promise<AssetInterface> {
    const assetId = headers[HeaderEnum.RESOURCE_ID];
    return this.assetService.upload(file, assetId);
  }

  @Post('uploadBase64')
  @ValidateHeaders(ValidateByResourceDTO)
  async uploadFilesBase64(@Headers() headers: ValidateByResourceDTO, @Body() base64File: Base64FileDTO): Promise<AssetInterface> {
    const assetId = headers[HeaderEnum.RESOURCE_ID];
    this.logger.debug(`AssetUpload Controller processing: ${JSON.stringify({ assetId, orgFileName: base64File.originalname })}...`);
    return this.assetService.uploadBase64(base64File, assetId);
  }

  @Get()
  async findAssets(@Query() params: AssetParamsDTO): Promise<AssetInterface[]> {
    return this.assetService.getAssetList(params);
  }
}
