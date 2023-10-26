import { MigrationInterface, QueryRunner } from 'typeorm';

export class addingClientLocation1679452006038 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE client_entity ADD COLUMN `location` varchar(32) NOT NULL;');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE client_entity DROP COLUMN `location`;');
  }
}
