import { MigrationInterface, QueryRunner } from 'typeorm';

export class techSrvOptionalTechdate1684633947517 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE tech_service_entity MODIFY COLUMN `serviceDate` datetime NULL;');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE tech_service_entity MODIFY COLUMN `serviceDate` datetime NOT NULL;');
  }
}
