import { MigrationInterface, QueryRunner } from 'typeorm';

export class addingClientFields1698099645113 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE client_entity ADD COLUMN `patrolOrder` int NULL');
    await queryRunner.query('ALTER TABLE client_entity ADD COLUMN `latestMonitorSignal` datetime(6) NULL;');
    await queryRunner.query("ALTER TABLE client_entity ADD COLUMN `cameras` json NOT NULL DEFAULT '[]'");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE client_entity DROP COLUMN `patrolOrder`;');
    await queryRunner.query('ALTER TABLE client_entity DROP COLUMN `latestMonitorSignal`;');
    await queryRunner.query('ALTER TABLE client_entity DROP COLUMN `cameras`;');
  }
}
