import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDb1664573638804 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('SELECT VERSION() AS `version`;');

    await queryRunner.query('START TRANSACTION;');

    await queryRunner.query('SELECT DATABASE() AS `db_name`;');

    await queryRunner.query(
      "SELECT `TABLE_SCHEMA`, `TABLE_NAME` FROM `INFORMATION_SCHEMA`.`TABLES` WHERE `TABLE_SCHEMA` = 'gigabyte' AND `TABLE_NAME` = 'price_list_entity' UNION SELECT `TABLE_SCHEMA`, `TABLE_NAME` FROM `INFORMATION_SCHEMA`.`TABLES` WHERE `TABLE_SCHEMA` = 'gigabyte' AND `TABLE_NAME` = 'product_price_entity' UNION SELECT `TABLE_SCHEMA`, `TABLE_NAME` FROM `INFORMATION_SCHEMA`.`TABLES` WHERE `TABLE_SCHEMA` = 'gigabyte' AND `TABLE_NAME` = 'product_entity' UNION SELECT `TABLE_SCHEMA`, `TABLE_NAME` FROM `INFORMATION_SCHEMA`.`TABLES` WHERE `TABLE_SCHEMA` = 'gigabyte' AND `TABLE_NAME` = 'tech_service_product_entity' UNION SELECT `TABLE_SCHEMA`, `TABLE_NAME` FROM `INFORMATION_SCHEMA`.`TABLES` WHERE `TABLE_SCHEMA` = 'gigabyte' AND `TABLE_NAME` = 'tech_service_entity' UNION SELECT `TABLE_SCHEMA`, `TABLE_NAME` FROM `INFORMATION_SCHEMA`.`TABLES` WHERE `TABLE_SCHEMA` = 'gigabyte' AND `TABLE_NAME` = 'asset_entity' UNION SELECT `TABLE_SCHEMA`, `TABLE_NAME` FROM `INFORMATION_SCHEMA`.`TABLES` WHERE `TABLE_SCHEMA` = 'gigabyte' AND `TABLE_NAME` = 'user_entity' UNION SELECT `TABLE_SCHEMA`, `TABLE_NAME` FROM `INFORMATION_SCHEMA`.`TABLES` WHERE `TABLE_SCHEMA` = 'gigabyte' AND `TABLE_NAME` = 'user_auth_entity' UNION SELECT `TABLE_SCHEMA`, `TABLE_NAME` FROM `INFORMATION_SCHEMA`.`TABLES` WHERE `TABLE_SCHEMA` = 'gigabyte' AND `TABLE_NAME` = 'unit_entity' UNION SELECT `TABLE_SCHEMA`, `TABLE_NAME` FROM `INFORMATION_SCHEMA`.`TABLES` WHERE `TABLE_SCHEMA` = 'gigabyte' AND `TABLE_NAME` = 'unit_user_entity' UNION SELECT `TABLE_SCHEMA`, `TABLE_NAME` FROM `INFORMATION_SCHEMA`.`TABLES` WHERE `TABLE_SCHEMA` = 'gigabyte' AND `TABLE_NAME` = 'unit_fueling_entity' UNION SELECT `TABLE_SCHEMA`, `TABLE_NAME` FROM `INFORMATION_SCHEMA`.`TABLES` WHERE `TABLE_SCHEMA` = 'gigabyte' AND `TABLE_NAME` = 'service_entity' UNION SELECT `TABLE_SCHEMA`, `TABLE_NAME` FROM `INFORMATION_SCHEMA`.`TABLES` WHERE `TABLE_SCHEMA` = 'gigabyte' AND `TABLE_NAME` = 'service_alert_entity' UNION SELECT `TABLE_SCHEMA`, `TABLE_NAME` FROM `INFORMATION_SCHEMA`.`TABLES` WHERE `TABLE_SCHEMA` = 'gigabyte' AND `TABLE_NAME` = 'service_unit_entity' UNION SELECT `TABLE_SCHEMA`, `TABLE_NAME` FROM `INFORMATION_SCHEMA`.`TABLES` WHERE `TABLE_SCHEMA` = 'gigabyte' AND `TABLE_NAME` = 'client_entity' UNION SELECT `TABLE_SCHEMA`, `TABLE_NAME` FROM `INFORMATION_SCHEMA`.`TABLES` WHERE `TABLE_SCHEMA` = 'gigabyte' AND `TABLE_NAME` = 'product_entity_prices_product_price_entity' UNION SELECT `TABLE_SCHEMA`, `TABLE_NAME` FROM `INFORMATION_SCHEMA`.`TABLES` WHERE `TABLE_SCHEMA` = 'gigabyte' AND `TABLE_NAME` = 'tech_service_entity_products_tech_service_product_entity' UNION SELECT `TABLE_SCHEMA`, `TABLE_NAME` FROM `INFORMATION_SCHEMA`.`TABLES` WHERE `TABLE_SCHEMA` = 'gigabyte' AND `TABLE_NAME` = 'tech_service_entity_assets_asset_entity' UNION SELECT `TABLE_SCHEMA`, `TABLE_NAME` FROM `INFORMATION_SCHEMA`.`TABLES` WHERE `TABLE_SCHEMA` = 'gigabyte' AND `TABLE_NAME` = 'unit_entity_assets_asset_entity' UNION SELECT `TABLE_SCHEMA`, `TABLE_NAME` FROM `INFORMATION_SCHEMA`.`TABLES` WHERE `TABLE_SCHEMA` = 'gigabyte' AND `TABLE_NAME` = 'unit_user_entity_assets_asset_entity' UNION SELECT `TABLE_SCHEMA`, `TABLE_NAME` FROM `INFORMATION_SCHEMA`.`TABLES` WHERE `TABLE_SCHEMA` = 'gigabyte' AND `TABLE_NAME` = 'unit_fueling_entity_assets_asset_entity' UNION SELECT `TABLE_SCHEMA`, `TABLE_NAME` FROM `INFORMATION_SCHEMA`.`TABLES` WHERE `TABLE_SCHEMA` = 'gigabyte' AND `TABLE_NAME` = 'service_unit_entity_assets_asset_entity';"
    );
    await queryRunner.query("SELECT * FROM `INFORMATION_SCHEMA`.`COLUMNS` WHERE `TABLE_SCHEMA` = 'gigabyte' AND `TABLE_NAME` = 'typeorm_metadata';");
    await queryRunner.query(
      'CREATE TABLE `price_list_entity` (`id` varchar(36) NOT NULL, `isActive` tinyint NOT NULL DEFAULT 1, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(128) NOT NULL, `priority` int UNSIGNED NOT NULL, `comments` varchar(512) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;'
    );
    await queryRunner.query(
      'CREATE TABLE `product_price_entity` (`id` varchar(36) NOT NULL, `isActive` tinyint NOT NULL DEFAULT 1, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `default` tinyint NOT NULL, `price` float UNSIGNED NOT NULL, `priceListId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;'
    );
    await queryRunner.query(
      "CREATE TABLE `product_entity` (`id` varchar(36) NOT NULL, `isActive` tinyint NOT NULL DEFAULT 1, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(128) NOT NULL, `type` enum ('Service', 'Material') NOT NULL, `comments` varchar(512) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;"
    );
    await queryRunner.query(
      'CREATE TABLE `tech_service_product_entity` (`id` varchar(36) NOT NULL, `isActive` tinyint NOT NULL DEFAULT 1, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `price` float UNSIGNED NOT NULL, `productId` varchar(36) NULL, `priceListId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;'
    );
    await queryRunner.query(
      "CREATE TABLE `tech_service_entity` (`id` varchar(36) NOT NULL, `isActive` tinyint NOT NULL DEFAULT 1, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `serviceDate` datetime NOT NULL, `estimatedMinutes` int UNSIGNED NOT NULL DEFAULT '60', `serviceDateEnd` datetime NULL, `status` enum ('Created', 'Cancelled', 'Reschedule', 'CompletedPaid', 'CompletedNonPaid', 'Reviewed', 'PaymentConfirmation', 'Finished') NOT NULL DEFAULT 'Created', `priority` enum ('Critical', 'High', 'Normal', 'Low') NOT NULL DEFAULT 'Normal', `quiz` json NOT NULL DEFAULT '[]', `overallRate` int UNSIGNED NOT NULL, `extraCharge` float UNSIGNED NOT NULL, `extraChargeComment` varchar(512) NOT NULL DEFAULT '', `totalAmount` float UNSIGNED NOT NULL, `comments` varchar(512) NOT NULL DEFAULT '', `location` varchar(32) NOT NULL, `technicianUserId` varchar(36) NULL, `clientId` varchar(36) NULL, `coordinatorUserId` varchar(36) NULL, `financialUserId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;"
    );
    await queryRunner.query(
      "CREATE TABLE `asset_entity` (`id` varchar(36) NOT NULL, `isActive` tinyint NOT NULL DEFAULT 1, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `source` enum ('Other', 'UnitDocuments', 'TechService', 'UnitAssignation', 'UnitFueling', 'UnitService') NOT NULL, `category` enum ('Odometer', 'Other', 'PostService', 'PreService', 'Ticket', 'Tool', 'Unit') NOT NULL, `status` enum ('Delete', 'Error', 'Pending', 'Uploaded') NOT NULL, `orgName` varchar(128) NOT NULL, `mimetype` enum ('image/bmp', 'image/jpeg', 'image/jpg', 'application/pdf', 'image/pjpeg', 'image/png', 'image/tiff', 'image/x-png') NULL, `url` varchar(512) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;"
    );
    await queryRunner.query(
      "CREATE TABLE `user_entity` (`id` varchar(36) NOT NULL, `isActive` tinyint NOT NULL DEFAULT 1, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `username` varchar(32) NOT NULL, `name` varchar(255) NOT NULL, `cellphone` varchar(64) NULL, `email` varchar(128) NULL, `roles` json NOT NULL DEFAULT '[]', `profile` json NOT NULL DEFAULT '{}', `authId` varchar(36) NULL, UNIQUE INDEX `IDX_9b998bada7cff93fcb953b0c37` (`username`), UNIQUE INDEX `REL_ebf336fa7dbea8da350abd3463` (`authId`), PRIMARY KEY (`id`)) ENGINE=InnoDB;"
    );
    await queryRunner.query(
      'CREATE TABLE `user_auth_entity` (`id` varchar(36) NOT NULL, `isActive` tinyint NOT NULL DEFAULT 1, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `password` varchar(255) NOT NULL, `lastLogin` datetime NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;'
    );
    await queryRunner.query(
      "CREATE TABLE `unit_entity` (`id` varchar(36) NOT NULL, `isActive` tinyint NOT NULL DEFAULT 1, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `description` varchar(255) NOT NULL, `plate` varchar(16) NOT NULL, `odometer` int NOT NULL DEFAULT '0', `type` enum ('DEFAULT') NOT NULL DEFAULT 'DEFAULT', PRIMARY KEY (`id`)) ENGINE=InnoDB;"
    );
    await queryRunner.query(
      "CREATE TABLE `unit_user_entity` (`id` varchar(36) NOT NULL, `isActive` tinyint NOT NULL DEFAULT 1, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `initOdometer` int NOT NULL DEFAULT '0', `status` enum ('ASSIGNED', 'CANCELLED', 'FINISHED', 'PENDING') NOT NULL DEFAULT 'PENDING', `userId` varchar(36) NULL, `unitId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;"
    );
    await queryRunner.query(
      "CREATE TABLE `unit_fueling_entity` (`id` varchar(36) NOT NULL, `isActive` tinyint NOT NULL DEFAULT 1, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `date` datetime NOT NULL, `odometer` int UNSIGNED NOT NULL, `liters` int UNSIGNED NOT NULL, `performance` float UNSIGNED NULL, `totalAmount` float UNSIGNED NOT NULL, `comments` varchar(1024) NOT NULL DEFAULT '', `location` varchar(32) NOT NULL, `userId` varchar(36) NULL, `unitId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;"
    );
    await queryRunner.query(
      "CREATE TABLE `service_entity` (`id` varchar(36) NOT NULL, `isActive` tinyint NOT NULL DEFAULT 1, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `freqType` enum ('TIME', 'ODOMETER') NOT NULL, `params` json NOT NULL, `priority` enum ('1', '2', '3', '4', '5') NOT NULL DEFAULT '3', `alertActive` tinyint NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;"
    );
    await queryRunner.query(
      "CREATE TABLE `service_alert_entity` (`id` varchar(36) NOT NULL, `isActive` tinyint NOT NULL DEFAULT 1, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `status` enum ('OPEN', 'FINISHED', 'DISMISSED') NOT NULL DEFAULT 'OPEN', `expectedBeforeDate` datetime NULL, `expectedOffsetDays` int NULL, `expectedBeforeOdometer` int NULL, `expectedOffsetOdometer` int NULL, `dismissedDate` datetime NULL, `dismissUntilDate` datetime NULL, `dismissUntilOdometer` int NULL, `activatedDate` datetime NOT NULL, `lastActivatedDate` datetime NOT NULL, `userId` varchar(36) NULL, `unitId` varchar(36) NULL, `serviceId` varchar(36) NULL, `dismissedById` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;"
    );
    await queryRunner.query(
      "CREATE TABLE `service_unit_entity` (`id` varchar(36) NOT NULL, `isActive` tinyint NOT NULL DEFAULT 1, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `date` datetime NOT NULL, `odometer` int UNSIGNED NOT NULL, `totalAmount` float UNSIGNED NOT NULL, `comments` varchar(1024) NOT NULL DEFAULT '', `location` varchar(32) NOT NULL, `userId` varchar(36) NULL, `unitId` varchar(36) NULL, `serviceId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;"
    );
    await queryRunner.query(
      "CREATE TABLE `client_entity` (`id` varchar(36) NOT NULL, `isActive` tinyint NOT NULL DEFAULT 1, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `registerDate` datetime NOT NULL, `account` varchar(8) NOT NULL, `buildingType` enum ('HOUSE', 'BUSINESS', 'OFFICE', 'OTHER') NOT NULL, `monitoringFlag` tinyint NOT NULL, `name` varchar(256) NOT NULL, `address` varchar(256) NOT NULL, `county` varchar(64) NOT NULL, `zipCode` varchar(5) NOT NULL, `city` varchar(64) NOT NULL, `emails` text NOT NULL DEFAULT '[]', `telephones` text NOT NULL DEFAULT '[]', `contacts` json NOT NULL DEFAULT '[]', `zones` json NOT NULL DEFAULT '[]', `notes` varchar(512) NOT NULL, `monitorConfig` json NOT NULL DEFAULT '{}', `createdUserId` varchar(36) NULL, `updatedUserId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;"
    );
    await queryRunner.query(
      'CREATE TABLE `product_entity_prices_product_price_entity` (`productEntityId` varchar(36) NOT NULL, `productPriceEntityId` varchar(36) NOT NULL, INDEX `IDX_7fa6cbb525a0f975d6fd64785d` (`productEntityId`), INDEX `IDX_caf9933d4cdb5b61d98eb121d9` (`productPriceEntityId`), PRIMARY KEY (`productEntityId`, `productPriceEntityId`)) ENGINE=InnoDB;'
    );
    await queryRunner.query(
      'CREATE TABLE `tech_service_entity_products_tech_service_product_entity` (`techServiceEntityId` varchar(36) NOT NULL, `techServiceProductEntityId` varchar(36) NOT NULL, INDEX `IDX_43e3e3f43deeae677976b13a98` (`techServiceEntityId`), INDEX `IDX_646dbcfa84dd52b95199ef8a12` (`techServiceProductEntityId`), PRIMARY KEY (`techServiceEntityId`, `techServiceProductEntityId`)) ENGINE=InnoDB;'
    );
    await queryRunner.query(
      'CREATE TABLE `tech_service_entity_assets_asset_entity` (`techServiceEntityId` varchar(36) NOT NULL, `assetEntityId` varchar(36) NOT NULL, INDEX `IDX_3fe7f72a59b8fef3630c1ae06f` (`techServiceEntityId`), INDEX `IDX_e75282d15e692d6e2cd8363424` (`assetEntityId`), PRIMARY KEY (`techServiceEntityId`, `assetEntityId`)) ENGINE=InnoDB;'
    );
    await queryRunner.query(
      'CREATE TABLE `unit_entity_assets_asset_entity` (`unitEntityId` varchar(36) NOT NULL, `assetEntityId` varchar(36) NOT NULL, INDEX `IDX_c731c7221feaed69ec8b2b1e9b` (`unitEntityId`), INDEX `IDX_1266a7f7f6e29e2ae410be5537` (`assetEntityId`), PRIMARY KEY (`unitEntityId`, `assetEntityId`)) ENGINE=InnoDB;'
    );
    await queryRunner.query(
      'CREATE TABLE `unit_user_entity_assets_asset_entity` (`unitUserEntityId` varchar(36) NOT NULL, `assetEntityId` varchar(36) NOT NULL, INDEX `IDX_3204ac34a8ea49e25e11506c53` (`unitUserEntityId`), INDEX `IDX_3825deb80c20640102f173ca9b` (`assetEntityId`), PRIMARY KEY (`unitUserEntityId`, `assetEntityId`)) ENGINE=InnoDB;'
    );
    await queryRunner.query(
      'CREATE TABLE `unit_fueling_entity_assets_asset_entity` (`unitFuelingEntityId` varchar(36) NOT NULL, `assetEntityId` varchar(36) NOT NULL, INDEX `IDX_8a941a456bb8633f7106af5908` (`unitFuelingEntityId`), INDEX `IDX_2109b41fca19c3018a9c48d302` (`assetEntityId`), PRIMARY KEY (`unitFuelingEntityId`, `assetEntityId`)) ENGINE=InnoDB;'
    );
    await queryRunner.query(
      'CREATE TABLE `service_unit_entity_assets_asset_entity` (`serviceUnitEntityId` varchar(36) NOT NULL, `assetEntityId` varchar(36) NOT NULL, INDEX `IDX_bfc220dd7344e2b19167a4995c` (`serviceUnitEntityId`), INDEX `IDX_f29ad9112cfbe7cb65f304c670` (`assetEntityId`), PRIMARY KEY (`serviceUnitEntityId`, `assetEntityId`)) ENGINE=InnoDB;'
    );
    await queryRunner.query(
      'ALTER TABLE `product_price_entity` ADD CONSTRAINT `FK_55165f6b8a21dba49bc7813cc61` FOREIGN KEY (`priceListId`) REFERENCES `price_list_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;'
    );
    await queryRunner.query(
      'ALTER TABLE `tech_service_product_entity` ADD CONSTRAINT `FK_8e2c0c0eddec116dd9441b96048` FOREIGN KEY (`productId`) REFERENCES `product_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;'
    );
    await queryRunner.query(
      'ALTER TABLE `tech_service_product_entity` ADD CONSTRAINT `FK_127aa072fbb07c52dae36ed88b3` FOREIGN KEY (`priceListId`) REFERENCES `price_list_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;'
    );
    await queryRunner.query(
      'ALTER TABLE `tech_service_entity` ADD CONSTRAINT `FK_3e8739b8488730be67dc6284f87` FOREIGN KEY (`technicianUserId`) REFERENCES `user_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;'
    );
    await queryRunner.query(
      'ALTER TABLE `tech_service_entity` ADD CONSTRAINT `FK_4040150f0a9be89a2228954b824` FOREIGN KEY (`clientId`) REFERENCES `client_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;'
    );
    await queryRunner.query(
      'ALTER TABLE `tech_service_entity` ADD CONSTRAINT `FK_fb49db599203277384847fff23b` FOREIGN KEY (`coordinatorUserId`) REFERENCES `user_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;'
    );
    await queryRunner.query(
      'ALTER TABLE `tech_service_entity` ADD CONSTRAINT `FK_4c392eaecd56e58339adbee5fda` FOREIGN KEY (`financialUserId`) REFERENCES `user_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;'
    );
    await queryRunner.query(
      'ALTER TABLE `user_entity` ADD CONSTRAINT `FK_ebf336fa7dbea8da350abd3463f` FOREIGN KEY (`authId`) REFERENCES `user_auth_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;'
    );
    await queryRunner.query(
      'ALTER TABLE `unit_user_entity` ADD CONSTRAINT `FK_6464d693b58e459e29b5b9d8a9d` FOREIGN KEY (`userId`) REFERENCES `user_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;'
    );
    await queryRunner.query(
      'ALTER TABLE `unit_user_entity` ADD CONSTRAINT `FK_c0b0081527a4e63aa50a9b78d1f` FOREIGN KEY (`unitId`) REFERENCES `unit_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;'
    );
    await queryRunner.query(
      'ALTER TABLE `unit_fueling_entity` ADD CONSTRAINT `FK_fe1b2b9129a779584617a8aa1c8` FOREIGN KEY (`userId`) REFERENCES `user_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;'
    );
    await queryRunner.query(
      'ALTER TABLE `unit_fueling_entity` ADD CONSTRAINT `FK_790ddcbc2a270ef8fe1274dd602` FOREIGN KEY (`unitId`) REFERENCES `unit_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;'
    );
    await queryRunner.query(
      'ALTER TABLE `service_alert_entity` ADD CONSTRAINT `FK_a68f7c00cd34c16541784d94d52` FOREIGN KEY (`userId`) REFERENCES `user_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;'
    );
    await queryRunner.query(
      'ALTER TABLE `service_alert_entity` ADD CONSTRAINT `FK_0e2891347fcd22519964e6e39fb` FOREIGN KEY (`unitId`) REFERENCES `unit_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;'
    );
    await queryRunner.query(
      'ALTER TABLE `service_alert_entity` ADD CONSTRAINT `FK_79b525db7e35fc695a485d5c862` FOREIGN KEY (`serviceId`) REFERENCES `service_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;'
    );
    await queryRunner.query(
      'ALTER TABLE `service_alert_entity` ADD CONSTRAINT `FK_e13634f96b281322c808b1505a3` FOREIGN KEY (`dismissedById`) REFERENCES `user_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;'
    );
    await queryRunner.query(
      'ALTER TABLE `service_unit_entity` ADD CONSTRAINT `FK_1a08b500de308cd22fec8d3bd2c` FOREIGN KEY (`userId`) REFERENCES `user_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;'
    );
    await queryRunner.query(
      'ALTER TABLE `service_unit_entity` ADD CONSTRAINT `FK_d02206803ef5ceee9fe96095b41` FOREIGN KEY (`unitId`) REFERENCES `unit_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;'
    );
    await queryRunner.query(
      'ALTER TABLE `service_unit_entity` ADD CONSTRAINT `FK_6dd1143f31dcd87ca7108c29278` FOREIGN KEY (`serviceId`) REFERENCES `service_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;'
    );
    await queryRunner.query(
      'ALTER TABLE `client_entity` ADD CONSTRAINT `FK_477ce50dccb23545bafa020fe42` FOREIGN KEY (`createdUserId`) REFERENCES `user_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;'
    );
    await queryRunner.query(
      'ALTER TABLE `client_entity` ADD CONSTRAINT `FK_791f69bdabf9f07851510393b73` FOREIGN KEY (`updatedUserId`) REFERENCES `user_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;'
    );
    await queryRunner.query(
      'ALTER TABLE `product_entity_prices_product_price_entity` ADD CONSTRAINT `FK_7fa6cbb525a0f975d6fd64785de` FOREIGN KEY (`productEntityId`) REFERENCES `product_entity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;'
    );
    await queryRunner.query(
      'ALTER TABLE `product_entity_prices_product_price_entity` ADD CONSTRAINT `FK_caf9933d4cdb5b61d98eb121d9f` FOREIGN KEY (`productPriceEntityId`) REFERENCES `product_price_entity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;'
    );
    await queryRunner.query(
      'ALTER TABLE `tech_service_entity_products_tech_service_product_entity` ADD CONSTRAINT `FK_43e3e3f43deeae677976b13a981` FOREIGN KEY (`techServiceEntityId`) REFERENCES `tech_service_entity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;'
    );
    await queryRunner.query(
      'ALTER TABLE `tech_service_entity_products_tech_service_product_entity` ADD CONSTRAINT `FK_646dbcfa84dd52b95199ef8a121` FOREIGN KEY (`techServiceProductEntityId`) REFERENCES `tech_service_product_entity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;'
    );
    await queryRunner.query(
      'ALTER TABLE `tech_service_entity_assets_asset_entity` ADD CONSTRAINT `FK_3fe7f72a59b8fef3630c1ae06f5` FOREIGN KEY (`techServiceEntityId`) REFERENCES `tech_service_entity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;'
    );
    await queryRunner.query(
      'ALTER TABLE `tech_service_entity_assets_asset_entity` ADD CONSTRAINT `FK_e75282d15e692d6e2cd8363424d` FOREIGN KEY (`assetEntityId`) REFERENCES `asset_entity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;'
    );
    await queryRunner.query(
      'ALTER TABLE `unit_entity_assets_asset_entity` ADD CONSTRAINT `FK_c731c7221feaed69ec8b2b1e9b9` FOREIGN KEY (`unitEntityId`) REFERENCES `unit_entity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;'
    );
    await queryRunner.query(
      'ALTER TABLE `unit_entity_assets_asset_entity` ADD CONSTRAINT `FK_1266a7f7f6e29e2ae410be55371` FOREIGN KEY (`assetEntityId`) REFERENCES `asset_entity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;'
    );
    await queryRunner.query(
      'ALTER TABLE `unit_user_entity_assets_asset_entity` ADD CONSTRAINT `FK_3204ac34a8ea49e25e11506c533` FOREIGN KEY (`unitUserEntityId`) REFERENCES `unit_user_entity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;'
    );
    await queryRunner.query(
      'ALTER TABLE `unit_user_entity_assets_asset_entity` ADD CONSTRAINT `FK_3825deb80c20640102f173ca9b3` FOREIGN KEY (`assetEntityId`) REFERENCES `asset_entity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;'
    );
    await queryRunner.query(
      'ALTER TABLE `unit_fueling_entity_assets_asset_entity` ADD CONSTRAINT `FK_8a941a456bb8633f7106af5908b` FOREIGN KEY (`unitFuelingEntityId`) REFERENCES `unit_fueling_entity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;'
    );
    await queryRunner.query(
      'ALTER TABLE `unit_fueling_entity_assets_asset_entity` ADD CONSTRAINT `FK_2109b41fca19c3018a9c48d3026` FOREIGN KEY (`assetEntityId`) REFERENCES `asset_entity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;'
    );
    await queryRunner.query(
      'ALTER TABLE `service_unit_entity_assets_asset_entity` ADD CONSTRAINT `FK_bfc220dd7344e2b19167a4995c8` FOREIGN KEY (`serviceUnitEntityId`) REFERENCES `service_unit_entity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;'
    );
    await queryRunner.query(
      'ALTER TABLE `service_unit_entity_assets_asset_entity` ADD CONSTRAINT `FK_f29ad9112cfbe7cb65f304c670c` FOREIGN KEY (`assetEntityId`) REFERENCES `asset_entity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;'
    );

    await queryRunner.query(
      "INSERT INTO `user_auth_entity` (`id`, `isActive`, `created_at`, `updated_at`, `password`, `lastLogin`) VALUES ('c42ccea7-9e1c-4afa-bb18-3b91a7710d5b', 1, '2022-09-30 17:00:18.078253', '2022-09-30 17:00:18.078253', '<INSERT_HASHED_PASSWORD_HERE>', NULL);"
    );

    await queryRunner.query(
      "INSERT INTO `user_entity` (`id`, `isActive`, `created_at`, `updated_at`, `username`, `name`, `roles`, `authId`) VALUES ('70ec8fe3-b6f3-4023-9a90-cfba2fe103f3', 1, '2022-09-30 15:22:53.962773', '2022-09-30 15:22:53.962773', 'root', 'Gandalf the magician', '[\"ROOT\"]', 'c42ccea7-9e1c-4afa-bb18-3b91a7710d5b');"
    );

    await queryRunner.query('COMMIT;');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP DATABASE gigabyte;');
    await queryRunner.query('CREATE DATABASE gigabyte;');
  }
}
