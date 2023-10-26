import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { UnitUserEntity, UserAuthEntity } from '../';
import { UnitUserInterface, UserInterface, UserProfileInterface, UserRolesEnum } from './../../shared';

@Entity()
export class UserEntity extends BaseEntity implements Partial<UserInterface> {
  @Column({ type: 'nvarchar', length: 32, unique: true })
  username: string;

  @Column({ type: 'nvarchar', length: 255 })
  name: string;

  @Column({ type: 'nvarchar', length: 64, nullable: true })
  cellphone?: string;

  @Column({ type: 'nvarchar', length: 128, nullable: true })
  email?: string;

  @OneToOne(() => UserAuthEntity, (userAuth) => userAuth.id, {
    cascade: true,
  })
  @JoinColumn()
  auth: Partial<UserAuthEntity>;

  @Column({ type: 'json', nullable: false, default: '[]' })
  roles: UserRolesEnum[];

  @OneToMany(() => UnitUserEntity, (unitUser) => unitUser.unit)
  assignations?: UnitUserInterface[];

  @Column({ type: 'json', nullable: false, default: '{}' })
  profile: UserProfileInterface;
}
