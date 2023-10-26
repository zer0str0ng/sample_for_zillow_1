import {
  ServiceAlertInterface,
  ServiceAlertStatusEnum,
  ServiceFreqTypeEnum,
  ServiceInterface,
  ServiceParamOdometerInterface,
  ServiceParamTimeInterface,
  ServiceUnitInterface,
  UnitInterface,
  UnitStatusEnum,
  UnitUserInterface,
  UserInterface,
} from './../../../../src/shared';

export const mockAssignations = [
  <UnitUserInterface>{
    isActive: true,
    status: UnitStatusEnum.ASSIGNED,
    user: {
      id: '1',
      name: 'Mock User 1',
      username: 'username1',
      isActive: true,
    } as UserInterface,
    unit: { id: '1', odometer: 50000, isActive: true } as UnitInterface,
  },
  <UnitUserInterface>{
    isActive: true,
    status: UnitStatusEnum.ASSIGNED,
    user: { id: '2', name: 'Mock User 2', username: 'username2', isActive: true } as UserInterface,
    unit: { id: '2', odometer: 1000, isActive: true } as UnitInterface,
  },
] as UnitUserInterface[];

export const mockOdometerPrevAlert: ServiceAlertInterface = {
  isActive: true,
  status: ServiceAlertStatusEnum.OPEN,
} as ServiceAlertInterface;

export const mockTimePrevAlert: ServiceAlertInterface = {
  isActive: true,
  status: ServiceAlertStatusEnum.OPEN,
} as ServiceAlertInterface;

export const mockTimePrevService: ServiceUnitInterface = {
  isActive: true,
  date: new Date(2021, 12, 1),
} as ServiceUnitInterface;

export const mockOdometerPrevService: ServiceUnitInterface = {
  isActive: true,
  date: new Date(2021, 12, 1),
  odometer: 30000,
} as ServiceUnitInterface;

export const mockTimeServices: ServiceInterface[] = [
  {
    id: '1',
    alertActive: true,
    freqType: ServiceFreqTypeEnum.TIME,
    name: 'Pulida de vehiculo',
    isActive: true,
    params: {
      defDays: 30,
      defInitDate: new Date(2022, 1, 1),
      custom: [
        {
          unitId: '1',
          initDate: new Date(2022, 1, 2),
          days: 30,
        },
        {
          unitId: '2',
          initDate: new Date(2022, 1, 2),
          days: 30,
        },
      ],
    } as ServiceParamTimeInterface,
  } as ServiceInterface,
];

export const mockOdometerServices: ServiceInterface[] = [
  {
    id: '1',
    alertActive: true,
    freqType: ServiceFreqTypeEnum.ODOMETER,
    name: 'Cambio de llantas de vehiculo',
    isActive: true,
    params: {
      defKilometers: 15000,
      custom: [
        {
          unitId: '1',
          kilometers: 12000,
        },
      ],
    } as ServiceParamOdometerInterface,
  } as ServiceInterface,
];
