import { AlertService } from '../../../../src/services';
import { AppConfig } from './../../../../src/app.config';
import { ConfigType } from '@nestjs/config';
import { ILogger } from '../../../../src/logger';
import { mockAssignations, mockOdometerServices } from './mocks-data';
import { Repository } from 'typeorm';
import { ServiceAlertDismissInterface, ServiceAlertStatusEnum, ServiceFreqTypeEnum } from './../../../../src/shared';
import { ServiceAlertEntity, ServiceEntity, ServiceUnitEntity, UnitEntity, UnitUserEntity } from '../../../../src/entities';

describe('AlertService', () => {
  let serviceRepo = {} as unknown as Repository<ServiceEntity>;
  let serviceAlertRepo = {} as unknown as Repository<ServiceAlertEntity>;
  let unitServiceRepo = {} as unknown as Repository<ServiceUnitEntity>;
  let userUnitRepo = {} as unknown as Repository<UnitUserEntity>;
  let unitRepo = {} as unknown as Repository<UnitEntity>;
  let config: ConfigType<typeof AppConfig>;
  let logger: ILogger = new ILogger();

  let alertService: AlertService;

  beforeEach(async () => {
    alertService = new AlertService(serviceRepo, serviceAlertRepo, unitServiceRepo, unitRepo, userUnitRepo, config, logger);
    jest.resetAllMocks();
  });

  describe('processAlerts for admin', () => {
    it('process multiple alerts', async () => {
      alertService.getAllAssignations = jest.fn().mockResolvedValue(Promise.resolve(mockAssignations));
      alertService.getAllServices = jest.fn().mockResolvedValue(Promise.resolve(mockOdometerServices));
      alertService.processAlert = jest.fn().mockReturnValue(true);

      await alertService.processAlerts();

      expect(alertService.getAllAssignations).toHaveBeenCalledTimes(1);
      expect(alertService.getAllServices).toHaveBeenCalledTimes(1);
      expect(alertService.processAlert).toHaveBeenCalled();
    });

    it('gets service by id', async () => {
      const id = '123';
      serviceRepo.find = jest.fn().mockResolvedValue(Promise.resolve([{ id }]));

      await alertService.getAllServices(id);

      expect(serviceRepo.find).toHaveBeenCalledTimes(1);
    });

    it('should dismiss an odometer alert', async () => {
      serviceAlertRepo.find = jest.fn().mockResolvedValue(
        Promise.resolve([
          {
            unit: { id: 123 },
            service: { freqType: ServiceFreqTypeEnum.ODOMETER },
          },
        ])
      );

      unitRepo.findOne = jest.fn().mockResolvedValue(Promise.resolve({ odometer: 300 }));

      alertService.updateServiceAlert = jest.fn().mockResolvedValue(Promise.resolve({}));

      const baseAlert: ServiceAlertDismissInterface = {
        id: '123',
        status: ServiceAlertStatusEnum.DISMISSED,
        dismissForKilometers: 500,
      };

      await alertService.dismissAlert('123', baseAlert);

      expect(serviceAlertRepo.find).toHaveBeenCalledTimes(1);
      expect(unitRepo.findOne).toHaveBeenCalledTimes(1);
      expect(alertService.updateServiceAlert).toHaveBeenCalledTimes(1);
    });

    it('should dismiss a time alert', async () => {
      serviceAlertRepo.find = jest.fn().mockResolvedValue(
        Promise.resolve([
          {
            unit: { id: 123 },
            service: { freqType: ServiceFreqTypeEnum.TIME },
          },
        ])
      );

      unitRepo.findOne = jest.fn().mockResolvedValue(Promise.resolve({ odometer: 300 }));

      alertService.updateServiceAlert = jest.fn().mockResolvedValue(Promise.resolve({}));

      const baseAlert: ServiceAlertDismissInterface = {
        id: '123',
        status: ServiceAlertStatusEnum.DISMISSED,
        dismissForDays: 10,
      };

      await alertService.dismissAlert('123', baseAlert);

      expect(serviceAlertRepo.find).toHaveBeenCalledTimes(1);
      expect(unitRepo.findOne).toHaveBeenCalledTimes(1);
      expect(alertService.updateServiceAlert).toHaveBeenCalledTimes(1);
    });

    it('should fail dismissing a time alert because passing invalid odometer service id', async () => {
      serviceAlertRepo.find = jest.fn().mockResolvedValue(
        Promise.resolve([
          {
            unit: { id: 123 },
            service: { freqType: ServiceFreqTypeEnum.ODOMETER },
          },
        ])
      );

      unitRepo.findOne = jest.fn().mockResolvedValue(Promise.resolve({ odometer: 300 }));

      alertService.updateServiceAlert = jest.fn().mockResolvedValue(Promise.resolve({}));

      const baseAlert: ServiceAlertDismissInterface = {
        id: '123',
        status: ServiceAlertStatusEnum.DISMISSED,
        dismissForDays: 10,
      };

      expect(alertService.dismissAlert('123', baseAlert)).rejects.toThrowError(
        'Service type [ODOMETER] does not match with provided parameters [{"baseAlert":{"id":"123","status":"DISMISSED","dismissForDays":10}}]'
      );
    });

    it('should fail dismissing a odometer alert because passing invalid time service id', async () => {
      serviceAlertRepo.find = jest.fn().mockResolvedValue(
        Promise.resolve([
          {
            unit: { id: 123 },
            service: { freqType: ServiceFreqTypeEnum.TIME },
          },
        ])
      );

      unitRepo.findOne = jest.fn().mockResolvedValue(Promise.resolve({ odometer: 300 }));

      alertService.updateServiceAlert = jest.fn().mockResolvedValue(Promise.resolve({}));

      const baseAlert: ServiceAlertDismissInterface = {
        id: '123',
        status: ServiceAlertStatusEnum.DISMISSED,
        dismissForKilometers: 10,
      };

      expect(alertService.dismissAlert('123', baseAlert)).rejects.toThrowError(
        'Service type [TIME] does not match with provided parameters [{"baseAlert":{"id":"123","status":"DISMISSED","dismissForKilometers":10}}]'
      );
    });

    it('should fail because not finding the alert', async () => {
      serviceAlertRepo.find = jest.fn().mockResolvedValue(Promise.resolve([]));

      alertService.updateServiceAlert = jest.fn().mockResolvedValue(Promise.resolve({}));

      const baseAlert: ServiceAlertDismissInterface = {
        id: '123',
        status: ServiceAlertStatusEnum.DISMISSED,
        dismissForKilometers: 500,
      };

      expect(alertService.dismissAlert('123', baseAlert)).rejects.toThrowError('Error dismissing alert, the id to dismiss does not exist in the db');

      expect(serviceAlertRepo.find).toHaveBeenCalledTimes(1);
      expect(alertService.updateServiceAlert).toHaveBeenCalledTimes(0);
    });

    it('should fail because no odometer', async () => {
      serviceAlertRepo.find = jest.fn().mockResolvedValue(
        Promise.resolve([
          {
            unit: { id: 123 },
            service: { freqType: ServiceFreqTypeEnum.ODOMETER },
          },
        ])
      );

      unitRepo.findOne = jest.fn().mockResolvedValue(Promise.resolve());

      alertService.updateServiceAlert = jest.fn().mockResolvedValue(Promise.resolve({}));

      const baseAlert: ServiceAlertDismissInterface = {
        id: '123',
        status: ServiceAlertStatusEnum.DISMISSED,
        dismissForKilometers: 500,
      };

      expect(alertService.dismissAlert('123', baseAlert)).rejects.toThrowError('Unexpected error while dismissing alert, no dismissing parameters were calculated');
      expect(serviceAlertRepo.find).toHaveBeenCalledTimes(1);
      expect(alertService.updateServiceAlert).toHaveBeenCalledTimes(0);
    });
  });
});
