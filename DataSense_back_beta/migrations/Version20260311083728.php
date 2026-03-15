<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260311083728 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE statistiques_departement DROP FOREIGN KEY `FK_464AB38F8837B2D3`');
        $this->addSql('ALTER TABLE statistiques_departement ADD nombre_statistiques_departements INT DEFAULT NULL, ADD taux_statistiques_departements_sociaux NUMERIC(5, 2) DEFAULT NULL, ADD taux_statistiques_departements_vacants NUMERIC(5, 2) DEFAULT NULL, ADD taux_statistiques_departements_individuels NUMERIC(5, 2) DEFAULT NULL, ADD parc_social_nombre_statistiques_departements INT DEFAULT NULL, ADD parc_social_statistiques_departements_mis_location INT DEFAULT NULL, ADD parc_social_statistiques_departements_demolis INT DEFAULT NULL, ADD parc_social_taux_statistiques_departements_vacants NUMERIC(5, 2) DEFAULT NULL, ADD parc_social_taux_statistiques_departements_individuels NUMERIC(5, 2) DEFAULT NULL, ADD parc_social_taux_statistiques_departements_energivores NUMERIC(5, 2) DEFAULT NULL, DROP nombre_logements, DROP taux_logements_sociaux, DROP taux_logements_vacants, DROP taux_logements_individuels, DROP parc_social_nombre_logements, DROP parc_social_logements_mis_location, DROP parc_social_logements_demolis, DROP parc_social_taux_logements_vacants, DROP parc_social_taux_logements_individuels, DROP parc_social_taux_logements_energivores');
        $this->addSql('DROP INDEX idx_464ab38f8837b2d3 ON statistiques_departement');
        $this->addSql('CREATE INDEX IDX_B89C4DF58837B2D3 ON statistiques_departement (code_departement)');
        $this->addSql('ALTER TABLE statistiques_departement ADD CONSTRAINT `FK_464AB38F8837B2D3` FOREIGN KEY (code_departement) REFERENCES departement (code) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE Statistiques_departement DROP FOREIGN KEY FK_B89C4DF58837B2D3');
        $this->addSql('ALTER TABLE Statistiques_departement ADD nombre_logements INT DEFAULT NULL, ADD taux_logements_sociaux NUMERIC(5, 2) DEFAULT NULL, ADD taux_logements_vacants NUMERIC(5, 2) DEFAULT NULL, ADD taux_logements_individuels NUMERIC(5, 2) DEFAULT NULL, ADD parc_social_nombre_logements INT DEFAULT NULL, ADD parc_social_logements_mis_location INT DEFAULT NULL, ADD parc_social_logements_demolis INT DEFAULT NULL, ADD parc_social_taux_logements_vacants NUMERIC(5, 2) DEFAULT NULL, ADD parc_social_taux_logements_individuels NUMERIC(5, 2) DEFAULT NULL, ADD parc_social_taux_logements_energivores NUMERIC(5, 2) DEFAULT NULL, DROP nombre_statistiques_departements, DROP taux_statistiques_departements_sociaux, DROP taux_statistiques_departements_vacants, DROP taux_statistiques_departements_individuels, DROP parc_social_nombre_statistiques_departements, DROP parc_social_statistiques_departements_mis_location, DROP parc_social_statistiques_departements_demolis, DROP parc_social_taux_statistiques_departements_vacants, DROP parc_social_taux_statistiques_departements_individuels, DROP parc_social_taux_statistiques_departements_energivores');
        $this->addSql('DROP INDEX idx_b89c4df58837b2d3 ON Statistiques_departement');
        $this->addSql('CREATE INDEX IDX_464AB38F8837B2D3 ON Statistiques_departement (code_departement)');
        $this->addSql('ALTER TABLE Statistiques_departement ADD CONSTRAINT FK_B89C4DF58837B2D3 FOREIGN KEY (code_departement) REFERENCES departement (code) ON DELETE CASCADE');
    }
}
