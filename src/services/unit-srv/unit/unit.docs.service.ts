import { AssetEntity, UnitEntity } from './../../../entities';
import { EntityAssetInterface, UnitInterface } from './../../../shared';
import { ILogger } from './../../../logger';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UnitDocsService {
  constructor(
    @InjectRepository(UnitEntity)
    private unitRepo: Repository<UnitEntity>,
    @InjectRepository(AssetEntity)
    private assetRepo: Repository<AssetEntity>,
    private logger: ILogger
  ) {}

  async find(unitId: string): Promise<UnitInterface[]> {
    this.logger.debug('Getting unit docs...');
    return this.unitRepo.find({
      where: { id: unitId },
      relations: { assets: true },
    });
  }

  async update(unitAssets: EntityAssetInterface): Promise<UnitInterface> {
    this.logger.debug('Updating unit docs...');

    const existing = await this.unitRepo.findOne({
      where: { id: unitAssets.id },
      relations: { assets: true },
    });
    if (!existing) throw new NotFoundException('The unit was not found in the database');

    //Get the assetsIds from existing that should be cleaned after saving new ones
    const newAssetsIds = unitAssets.assets.map((asset) => asset.id).filter(Boolean) ?? [];
    const prevAssetsIds = existing.assets?.map((asset) => asset.id).filter(Boolean) ?? [];
    const assetsIdToDelete = prevAssetsIds.filter((prev) => !newAssetsIds.includes(prev));

    ///Save new assets
    const updated = await this.unitRepo.save({ ...existing, assets: unitAssets.assets });

    if (assetsIdToDelete?.length) {
      // TODO Update maybe?
      this.assetRepo.delete(assetsIdToDelete);
    }

    // TODO: Delete assets from Azure

    return updated;
  }
}
