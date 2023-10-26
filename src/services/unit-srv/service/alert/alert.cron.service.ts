import { AlertService } from './alert.service';
import { AppConfig } from '../../../../app.config';
import { ConfigType } from '@nestjs/config';
import { CronJob } from 'cron';
import { ILogger } from '../../../../logger';
import { Inject, Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class AlertCronService {
  constructor(
    @Inject(AppConfig.KEY)
    private config: ConfigType<typeof AppConfig>,
    private schedulerRegistry: SchedulerRegistry,
    @Inject(AlertService)
    private alertService: AlertService,
    private logger: ILogger
  ) {
    const job = new CronJob(this.config.UNIT_SERVICE_ALERT_CRON, () => {
      this.logger.log(`Executing Alert Processing Cron... running at: [${this.config.UNIT_SERVICE_ALERT_CRON}]`);

      this.alertService.processAlerts();
    });

    this.schedulerRegistry.addCronJob('alertProcessing', job);
    job.start();
  }
}
