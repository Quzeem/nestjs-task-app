import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  // Custom method for a user entity
  async verifyPassword(enteredPassword: string): Promise<boolean> {
    const result = await bcrypt.compare(enteredPassword, this.password);
    return result;
  }
}
