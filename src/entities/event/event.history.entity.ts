import { BaseEntity } from '../base.entity';
import { EventHistoryInterface, UserInterface } from '../../shared';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from '../user';

@Entity()
export class EventHistoryEntity extends BaseEntity implements EventHistoryInterface {
  @Column({
    type: 'nvarchar',
    length: 512,
  })
  info: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user: Partial<UserInterface>;
}
