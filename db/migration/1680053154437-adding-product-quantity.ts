import { MigrationInterface, QueryRunner } from 'typeorm';

export class addingProductQuantity1680053154437 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE tech_service_product_entity ADD COLUMN `quantity` int UNSIGNED NOT NULL DEFAULT 1;');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE tech_service_product_entity DROP COLUMN `quantity`;');
  }
}
