import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveGenderColumUserEntity1699905294779
  implements MigrationInterface
{
  name = 'RemoveGenderColumUserEntity1699905294779';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "gender"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "gender" character varying NOT NULL`,
    );
  }
}
