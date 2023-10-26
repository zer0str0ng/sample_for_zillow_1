import { MigrationInterface, QueryRunner } from 'typeorm';

export class adjustingClientEntityFields1685741456141 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('START TRANSACTION;');
    await queryRunner.query("ALTER TABLE client_entity ADD COLUMN `buildingDetails` varchar(128) NOT NULL DEFAULT '';");
    await queryRunner.query("ALTER TABLE client_entity ADD COLUMN `monitoringType` ENUM('BASIC', 'PRO', 'PATROLLING', 'ELITE') NOT NULL;");
    await queryRunner.query('ALTER TABLE client_entity DROP COLUMN `telephones`;');
    await queryRunner.query("ALTER TABLE client_entity ADD COLUMN `telephones` json NOT NULL DEFAULT '[]';");
    await queryRunner.query('COMMIT;');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('START TRANSACTION;');
    await queryRunner.query('ALTER TABLE client_entity DROP COLUMN `buildingDetails`;');
    await queryRunner.query('ALTER TABLE client_entity DROP COLUMN `monitoringType`;');
    await queryRunner.query('ALTER TABLE client_entity DROP COLUMN `telephones`;');
    await queryRunner.query("ALTER TABLE client_entity ADD COLUMN `telephones` text NOT NULL DEFAULT '[]'");
    await queryRunner.query('COMMIT;');
  }
}
