import { MigrationInterface, QueryRunner } from 'typeorm';

export class clientChanges1685659533674 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE client_entity ADD COLUMN `users` json NOT NULL DEFAULT '[]';");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE client_entity DROP COLUMN `users`;');
  }
}
