import { MigrationInterface, QueryRunner } from 'typeorm';

export class addingClientAccountConstraint1683777795495 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE client_entity ADD UNIQUE (account);');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE client_entity DROP INDEX `account`;');
  }
}
