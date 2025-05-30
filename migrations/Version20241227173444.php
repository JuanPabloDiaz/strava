<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241227173444 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TEMPORARY TABLE __temp__Activity AS SELECT activityId, startDateTime, data, gearId, weather, location FROM Activity');
        $this->addSql('DROP TABLE Activity');
        $this->addSql('CREATE TABLE Activity (activityId VARCHAR(255) NOT NULL, startDateTime DATETIME NOT NULL --(DC2Type:datetime_immutable)
        , data CLOB NOT NULL --(DC2Type:json)
        , gearId VARCHAR(255) DEFAULT NULL, weather CLOB DEFAULT NULL --(DC2Type:json)
        , location CLOB DEFAULT NULL --(DC2Type:json)
        , activityType VARCHAR(255) DEFAULT NULL, PRIMARY KEY(activityId))');
        $this->addSql('INSERT INTO Activity (activityId, startDateTime, data, gearId, weather, location) SELECT activityId, startDateTime, data, gearId, weather, location FROM __temp__Activity');
        $this->addSql('DROP TABLE __temp__Activity');

        $this->addSql('UPDATE Activity SET activityType = JSON_EXTRACT(data, "$.type")');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TEMPORARY TABLE __temp__Activity AS SELECT activityId, startDateTime, data, location, weather, gearId FROM Activity');
        $this->addSql('DROP TABLE Activity');
        $this->addSql('CREATE TABLE Activity (activityId VARCHAR(255) NOT NULL, startDateTime DATETIME NOT NULL --(DC2Type:datetime_immutable)
        , data CLOB NOT NULL --(DC2Type:json)
        , location CLOB DEFAULT NULL, weather CLOB DEFAULT NULL, gearId VARCHAR(255) DEFAULT NULL, PRIMARY KEY(activityId))');
        $this->addSql('INSERT INTO Activity (activityId, startDateTime, data, location, weather, gearId) SELECT activityId, startDateTime, data, location, weather, gearId FROM __temp__Activity');
        $this->addSql('DROP TABLE __temp__Activity');
    }
}
