import { AssetEntity } from './../../entities';
import { AssetInterface, Base64FileInterface, MediaCategoryEnum, MediaMimeTypesEnum, MediaSourceEnum, MediaStatusEnum } from './../../shared';
import { AzureStorageService, UploadedFileMetadata } from '@nestjs/azure-storage';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ILogger } from './../../logger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AssetService {
  constructor(
    private readonly azureStorage: AzureStorageService,
    private logger: ILogger,
    @InjectRepository(AssetEntity)
    private assetRepo: Repository<AssetEntity>
  ) {}

  async getAssetList(params: { source?: MediaSourceEnum; category?: MediaCategoryEnum; status?: MediaStatusEnum }): Promise<AssetInterface[]> {
    return this.assetRepo.find({ where: { ...params } });
  }

  async upload(file: UploadedFileMetadata, assetId: string): Promise<AssetInterface> {
    const asset = await this.getAsset(assetId, file.originalname);

    file = {
      ...file,
      originalname: assetId,
    };

    return this.uploadAssetToAzure(asset, file);
  }

  async uploadBase64(base64File: Base64FileInterface, assetId: string): Promise<AssetInterface> {
    const asset = await this.getAsset(assetId, base64File.originalname);

    const buffer = Buffer.from(base64File.base64, 'base64');

    const fileToUpload: UploadedFileMetadata = {
      fieldname: 'file',
      originalname: assetId,
      encoding: '?',
      mimetype: base64File.mimetype,
      buffer: buffer,
      size: `${buffer.length}`,
    };

    this.logger.debug(`Uploading asset to Azure... [${asset.id}]`);
    return this.uploadAssetToAzure(asset, fileToUpload);
  }

  async uploadAssetToAzure(asset: AssetEntity, fileToUpload: UploadedFileMetadata) {
    const storageUrl = await this.azureStorage.upload(fileToUpload);
    this.logger.debug(`Uploaded file ${storageUrl} to Azure Blob, id=${asset.id}...`);

    const uploadedUrl = storageUrl.split('?')[0];

    const updatedAsset: AssetInterface = { ...asset, url: uploadedUrl, status: MediaStatusEnum.UPLOADED, mimetype: fileToUpload.mimetype as MediaMimeTypesEnum };

    await this.assetRepo.update(asset.id, updatedAsset);

    return updatedAsset;
  }

  async getAsset(assetId: string, originalName: string) {
    this.logger.debug(`Getting asset from DB... [${assetId}, ${originalName}]`);

    const asset = await this.assetRepo.findOne({ where: { id: assetId, orgName: originalName, isActive: true } });

    if (!asset) {
      const errorStr = 'There is no matching asset in the database...';
      this.logger.error(`${errorStr} [${assetId}, ${originalName}]`);
      throw new BadRequestException(errorStr);
    }

    return asset;
  }
}
