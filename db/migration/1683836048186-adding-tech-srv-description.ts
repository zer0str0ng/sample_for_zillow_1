import { MigrationInterface, QueryRunner } from 'typeorm';

export class addingTechSrvDescription1683836048186 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE tech_service_entity ADD COLUMN `description` varchar(512) NOT NULL DEFAULT '';");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE tech_service_entity DROP COLUMN `description`;');
  }
}
