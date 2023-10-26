import { MigrationInterface, QueryRunner } from 'typeorm';

export class addingClientAccountConstraint1685741456140 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE client_entity DROP INDEX `account`;');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE client_entity ADD UNIQUE (account);');
  }
}
