import {MigrationInterface, QueryRunner} from "typeorm";

export class Basic1653494855225 implements MigrationInterface {
    name = 'Basic1653494855225'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`basic\` (\`id\` int NOT NULL AUTO_INCREMENT, \`first_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`biography\` text NOT NULL, \`role\` int NOT NULL, \`o_create_date\` timestamp NOT NULL, \`o_update_date\` timestamp NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`basic\``);
    }

}
