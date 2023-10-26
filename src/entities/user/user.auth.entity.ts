import { UserAuthInterface } from './../../shared';
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity()
export class UserAuthEntity extends BaseEntity implements Partial<UserAuthInterface> {
  @Column()
  password: string;

  @Column({ nullable: true })
  lastLogin?: Date;

  @Column({ nullable: true, default: false })
  forceLogout?: boolean;
}
