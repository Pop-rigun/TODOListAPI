import { MigrationInterface, QueryRunner } from 'typeorm';

export class migtation1670588431159 implements MigrationInterface {
  name = 'migtation1670588431159';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "text" character varying NOT NULL, "taskListId" uuid, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "task_list" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_e9f70d01f59395c1dfdc633ae37" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_47fc40cc98de35bf7aaaaaeeac5" FOREIGN KEY ("taskListId") REFERENCES "task_list"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_list" ADD CONSTRAINT "FK_d34f2d64706c6a8188a6446678b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_list" DROP CONSTRAINT "FK_d34f2d64706c6a8188a6446678b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_47fc40cc98de35bf7aaaaaeeac5"`,
    );
    await queryRunner.query(`DROP TABLE "task_list"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "task"`);
  }
}
