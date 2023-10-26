import { addDays, addMinutes, format } from 'date-fns';
import { AdminRoles, TechServiceInterface, TechServiceStatusEnum, UserRolesEnum } from './../../shared';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Between, FindOptionsWhere, IsNull, Not, Repository } from 'typeorm';
import { ID_AND_NAME_OBJ } from './../../utils';
import { ILogger } from './../../logger';
import { InjectRepository } from '@nestjs/typeorm';
import { TechServiceEntity } from './../../entities';
@Injectable()
export class TechSrvService {
  constructor(
    @InjectRepository(TechServiceEntity)
    private techSrvRepo: Repository<TechServiceEntity>,
    private logger: ILogger
  ) {}

  findAll(params: { technicianId?: string; status?: TechServiceStatusEnum; startDate: Date; endDate: Date }): Promise<TechServiceInterface[]> {
    this.logger.debug('Getting all tech services...');

    // Will get techservices based on date range or undefined service date
    let where: FindOptionsWhere<TechServiceEntity>[] = [{ serviceDate: Between(params.startDate, params.endDate) }, { serviceDate: IsNull() }];
    if (params.technicianId) where.forEach((elem) => (elem.technicianUser = { id: params.technicianId }));
    if (params.status) where.forEach((elem) => (elem.status = params.status));
    where.forEach((elem) => (elem.isActive = true));

    const select = { coordinatorUser: ID_AND_NAME_OBJ, technicianUser: ID_AND_NAME_OBJ, financialUser: ID_AND_NAME_OBJ };
    const relations = { assets: true, client: true, coordinatorUser: true, technicianUser: true, financialUser: true, products: { product: true, priceList: true } };

    return this.techSrvRepo.find({ select, where, relations });
  }

  findOne(id: string): Promise<TechServiceInterface> {
    this.logger.debug('Getting tech service...');
    const select = { coordinatorUser: ID_AND_NAME_OBJ, technicianUser: ID_AND_NAME_OBJ, financialUser: ID_AND_NAME_OBJ };
    const relations = { assets: true, client: true, coordinatorUser: true, technicianUser: true, financialUser: true, products: { product: true, priceList: true } };
    return this.techSrvRepo.findOne({
      select,
      where: { id },
      relations,
    });
  }

  async getNewServiceNumber(): Promise<string> {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);

    const todayTicketCount =
      (await this.techSrvRepo.count({
        where: { createdAt: Between(today, addDays(today, 1)) },
      })) + 1;

    return `${format(today, 'yyMMdd')}${todayTicketCount.toString().padStart(5, '0')}`;
  }

  async create(techSrv: TechServiceInterface, userRoles: UserRolesEnum[]): Promise<TechServiceInterface> {
    this.logger.debug('Creating tech service...');
    delete techSrv.id;
    await this.validate(techSrv, userRoles);
    techSrv.serviceNumber = await this.getNewServiceNumber();
    return this.techSrvRepo.save(techSrv);
  }

  async remove(id: string): Promise<boolean> {
    this.logger.debug('Removing tech service...');

    const deleted = await this.techSrvRepo.update(id, { isActive: false });

    return deleted.affected > 0;
  }

  async update(techSrv: TechServiceInterface, userRoles: UserRolesEnum[]): Promise<TechServiceInterface> {
    this.logger.debug('Updating tech service...');

    if (!techSrv.id) throw new BadRequestException('The tech service id was not provided');

    const existing = await this.techSrvRepo.findOne({
      where: { id: techSrv.id },
    });

    if (!existing) throw new NotFoundException('The tech service was not found in the database');

    await this.validate(techSrv, userRoles);

    // If it's date update then adjust status
    if (existing.serviceDate != techSrv.serviceDate && [TechServiceStatusEnum.CREATED].includes(techSrv.status)) techSrv.status = TechServiceStatusEnum.RESCHEDULE;

    // We don't want to update serviceNumber (readonly)
    delete techSrv.serviceNumber;

    // We don't want to keep the previous values
    existing.client = null;
    existing.technicianUser = null;

    return this.techSrvRepo.save({ ...existing, ...techSrv });
  }

  async validate(techSrv: TechServiceInterface, userRoles: UserRolesEnum[]) {
    this.validateStatus(techSrv.status, userRoles);
    await this.validateOverlap(techSrv);
    this.validateAmounts(techSrv);
  }

  validateAmounts(techSrv: TechServiceInterface) {
    const totalAmount = techSrv.products.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
    if (totalAmount !== techSrv.totalAmount) throw new BadRequestException('Incorrect totalAmount does not match with products price sum');

    const overAll = techSrv.totalAmount + techSrv.extraCharge;
    if (overAll !== techSrv.overallRate) throw new BadRequestException('Incorrect overAllRate does not match with total+extras');
  }

  validateStatus(status: TechServiceStatusEnum, userRoles: UserRolesEnum[]) {
    if (
      [TechServiceStatusEnum.REVIEWED, TechServiceStatusEnum.FINISHED, TechServiceStatusEnum.PAYMENT_CONFIRMATION].includes(status) &&
      !userRoles.some((role) => [...AdminRoles, UserRolesEnum.DEBT].includes(role))
    )
      throw new BadRequestException('Incorrect status for user roles');
  }

  async validateOverlap(currSrv: TechServiceInterface) {
    // Only validate Overlap from a service scheduling standpoint
    if (![TechServiceStatusEnum.CREATED, TechServiceStatusEnum.RESCHEDULE, TechServiceStatusEnum.PENDING].includes(currSrv.status)) return;

    if (currSrv.serviceDate && currSrv.technicianUser?.id) {
      const estimatedEndDate = (srv: TechServiceInterface): Date => {
        return addMinutes(srv.serviceDate, srv.estimatedMinutes);
      };

      const where: FindOptionsWhere<TechServiceEntity> = {
        technicianUser: { id: currSrv.technicianUser.id },
        status: Not(TechServiceStatusEnum.CANCELLED),
        isActive: true,
      };

      if (currSrv.id) where.id = Not(currSrv.id);

      // Looks for other active services from the same technician
      const services = await this.techSrvRepo.find({
        where,
        relations: { technicianUser: true },
      });

      if (!services.length) return;

      const overridingServices = services.filter((prevSrv) => {
        if (prevSrv.serviceDate.getTime() >= currSrv.serviceDate.getTime()) {
          const currEndDate = estimatedEndDate(currSrv);
          return prevSrv.serviceDate.getTime() < currEndDate.getTime();
        } else {
          const prevEndDate = estimatedEndDate(prevSrv);
          return prevEndDate.getTime() > currSrv.serviceDate.getTime();
        }
      });

      if (overridingServices.length) throw new ConflictException(`There is an existing service [${JSON.stringify(overridingServices[0])}] causing conflict with [[${JSON.stringify(currSrv)}]`);
    }
  }
}
