import { addDays } from 'date-fns';
import {
  ServiceAlertInterface,
  ServiceAlertPivotInterface,
  ServiceCustomParamInterface,
  ServiceFreqTypeEnum,
  ServiceParamOdometerInterface,
  ServiceParamTimeInterface,
  ServiceUnitInterface,
  UnitUserInterface,
} from '../shared';

export const getAllAssignationsToProcess = (customParams: ServiceCustomParamInterface[], assignations: UnitUserInterface[]): UnitUserInterface[] => {
  if (!customParams) return assignations;

  const applicableIds = customParams.map((custom: ServiceCustomParamInterface) => custom?.unitId);

  return assignations.filter((assig) => applicableIds.includes(assig.unit.id));
};

export const getParamPerUnit = (unitId: string, customServiceParams: ServiceCustomParamInterface[]): ServiceCustomParamInterface => {
  return customServiceParams?.filter((param) => param.unitId === unitId)?.[0];
};

export const getAlertPivotDate = (prevServiceDate: Date, paramPerUnitInitDate: Date, paramDefInitDate: Date, paramPerUnitDays: number, paramDefDays: number): ServiceAlertPivotInterface => {
  const paramDate = paramPerUnitInitDate ?? paramDefInitDate;
  const pivotDays = paramPerUnitDays ?? paramDefDays;
  return { expectedPivotValue: addDays(prevServiceDate ?? paramDate, pivotDays).getTime(), offset: pivotDays };
};

export const getAlertPivotOdometer = (prevServiceOdometer: number, paramPerUnitOdometer: number, paramDefOdometer: number): ServiceAlertPivotInterface | null => {
  if (prevServiceOdometer === null) return null;
  const offsetOdometer = paramPerUnitOdometer ?? paramDefOdometer;
  return { expectedPivotValue: prevServiceOdometer + offsetOdometer, offset: offsetOdometer };
};

export const ifString = (value: Date | string | undefined): boolean => {
  return typeof value === 'string';
};

export const getPivotValue = (
  alertType: ServiceFreqTypeEnum,
  prevService: ServiceUnitInterface,
  paramPerUnit: ServiceCustomParamInterface,
  serviceParams: ServiceParamTimeInterface | ServiceParamOdometerInterface
): ServiceAlertPivotInterface | null => {
  if (alertType === ServiceFreqTypeEnum.TIME)
    return getAlertPivotDate(
      prevService?.date,
      ifString(paramPerUnit?.initDate) ? new Date(paramPerUnit?.initDate) : paramPerUnit?.initDate,
      ifString((serviceParams as ServiceParamTimeInterface).defInitDate)
        ? new Date((serviceParams as ServiceParamTimeInterface).defInitDate)
        : (serviceParams as ServiceParamTimeInterface).defInitDate,
      paramPerUnit?.days,
      (serviceParams as ServiceParamTimeInterface).defDays
    );
  else {
    return getAlertPivotOdometer(prevService?.odometer, paramPerUnit?.kilometers, (serviceParams as ServiceParamOdometerInterface).defKilometers);
  }
};

export const getDismissUntilValue = (alertType: ServiceFreqTypeEnum, service: ServiceAlertInterface): number => {
  if (alertType === ServiceFreqTypeEnum.TIME) return service.dismissUntilDate?.getTime();
  else return service.dismissUntilOdometer;
};

export const getNowDate = () => {
  const nowDate = new Date();
  nowDate.setHours(0, 0, 0, 0);
  return nowDate;
};
