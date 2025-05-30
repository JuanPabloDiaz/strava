<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version19700101000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE Activity (activityId VARCHAR(255) NOT NULL, startDateTime DATETIME NOT NULL --(DC2Type:datetime_immutable)
        , data CLOB NOT NULL --(DC2Type:json)
        , location CLOB DEFAULT NULL --(DC2Type:json)
        , weather CLOB DEFAULT NULL --(DC2Type:json)
        , gearId VARCHAR(255) DEFAULT NULL, PRIMARY KEY(activityId))');
        $this->addSql('CREATE TABLE ActivityStream (activityId VARCHAR(255) NOT NULL, streamType VARCHAR(255) NOT NULL, createdOn DATETIME NOT NULL --(DC2Type:datetime_immutable)
        , data CLOB NOT NULL --(DC2Type:json)
        , bestAverages CLOB DEFAULT NULL --(DC2Type:json)
        , PRIMARY KEY(activityId, streamType))');
        $this->addSql('CREATE TABLE Challenge (challengeId VARCHAR(255) NOT NULL, createdOn DATETIME NOT NULL --(DC2Type:datetime_immutable)
        , data CLOB NOT NULL --(DC2Type:json)
        , PRIMARY KEY(challengeId))');
        $this->addSql('CREATE TABLE Ftp (setOn DATE NOT NULL --(DC2Type:date_immutable)
        , ftp INTEGER NOT NULL, PRIMARY KEY(setOn))');
        $this->addSql('CREATE TABLE Gear (gearId VARCHAR(255) NOT NULL, createdOn DATETIME NOT NULL --(DC2Type:datetime_immutable)
        , distanceInMeter INTEGER NOT NULL, data CLOB NOT NULL --(DC2Type:json)
        , PRIMARY KEY(gearId))');
        $this->addSql('CREATE TABLE KeyValue ("key" VARCHAR(255) NOT NULL, value CLOB NOT NULL, PRIMARY KEY("key"))');
        $this->addSql('CREATE TABLE Segment (segmentId VARCHAR(255) NOT NULL, name VARCHAR(255) DEFAULT NULL, data CLOB NOT NULL --(DC2Type:json)
        , PRIMARY KEY(segmentId))');
        $this->addSql('CREATE TABLE SegmentEffort (segmentEffortId VARCHAR(255) NOT NULL, segmentId VARCHAR(255) NOT NULL, activityId VARCHAR(255) NOT NULL, startDateTime DATETIME NOT NULL --(DC2Type:datetime_immutable)
        , data CLOB NOT NULL --(DC2Type:json)
        , PRIMARY KEY(segmentEffortId))');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE Activity');
        $this->addSql('DROP TABLE ActivityStream');
        $this->addSql('DROP TABLE Challenge');
        $this->addSql('DROP TABLE Ftp');
        $this->addSql('DROP TABLE Gear');
        $this->addSql('DROP TABLE KeyValue');
        $this->addSql('DROP TABLE Segment');
        $this->addSql('DROP TABLE SegmentEffort');
    }
}
