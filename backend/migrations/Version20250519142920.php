<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250519142920 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE candidate (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, surname VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, phone VARCHAR(255) NOT NULL, program VARCHAR(255) NOT NULL, motivation LONGTEXT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE media (id INT AUTO_INCREMENT NOT NULL, file_path VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE media_project (media_id INT NOT NULL, project_id INT NOT NULL, INDEX IDX_4E6456A7EA9FDD75 (media_id), INDEX IDX_4E6456A7166D1F9C (project_id), PRIMARY KEY(media_id, project_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE project (id INT AUTO_INCREMENT NOT NULL, description LONGTEXT NOT NULL, date DATE NOT NULL, techno LONGTEXT NOT NULL, is_active TINYINT(1) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE project_student (project_id INT NOT NULL, student_id INT NOT NULL, INDEX IDX_213DA356166D1F9C (project_id), INDEX IDX_213DA356CB944F1A (student_id), PRIMARY KEY(project_id, student_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE student (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, surname VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE media_project ADD CONSTRAINT FK_4E6456A7EA9FDD75 FOREIGN KEY (media_id) REFERENCES media (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE media_project ADD CONSTRAINT FK_4E6456A7166D1F9C FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE project_student ADD CONSTRAINT FK_213DA356166D1F9C FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE project_student ADD CONSTRAINT FK_213DA356CB944F1A FOREIGN KEY (student_id) REFERENCES student (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user ADD name VARCHAR(255) NOT NULL, ADD surname VARCHAR(255) NOT NULL
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE media_project DROP FOREIGN KEY FK_4E6456A7EA9FDD75
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE media_project DROP FOREIGN KEY FK_4E6456A7166D1F9C
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE project_student DROP FOREIGN KEY FK_213DA356166D1F9C
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE project_student DROP FOREIGN KEY FK_213DA356CB944F1A
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE candidate
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE media
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE media_project
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE project
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE project_student
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE student
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user DROP name, DROP surname
        SQL);
    }
}
