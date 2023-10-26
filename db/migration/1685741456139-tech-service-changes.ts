import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class techServiceChanges1685741456139 implements MigrationInterface {
  /* "ALTER TABLE asset_entity MODIFY COLUMN `category` ENUM('Odometer','Other','PostService','PreService','Ticket','Tool','Unit','UnitInside','UnitOutside','Document') NOT NULL;"
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE tech_service_entity MODIFY COLUMN `status` enum ('Created', 'Cancelled', 'Pending', 'Reschedule', 'CompletedPaid', 'CompletedNonPaid', 'Reviewed', 'PaymentConfirmation', 'Finished') NOT NULL DEFAULT 'Created';"
    );
    await queryRunner.query('ALTER TABLE tech_service_entity ADD COLUMN `clientRequired` tinyint NOT NULL DEFAULT 1;');

    await queryRunner.query("ALTER TABLE tech_service_entity ADD COLUMN `serviceNumber` varchar(128) NOT NULL DEFAULT '';");

    await queryRunner.query("ALTER TABLE tech_service_entity ADD COLUMN `additionalData` varchar(1024) NOT NULL DEFAULT '';");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE client_entity MODIFY COLUMN `status` enum ('Created', 'Cancelled', 'Reschedule', 'CompletedPaid', 'CompletedNonPaid', 'Reviewed', 'PaymentConfirmation', 'Finished') NOT NULL DEFAULT 'Created';"
    );
    await queryRunner.dropColumn('tech_service_entity', 'clientRequired');

    await queryRunner.dropColumn('tech_service_entity', 'serviceNumber');

    await queryRunner.dropColumn('tech_service_entity', 'additionalData');
  }
}
