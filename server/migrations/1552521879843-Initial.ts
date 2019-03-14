import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1552521879843 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "household" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" integer, "edited_by_id" integer, "name" character varying NOT NULL, "motto" text NOT NULL, "description" text NOT NULL, CONSTRAINT "PK_26e9111eab2b8908fefe3c645f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permission" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "key" character varying NOT NULL, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_permission" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" integer, "edited_by_id" integer, "value" integer NOT NULL, "role_id" integer, "permission_id" integer, CONSTRAINT "PK_96c8f1fd25538d3692024115b47" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" integer, "edited_by_id" integer, "name" character varying NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "membership_permission" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" integer, "edited_by_id" integer, "value" integer NOT NULL, "membership_id" integer, "permission_id" integer, CONSTRAINT "PK_1259309aedc9494e16fb85d3d7e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "household_membership" ("id" SERIAL NOT NULL, "household_id" integer, "member_id" integer, "role_id" integer, CONSTRAINT "PK_f15e5753731ec832cb6366a8219" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "member" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" integer, "edited_by_id" integer, "first_name" character varying, "last_name" character varying, "alias" character varying, "email" text NOT NULL, "password" text NOT NULL, CONSTRAINT "PK_97cbbe986ce9d14ca5894fdc072" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "household" ADD CONSTRAINT "FK_8c54f4e4ad50543c20076d07598" FOREIGN KEY ("created_by_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "household" ADD CONSTRAINT "FK_fa1243e88d20c41e7a9e9f4533a" FOREIGN KEY ("edited_by_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD CONSTRAINT "FK_4b287bde1f9c4f084f26542a975" FOREIGN KEY ("created_by_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD CONSTRAINT "FK_e48ffe48dc09095712885159109" FOREIGN KEY ("edited_by_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD CONSTRAINT "FK_3d0a7155eafd75ddba5a7013368" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permission" ADD CONSTRAINT "FK_e3a3ba47b7ca00fd23be4ebd6cf" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "FK_db92db78f9478b3e2fea19934b3" FOREIGN KEY ("created_by_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "FK_9525da435841316674e99f42eed" FOREIGN KEY ("edited_by_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "membership_permission" ADD CONSTRAINT "FK_318d00c917bbca993d03bd0f0b8" FOREIGN KEY ("created_by_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "membership_permission" ADD CONSTRAINT "FK_3baf9ebb05dd25f27178c1d4d98" FOREIGN KEY ("edited_by_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "membership_permission" ADD CONSTRAINT "FK_6043f45f0cd0d787fcffd181dd5" FOREIGN KEY ("membership_id") REFERENCES "household_membership"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "membership_permission" ADD CONSTRAINT "FK_0fb0067a46463412d7f5bbb4a41" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "household_membership" ADD CONSTRAINT "FK_4774e7b0e66a21607c2aa2b04bc" FOREIGN KEY ("household_id") REFERENCES "household"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "household_membership" ADD CONSTRAINT "FK_c43763681be88c927afa6ad2cf5" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "household_membership" ADD CONSTRAINT "FK_182216fadc232c31c667532eaf8" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member" ADD CONSTRAINT "FK_fb66d37568b15ed11d53f689659" FOREIGN KEY ("created_by_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member" ADD CONSTRAINT "FK_d95c3b882aefbdf64fd4e6dce27" FOREIGN KEY ("edited_by_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "member" DROP CONSTRAINT "FK_d95c3b882aefbdf64fd4e6dce27"`);
        await queryRunner.query(`ALTER TABLE "member" DROP CONSTRAINT "FK_fb66d37568b15ed11d53f689659"`);
        await queryRunner.query(`ALTER TABLE "household_membership" DROP CONSTRAINT "FK_182216fadc232c31c667532eaf8"`);
        await queryRunner.query(`ALTER TABLE "household_membership" DROP CONSTRAINT "FK_c43763681be88c927afa6ad2cf5"`);
        await queryRunner.query(`ALTER TABLE "household_membership" DROP CONSTRAINT "FK_4774e7b0e66a21607c2aa2b04bc"`);
        await queryRunner.query(`ALTER TABLE "membership_permission" DROP CONSTRAINT "FK_0fb0067a46463412d7f5bbb4a41"`);
        await queryRunner.query(`ALTER TABLE "membership_permission" DROP CONSTRAINT "FK_6043f45f0cd0d787fcffd181dd5"`);
        await queryRunner.query(`ALTER TABLE "membership_permission" DROP CONSTRAINT "FK_3baf9ebb05dd25f27178c1d4d98"`);
        await queryRunner.query(`ALTER TABLE "membership_permission" DROP CONSTRAINT "FK_318d00c917bbca993d03bd0f0b8"`);
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_9525da435841316674e99f42eed"`);
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_db92db78f9478b3e2fea19934b3"`);
        await queryRunner.query(`ALTER TABLE "role_permission" DROP CONSTRAINT "FK_e3a3ba47b7ca00fd23be4ebd6cf"`);
        await queryRunner.query(`ALTER TABLE "role_permission" DROP CONSTRAINT "FK_3d0a7155eafd75ddba5a7013368"`);
        await queryRunner.query(`ALTER TABLE "role_permission" DROP CONSTRAINT "FK_e48ffe48dc09095712885159109"`);
        await queryRunner.query(`ALTER TABLE "role_permission" DROP CONSTRAINT "FK_4b287bde1f9c4f084f26542a975"`);
        await queryRunner.query(`ALTER TABLE "household" DROP CONSTRAINT "FK_fa1243e88d20c41e7a9e9f4533a"`);
        await queryRunner.query(`ALTER TABLE "household" DROP CONSTRAINT "FK_8c54f4e4ad50543c20076d07598"`);
        await queryRunner.query(`DROP TABLE "member"`);
        await queryRunner.query(`DROP TABLE "household_membership"`);
        await queryRunner.query(`DROP TABLE "membership_permission"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "role_permission"`);
        await queryRunner.query(`DROP TABLE "permission"`);
        await queryRunner.query(`DROP TABLE "household"`);
    }

}
