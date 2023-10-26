import { AlertService } from '../../../../src/services';
import { AppConfig } from './../../../../src/app.config';
import { ConfigType } from '@nestjs/config';
import { ILogger } from '../../../../src/logger';
import { mockAssignations, mockTimePrevAlert, mockTimePrevService, mockTimeServices } from './mocks-data';
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

  describe('processAlerts by time', () => {
    describe('there is no previous alert', () => {
      it('should create a new alert because meeting conditions with default params', async () => {
        alertService.getPreviousAlert = jest.fn().mockResolvedValue(null);
        alertService.getPreviousService = jest.fn().mockResolvedValue(mockTimePrevService);

        // No custom parameters
        const service = {
          ...mockTimeServices[0],
          params: { ...mockTimeServices[0].params, custom: null, defDays: 90 },
        };
        const unitUser = mockAssignations[0];

        alertService.getUnitCurrentValueByServiceType = jest.fn().mockReturnValue(new Date('2022-05-05').getTime());

        await alertService.processAlertByUser(service, unitUser.user as UserInterface, unitUser.unit as UnitInterface);

        expect(alertService.saveNewAlert).toHaveBeenCalledTimes(1);
      });

      it('should create a new alert because meeting conditions with user custom params', async () => {
        alertService.getPreviousAlert = jest.fn().mockResolvedValue(null);
        alertService.getPreviousService = jest.fn().mockResolvedValue(mockTimePrevService);

        const service = mockTimeServices[0];
        const unitUser = mockAssignations[0];

        alertService.getUnitCurrentValueByServiceType = jest.fn().mockReturnValue(new Date('2022-03-05').getTime());

        await alertService.processAlertByUser(service, unitUser.user as UserInterface, unitUser.unit as UnitInterface);

        expect(alertService.saveNewAlert).toHaveBeenCalledTimes(1);
      });

      it('should not create a new alert because no meeting conditions', async () => {
        alertService.getPreviousAlert = jest.fn().mockResolvedValue(null);
        alertService.getPreviousService = jest.fn().mockResolvedValue(mockTimePrevService);

        const service = mockTimeServices[0];
        const unitUser = mockAssignations[0];

        alertService.getUnitCurrentValueByServiceType = jest.fn().mockReturnValue(new Date('2022-01-25').getTime());

        await alertService.processAlertByUser(service, unitUser.user as UserInterface, unitUser.unit as UnitInterface);

        expect(alertService.saveNewAlert).toHaveBeenCalledTimes(0);
      });

      it('should not create a new alert because no meeting conditions with default params', async () => {
        alertService.getPreviousAlert = jest.fn().mockResolvedValue(null);
        alertService.getPreviousService = jest.fn().mockResolvedValue(mockTimePrevService);

        // No custom parameters
        const service = {
          ...mockTimeServices[0],
          params: { ...mockTimeServices[0].params, custom: null, defDays: 90 },
        };
        const unitUser = mockAssignations[0];
        alertService.getUnitCurrentValueByServiceType = jest.fn().mockReturnValue(new Date('2022-02-05').getTime());

        await alertService.processAlertByUser(service, unitUser.user as UserInterface, unitUser.unit as UnitInterface);

        expect(alertService.saveNewAlert).toHaveBeenCalledTimes(0);
      });

      it('should not create a new alert because no assigned unit to user', async () => {
        alertService.getPreviousAlert = jest.fn().mockResolvedValue(null);
        alertService.getPreviousService = jest.fn().mockResolvedValue(mockTimePrevService);
        alertService.getAllServices = jest.fn().mockResolvedValue([mockTimeServices[0]]);
        alertService.getAllAssignations = jest.fn().mockResolvedValue([]);
        jest.spyOn(alertService, 'processAlertByUser').mockResolvedValue();

        alertService.processAlerts();

        expect(alertService.processAlertByUser).toHaveBeenCalledTimes(0);
      });
    });

    describe('it has previous time alert', () => {
      it('should create a new alert because previous alert was finished', async () => {
        alertService.getPreviousAlert = jest.fn().mockResolvedValue(
          Promise.resolve({
            ...mockTimePrevAlert,
            status: ServiceAlertStatusEnum.FINISHED,
          })
        );
        alertService.getPreviousService = jest.fn().mockResolvedValue(
          Promise.resolve({
            ...mockTimePrevService,
          })
        );

        // No custom parameters
        const service = mockTimeServices[0];
        const unitUser = mockAssignations[0];

        alertService.getUnitCurrentValueByServiceType = jest.fn().mockReturnValue(new Date('2022-05-05').getTime());

        await alertService.processAlertByUser(service, unitUser.user as UserInterface, unitUser.unit as UnitInterface);

        expect(alertService.saveNewAlert).toHaveBeenCalledTimes(1);
      });

      it('should update alert activation because previous alert was opened', async () => {
        alertService.getPreviousAlert = jest.fn().mockResolvedValue(
          Promise.resolve({
            ...mockTimePrevAlert,
            status: ServiceAlertStatusEnum.OPEN,
          })
        );
        alertService.getPreviousService = jest.fn().mockResolvedValue(
          Promise.resolve({
            ...mockTimePrevService,
          })
        );

        // No custom parameters
        const service = mockTimeServices[0];
        const unitUser = mockAssignations[0];

        alertService.getUnitCurrentValueByServiceType = jest.fn().mockReturnValue(new Date('2022-05-05').getTime());

        await alertService.processAlertByUser(service, unitUser.user as UserInterface, unitUser.unit as UnitInterface);

        expect(alertService.saveNewAlert).toHaveBeenCalledTimes(0);
        expect(alertService.updateServiceAlert).toHaveBeenCalledTimes(1);
      });

      it('should not update alert because previous alert is in dismiss period', async () => {
        alertService.getPreviousAlert = jest.fn().mockResolvedValue(
          Promise.resolve({
            ...mockTimePrevAlert,
            status: ServiceAlertStatusEnum.DISMISSED,
            dismissUntilDate: new Date('2023-05-05'),
          })
        );
        alertService.getPreviousService = jest.fn().mockResolvedValue(
          Promise.resolve({
            ...mockTimePrevService,
          })
        );

        // No custom parameters
        const service = mockTimeServices[0];
        const unitUser = mockAssignations[0];
        alertService.getUnitCurrentValueByServiceType = jest.fn().mockReturnValue(new Date('2022-05-05').getTime());

        await alertService.processAlertByUser(service, unitUser.user as UserInterface, unitUser.unit as UnitInterface);

        expect(alertService.saveNewAlert).toHaveBeenCalledTimes(0);
        expect(alertService.updateServiceAlert).toHaveBeenCalledWith(expect.objectContaining({ status: ServiceAlertStatusEnum.DISMISSED }));
      });

      it('should update alert because previous alert was dismissed but ready to open', async () => {
        alertService.getPreviousAlert = jest.fn().mockResolvedValue(
          Promise.resolve({
            ...mockTimePrevAlert,
            status: ServiceAlertStatusEnum.DISMISSED,
            dismissUntilDate: new Date('2021-05-01'),
          })
        );
        alertService.getPreviousService = jest.fn().mockResolvedValue(
          Promise.resolve({
            ...mockTimePrevService,
          })
        );

        // No custom parameters
        const service = mockTimeServices[0];
        const unitUser = mockAssignations[0];
        alertService.getUnitCurrentValueByServiceType = jest.fn().mockReturnValue(new Date('2022-05-05').getTime());

        await alertService.processAlertByUser(service, unitUser.user as UserInterface, unitUser.unit as UnitInterface);

        expect(alertService.saveNewAlert).toHaveBeenCalledTimes(0);
        expect(alertService.updateServiceAlert).toHaveBeenCalledWith(expect.objectContaining({ status: ServiceAlertStatusEnum.OPEN }));
      });
    });
  });
});
