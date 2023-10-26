import { AlertService } from '../../../../src/services';
import { AppConfig } from './../../../../src/app.config';
import { ConfigType } from '@nestjs/config';
import { ILogger } from '../../../../src/logger';
import { mockAssignations, mockOdometerPrevAlert, mockOdometerPrevService, mockOdometerServices } from './mocks-data';
import { Repository } from 'typeorm';
import { ServiceAlertEntity, ServiceEntity, ServiceUnitEntity, UnitEntity, UnitUserEntity } from '../../../../src/entities';
import { ServiceAlertStatusEnum, UnitInterface, UserInterface } from './../../../../src/shared';

describe('AlertService', () => {
  let serviceRepo: Repository<ServiceEntity>;
  let serviceAlertRepo: Repository<ServiceAlertEntity>;
  let unitServiceRepo: Repository<ServiceUnitEntity>;
  let unitUserRepo: Repository<UnitUserEntity>;
  let unitRepo: Repository<UnitEntity>;
  let config: ConfigType<typeof AppConfig>;
  const logger: ILogger = new ILogger();

  let alertService: AlertService;

  beforeEach(async () => {
    jest.resetAllMocks();
    alertService = new AlertService(serviceRepo, serviceAlertRepo, unitServiceRepo, unitRepo, unitUserRepo, config, logger);
    alertService.saveNewAlert = jest.fn().mockResolvedValue(Promise.resolve(true));
    alertService.updateServiceAlert = jest.fn().mockResolvedValue(Promise.resolve(true));
    alertService.autoFinishAlert = jest.fn().mockResolvedValue(Promise.resolve(false));
  });

  describe('processAlerts by odometer', () => {
    describe('there is no previous alert', () => {
      it('should not create a new alert as there is no previous service', async () => {
        alertService.getPreviousAlert = jest.fn().mockResolvedValue(null);
        alertService.getPreviousService = jest.fn().mockResolvedValue(null);

        const service = {
          ...mockOdometerServices[0],
          params: {
            ...mockOdometerServices[0].params,
            custom: null,
          },
        };
        const unitUser = mockAssignations[0];
        await alertService.processAlertByUser(service, unitUser.user as UserInterface, unitUser.unit as UnitInterface);

        expect(alertService.saveNewAlert).toHaveBeenCalledTimes(0);
      });

      it('should create a new alert as it meets the conditions', async () => {
        alertService.getPreviousAlert = jest.fn().mockResolvedValue(null);
        alertService.getPreviousService = jest.fn().mockResolvedValue(mockOdometerPrevService);

        const service = {
          ...mockOdometerServices[0],
          params: {
            ...mockOdometerServices[0].params,
            custom: null,
          },
        };
        const unitUser = mockAssignations[0];
        await alertService.processAlertByUser(service, unitUser.user as UserInterface, unitUser.unit as UnitInterface);

        expect(alertService.saveNewAlert).toHaveBeenCalledTimes(1);
      });
    });

    describe('it has previous time alert', () => {
      it('should create a new alert because previous alert was finished', async () => {
        alertService.getPreviousAlert = jest.fn().mockResolvedValue(
          Promise.resolve({
            ...mockOdometerPrevAlert,
            status: ServiceAlertStatusEnum.FINISHED,
          })
        );
        alertService.getPreviousService = jest.fn().mockResolvedValue(mockOdometerPrevService);

        const service = {
          ...mockOdometerServices[0],
          params: {
            ...mockOdometerServices[0].params,
            custom: null,
          },
        };
        const unitUser = mockAssignations[0];
        await alertService.processAlertByUser(service, unitUser.user as UserInterface, unitUser.unit as UnitInterface);

        expect(alertService.saveNewAlert).toHaveBeenCalledTimes(1);
      });

      it('should update alert activation because previous alert was opened', async () => {
        alertService.getPreviousAlert = jest.fn().mockResolvedValue(
          Promise.resolve({
            ...mockOdometerPrevAlert,
            status: ServiceAlertStatusEnum.OPEN,
          })
        );
        alertService.getPreviousService = jest.fn().mockResolvedValue(mockOdometerPrevService);

        const service = {
          ...mockOdometerServices[0],
          params: {
            ...mockOdometerServices[0].params,
            custom: null,
          },
        };
        const unitUser = mockAssignations[0];
        await alertService.processAlertByUser(service, unitUser.user as UserInterface, unitUser.unit as UnitInterface);

        expect(alertService.saveNewAlert).toHaveBeenCalledTimes(0);
        expect(alertService.updateServiceAlert).toHaveBeenCalledTimes(1);
      });

      it('should not update alert because previous alert is in dismiss period', async () => {
        alertService.getPreviousAlert = jest.fn().mockResolvedValue(
          Promise.resolve({
            ...mockOdometerPrevAlert,
            status: ServiceAlertStatusEnum.DISMISSED,
            dismissUntilOdometer: 1000000,
          })
        );
        alertService.getPreviousService = jest.fn().mockResolvedValue(mockOdometerPrevService);

        const service = {
          ...mockOdometerServices[0],
          params: {
            ...mockOdometerServices[0].params,
            custom: null,
          },
        };
        const unitUser = mockAssignations[0];
        await alertService.processAlertByUser(service, unitUser.user as UserInterface, unitUser.unit as UnitInterface);

        expect(alertService.saveNewAlert).toHaveBeenCalledTimes(0);
        expect(alertService.updateServiceAlert).toHaveBeenCalledWith(expect.objectContaining({ status: ServiceAlertStatusEnum.DISMISSED }));
      });

      it('should update alert because previous alert was dismissed but ready to open', async () => {
        alertService.getPreviousAlert = jest.fn().mockResolvedValue(
          Promise.resolve({
            ...mockOdometerPrevAlert,
            status: ServiceAlertStatusEnum.DISMISSED,
            dismissUntilOdometer: 49999,
          })
        );
        alertService.getPreviousService = jest.fn().mockResolvedValue(mockOdometerPrevService);

        const service = {
          ...mockOdometerServices[0],
          params: {
            ...mockOdometerServices[0].params,
            custom: null,
          },
        };
        const unitUser = mockAssignations[0];
        await alertService.processAlertByUser(service, unitUser.user as UserInterface, unitUser.unit as UnitInterface);

        expect(alertService.saveNewAlert).toHaveBeenCalledTimes(0);
        expect(alertService.updateServiceAlert).toHaveBeenCalledWith(expect.objectContaining({ status: ServiceAlertStatusEnum.OPEN }));
      });
    });
  });
});
