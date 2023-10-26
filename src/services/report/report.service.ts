import { AppConfig } from './../../app.config';
import { Between, FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { ConfigType } from '@nestjs/config';
import { ILogger } from './../../logger';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaStatusEnum, ReportFormatEnum, ReportParamsInterface, ReportTypeEnum, TechServiceReportInterface, UnitFuelingReportInterface, UnitServiceReportInterface } from './../../shared';
import { ServiceUnitEntity, TechServiceEntity, UnitFuelingEntity } from './../../entities';
import { template } from 'lodash';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(ServiceUnitEntity)
    private unitServiceRepo: Repository<ServiceUnitEntity>,
    @InjectRepository(UnitFuelingEntity)
    private unitFuelingRepo: Repository<UnitFuelingEntity>,
    @InjectRepository(TechServiceEntity)
    private techServiceRepo: Repository<TechServiceEntity>,
    @Inject(AppConfig.KEY)
    private config: ConfigType<typeof AppConfig>,
    private logger: ILogger
  ) {}

  convertToCsv(arr: UnitFuelingReportInterface[] | UnitServiceReportInterface[] | TechServiceReportInterface[]) {
    const keys = Object.keys(arr[0]);
    const replacer = (_key: string, value: object) => (value === null ? '' : value);
    const processRow = (row: UnitFuelingReportInterface | UnitServiceReportInterface | TechServiceReportInterface) => keys.map((key) => JSON.stringify(row[key], replacer)).join(',');
    return [keys.join(','), ...arr.map(processRow)].join('\r\n');
  }

  async generate(params: ReportParamsInterface, userId: string): Promise<UnitFuelingReportInterface[] | UnitServiceReportInterface[] | TechServiceReportInterface[] | string> {
    this.logger.debug(`Generating report... [${JSON.stringify(params)}] by [${userId}]`);

    const t0 = new Date().getTime();
    let preResult: UnitFuelingReportInterface[] | UnitServiceReportInterface[] | TechServiceReportInterface[];

    if (params.type === ReportTypeEnum.UNIT_FUELING) preResult = await this.generateFuelingReport(params);
    else if (params.type === ReportTypeEnum.UNIT_SERVICE) preResult = await this.generateUnitServiceReport(params);
    else if (params.type === ReportTypeEnum.TECH_SERVICE) preResult = await this.generateTechServiceReport(params);

    let result: UnitFuelingReportInterface[] | UnitServiceReportInterface[] | TechServiceReportInterface[] | string = preResult;
    if (params.format === ReportFormatEnum.CSV) result = this.convertToCsv(preResult);

    this.logger.debug(`Report generated... [${JSON.stringify(params)}] by [${userId}] took ${new Date().getTime() - t0} milliseconds.`);

    return result;
  }

  getUnitFuelingWhereParams(params: ReportParamsInterface): FindOptionsWhere<UnitFuelingEntity> {
    const where: FindOptionsWhere<UnitFuelingEntity> = { isActive: true };
    if (params.startDate && params.endDate) where.date = Between(params.startDate, params.endDate);
    else if (params.startDate) where.date = MoreThanOrEqual(params.startDate);
    else if (params.endDate) where.date = LessThanOrEqual(params.endDate);

    if (params.unitId) where.unit = { id: params.unitId };
    if (params.userId) where.user = { id: params.userId };
    return where;
  }

  getGoogleLink(coords: string) {
    return template(this.config.GOOGLE_MAPS_URL)({ coords });
  }

  async generateUnitServiceReport(params: ReportParamsInterface): Promise<UnitServiceReportInterface[]> {
    const unitServiceData = await this.unitServiceRepo.find({
      where: this.getUnitFuelingWhereParams(params),
      relations: { assets: true, unit: true, user: true, service: true },
    });
    return unitServiceData.map(
      (data) =>
        <UnitServiceReportInterface>{
          date: data.date,
          userId: data.user.id,
          user: data.user.username,
          userName: data.user.name,
          unitId: data.unit.id,
          unitName: data.unit.description,
          plate: data.unit.plate,
          serviceId: data.service.id,
          serviceName: data.service.name,
          serviceType: data.service.freqType,
          serviceParams: data.service.params,
          odometer: data.odometer,
          total: data.totalAmount,
          comments: data.comments,
          location: this.getGoogleLink(data.location),
          assets: data.assets
            .filter((asset) => asset.status === MediaStatusEnum.UPLOADED)
            .map((asset) => asset.url)
            .join(';'),
        }
    );
  }

  async generateFuelingReport(params: ReportParamsInterface): Promise<UnitFuelingReportInterface[]> {
    const fuelingData = await this.unitFuelingRepo.find({ where: this.getUnitFuelingWhereParams(params), relations: { assets: true, unit: true, user: true } });
    return fuelingData.map(
      (data) =>
        <UnitFuelingReportInterface>{
          date: data.date,
          userId: data.user.id,
          user: data.user.username,
          userName: data.user.name,
          unitId: data.unit.id,
          unitName: data.unit.description,
          plate: data.unit.plate,
          odometer: data.odometer,
          liters: data.liters,
          performance: data.performance,
          total: data.totalAmount,
          comments: data.comments,
          location: this.getGoogleLink(data.location),
          assets: data.assets
            .filter((asset) => asset.status === MediaStatusEnum.UPLOADED)
            .map((asset) => asset.url)
            .join(';'),
        }
    );
  }

  getTechServiceWhereParams(params: ReportParamsInterface): FindOptionsWhere<UnitFuelingEntity> {
    const where: FindOptionsWhere<TechServiceEntity> = { isActive: true };
    if (params.startDate && params.endDate) where.serviceDate = Between(params.startDate, params.endDate);
    else if (params.startDate) where.serviceDate = MoreThanOrEqual(params.startDate);
    else if (params.endDate) where.serviceDate = LessThanOrEqual(params.endDate);

    if (params.userId) where.technicianUser = { id: params.userId };
    return where;
  }

  async generateTechServiceReport(params: ReportParamsInterface): Promise<TechServiceReportInterface[]> {
    const techServiceData = await this.techServiceRepo.find({
      where: this.getTechServiceWhereParams(params),
      relations: { assets: true, technicianUser: true, financialUser: true, client: true, coordinatorUser: true, products: { product: true } },
    });
    return techServiceData.map(
      (data) =>
        <TechServiceReportInterface>{
          serviceDate: data.serviceDate,
          description: data.description,
          estimatedTime: data.estimatedMinutes,
          serviceDateEnd: data.serviceDateEnd,
          status: data.status,
          priority: data.priority,
          quiz: data.quiz.map((qq) => `${qq.category}:${qq.rate}`).join('|'),
          overallRate: data.overallRate,
          extraCharge: data.extraCharge,
          extraChargeComment: data.extraChargeComment,
          totalAmount: data.totalAmount,
          comments: data.comments,
          technicianUser: data.technicianUser?.name ?? null,
          coordinatorUser: data.coordinatorUser?.name ?? null,
          financialUser: data.financialUser?.name ?? null,
          products:
            params.format === ReportFormatEnum.CSV
              ? data.products.map((product) => `${product.quantity}x$${product.price}:${product.product.name}`).join('|')
              : data.products.map((product) => {
                  return { name: product.product.name, quantity: product.quantity, price: product.price };
                }),
          client: data.client ? `${data.client.account}:${data.client.name}` : null,
          assets: data.assets
            .filter((asset) => asset.status === MediaStatusEnum.UPLOADED)
            .map((asset) => asset.url)
            .join(';'),
          location: this.getGoogleLink(data.location),
        }
    );
  }
}
