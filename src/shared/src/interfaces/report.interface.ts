import { ReportFormatEnum, ReportTypeEnum } from './../enums';
import { ServiceParamOdometerInterface, ServiceParamTimeInterface } from './unit-srv/service.interface';

export interface ReportParamsInterface {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  unitId?: string;
  type: ReportTypeEnum;
  format: ReportFormatEnum;
}

export interface BaseUnitReportInterface {
  date: Date;
  userId: string;
  user: string;
  userName: string;
  unitId: string;
  unitName: string;
  plate: string;
  odometer: number;
  total: number;
  comments: string;
  location: string;
  assets: string;
}

export interface UnitFuelingReportInterface extends BaseUnitReportInterface {
  liters: number;
  performance: number;
}

export interface UnitServiceReportInterface extends BaseUnitReportInterface {
  serviceId: string;
  serviceName: string;
  serviceType: string;
  serviceParams: ServiceParamTimeInterface | ServiceParamOdometerInterface;
}

export interface DateRangeParamsInterface {
  startDate?: Date;
  endDate?: Date;
}

export interface TechServiceReportInterface {
  serviceNumber: string;
  serviceDate: Date;
  description: string;
  additionalData: string;
  estimatedTime: number;
  serviceDateEnd: Date;
  status: string;
  priority: string;
  quiz: string;
  overallRate: number;
  extraCharge: number;
  extraChargeComment: string;
  totalAmount: number;
  comments: string;
  location: string;
  assets: string;
  client: { account: string; name: string } | string;
  technicianUser: string;
  coordinatorUser: string;
  financialUser: string;
  products: { name: string; quantity: number; price: number }[] | string;
}
