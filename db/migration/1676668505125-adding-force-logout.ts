import { MigrationInterface, QueryRunner } from 'typeorm';

export class addingForceLogout1676668505125 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE user_auth_entity ADD COLUMN `forceLogout` tinyint NULL DEFAULT 0;');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE user_auth_entity DROP COLUMN `forceLogout`;');
  }
}
