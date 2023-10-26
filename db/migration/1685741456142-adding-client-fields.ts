import { MigrationInterface, QueryRunner } from 'typeorm';

export class addingClientFields1685741456142 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE client_entity ADD COLUMN `deactivationDate` datetime(6) NULL;');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE client_entity DROP COLUMN `deactivationDate`;');
  }
}
