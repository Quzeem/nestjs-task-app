import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGenderColumUserEntity1699904072294
  implements MigrationInterface
{
  name = 'AddGenderColumUserEntity1699904072294';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "gender" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "gender"`);
  }
}
