import { MigrationInterface, QueryRunner } from 'typeorm';

export class addingAssetCategories1676768142780 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE asset_entity MODIFY COLUMN `category` ENUM('Odometer','Other','PostService','PreService','Ticket','Tool','Unit','UnitInside','UnitOutside','Document') NOT NULL;"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE asset_entity MODIFY COLUMN `category` ENUM('Odometer','Other','PostService','PreService','Ticket','Tool','Unit') NOT NULL;");
  }
}
