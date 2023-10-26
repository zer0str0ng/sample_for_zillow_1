import { MigrationInterface, QueryRunner } from 'typeorm';

export class addingClientFields1698171661011 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE client_entity ADD COLUMN `maxNoCommDays` tinyint UNSIGNED NOT NULL default 0');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE client_entity DROP COLUMN `maxNoCommDays`;');
  }
}
