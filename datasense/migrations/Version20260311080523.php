<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260311080523 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE departement (code VARCHAR(10) NOT NULL, nom VARCHAR(255) NOT NULL, region_id INT DEFAULT NULL, INDEX IDX_C1765B6398260155 (region_id), PRIMARY KEY (code)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE region (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, code VARCHAR(10) NOT NULL, UNIQUE INDEX UNIQ_F62F17677153098 (code), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE statistique_logement (id INT AUTO_INCREMENT NOT NULL, construction DOUBLE PRECISION DEFAULT NULL, nombre_logement INT DEFAULT NULL, logements_mis_en_location DOUBLE PRECISION DEFAULT NULL, departement_code VARCHAR(10) DEFAULT NULL, INDEX IDX_57E380456A333750 (departement_code), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL, available_at DATETIME NOT NULL, delivered_at DATETIME DEFAULT NULL, INDEX IDX_75EA56E0FB7336F0E3BD61CE16BA31DBBF396750 (queue_name, available_at, delivered_at, id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE departement ADD CONSTRAINT FK_C1765B6398260155 FOREIGN KEY (region_id) REFERENCES region (id)');
        $this->addSql('ALTER TABLE statistique_logement ADD CONSTRAINT FK_57E380456A333750 FOREIGN KEY (departement_code) REFERENCES departement (code)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE departement DROP FOREIGN KEY FK_C1765B6398260155');
        $this->addSql('ALTER TABLE statistique_logement DROP FOREIGN KEY FK_57E380456A333750');
        $this->addSql('DROP TABLE departement');
        $this->addSql('DROP TABLE region');
        $this->addSql('DROP TABLE statistique_logement');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
