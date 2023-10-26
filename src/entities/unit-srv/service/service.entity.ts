import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { ServiceFreqTypeEnum, ServiceInterface, ServiceParamOdometerInterface, ServiceParamTimeInterface, ServicePriorityEnum } from '../../../shared';

@Entity()
export class ServiceEntity extends BaseEntity implements ServiceInterface {
  @Column({ type: 'nvarchar', length: 255 })
  name: string;

  @Column({
    type: 'enum',
    enum: ServiceFreqTypeEnum,
  })
  freqType: ServiceFreqTypeEnum;

  @Column({ type: 'json', nullable: false })
  params: ServiceParamTimeInterface | ServiceParamOdometerInterface;

  @Column({
    type: 'enum',
    enum: ServicePriorityEnum,
    default: ServicePriorityEnum.NORMAL,
  })
  priority: ServicePriorityEnum;

  @Column({ type: 'boolean' })
  alertActive: boolean;
}
